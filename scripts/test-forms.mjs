#!/usr/bin/env node
// Submit every request form to a local DRY_RUN formsender in a real browser and
// save the ticket each submission produces (README: "Testing the request forms").
//
// It needs `hugo server --environment formtest` and the compose formsender
// (scripts/formsender-test.sh -d) running, and refuses to submit to any form
// whose action isn't on localhost. Scenarios are discovered from the pages:
// each service, each choice that reveals other questions, everything at once,
// and each of the other forms. Every visible field gets the answer in
// scripts/form-test-answers.mjs, or a generic one when it has none there.
//
//   npm run test:forms                        # everything
//   npm run test:forms -- --only mirror       # scenarios whose name matches
//   npm run test:forms -- --base http://localhost:1314 --out /tmp/tickets
//
// FORM_TEST_BROWSER picks the Playwright browser channel (default "chrome",
// the installed Google Chrome); set it to "" for Playwright's own Chromium.
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ANSWERS, CHECKED } from "./form-test-answers.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FORMS = [
  { key: "hosting", path: "/services/hosting/request/" },
  { key: "powerdev-hosting", path: "/services/powerdev/request-hosting/" },
  { key: "aarch64-hosting", path: "/services/aarch64/request-hosting/" },
  { key: "powerdev-ci", path: "/services/powerdev/request-ci/" },
  { key: "ibm-z-ci", path: "/services/ibm-z/request-ci/" },
];
// Cloudflare's documented dummy token, accepted by the test secret compose.yaml sets.
const TURNSTILE_TOKEN = "XXXX.DUMMY.TOKEN.XXXX";

function parseArgs(argv) {
  const opts = { base: "http://localhost:1313", out: path.join(ROOT, "tmp/form-tickets"), only: null };
  for (let i = 0; i < argv.length; i++) {
    const [flag, value] = [argv[i], argv[i + 1]];
    if (flag === "--base") opts.base = value.replace(/\/$/, "");
    else if (flag === "--out") opts.out = path.resolve(value);
    else if (flag === "--only") opts.only = new RegExp(value);
    else throw new Error(`unknown option ${flag}`);
    i++;
  }
  return opts;
}

function slug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function compose(...args) {
  return execFileSync("docker", ["compose", ...args], { cwd: ROOT, encoding: "utf8" });
}

// Runs in the page: list the scenarios this form supports.
function discoverScenarios() {
  const form = document.querySelector(".webform-client-form");
  // The checkboxes and choices that must be set before el is shown, outermost first.
  const chainFor = (el) => {
    const checks = [];
    const set = {};
    let cur = el.parentElement;
    for (let guard = 0; cur && guard < 20; guard++) {
      const toggleGroup = cur.closest(".form-toggle-fields");
      const shown = cur.closest("[data-shown-when]");
      let source = null;
      if (shown && (!toggleGroup || toggleGroup.contains(shown))) {
        source = document.getElementById(shown.dataset.shownWhen);
        if (source.type === "checkbox") checks.unshift(source.name);
        else set[source.name] = JSON.parse(shown.dataset.shownValues)[0];
      } else if (toggleGroup) {
        source = form.querySelector(`input[data-reveals="${toggleGroup.id}"]`);
        checks.unshift(source.name);
      }
      cur = source ? source.parentElement : null;
    }
    return { checks, set };
  };
  const scenarios = [];
  const toggles = [...form.querySelectorAll("input[data-reveals]")];
  for (const toggle of toggles) {
    const { checks, set } = chainFor(toggle);
    const nested = checks.length > 0;
    scenarios.push({ name: `${nested ? "choice" : "service"}-${toggle.name}`, checks: [...checks, toggle.name], set });
  }
  const sources = new Set([...form.querySelectorAll("[data-shown-when]")].map((w) => w.dataset.shownWhen));
  for (const id of sources) {
    const source = document.getElementById(id);
    if (!source || source.matches("input[data-reveals]")) continue;
    const { checks, set } = chainFor(source);
    if (source.tagName === "SELECT") {
      for (const option of [...source.options].filter((o) => o.value)) {
        scenarios.push({
          name: `${source.name}-${option.value}`,
          checks,
          set: { ...set, [source.name]: option.value },
        });
      }
    } else if (source.type === "checkbox") {
      scenarios.push({ name: `choice-${source.name}`, checks: [...checks, source.name], set });
    }
  }
  const allBoxes = [...form.querySelectorAll('input[type="checkbox"]')].map((b) => b.name);
  scenarios.push(
    toggles.length ? { name: "everything", checks: allBoxes, set: {} } : { name: "default", checks: [], set: {} },
  );
  return scenarios;
}

// Runs in the page: apply a scenario, answer every visible field, and report
// whether the browser would accept the form.
function fillForm({ checks, set, answers, checked, token }) {
  const form = document.querySelector(".webform-client-form");
  const visible = (el) => !el.matches(":disabled") && (el.checkVisibility ? el.checkVisibility() : el.offsetParent);
  const fire = (el) => {
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  };
  const labelOf = (el) =>
    (form.querySelector(`label[for="${el.id}"]`)?.textContent || el.name).replace(/\s*\*$/, "").trim();
  const missing = new Set();
  // A generic answer, for fields form-test-answers.mjs doesn't cover.
  const sample = (el) => {
    missing.add(el.name);
    if (el.type === "email") return "jane.doe@example.org";
    if (el.type === "number") return Number(el.min) > 2 ? el.min : "2";
    if (/url/.test(el.name)) return "https://example.org/";
    const text = el.tagName === "TEXTAREA" ? `Sample answer for "${labelOf(el)}".` : `Sample ${labelOf(el)}`;
    return text.slice(0, el.maxLength > 0 ? el.maxLength : undefined);
  };
  for (let pass = 0; pass < 20; pass++) {
    let changed = 0;
    for (const name of [...checks, ...checked]) {
      for (const box of form.querySelectorAll(`input[type="checkbox"][name="${name}"]`)) {
        if (visible(box) && !box.checked) {
          box.click();
          changed++;
        }
      }
    }
    for (const [name, value] of Object.entries(set)) {
      const el = form.elements.namedItem(name);
      if (el && visible(el) && el.value !== value) {
        el.value = value;
        fire(el);
        changed++;
      }
    }
    for (const el of form.elements) {
      const answerable = el.matches("select, textarea, input:not([type=hidden], [type=checkbox], [type=submit])");
      if (!answerable || !visible(el) || el.name in set || el.value || answers[el.name] === "") continue;
      if (el.tagName === "SELECT") {
        const options = [...el.options].filter((o) => o.value);
        const answer = options.find((o) => o.value === answers[el.name]) ?? options[0];
        if (!answer) continue;
        if (answer.value !== answers[el.name]) missing.add(el.name);
        el.value = answer.value;
      } else {
        el.value = el.name in answers ? answers[el.name] : sample(el);
      }
      fire(el);
      changed++;
    }
    for (const group of form.querySelectorAll("fieldset[data-required-group]")) {
      const boxes = [...group.querySelectorAll('input[type="checkbox"]')].filter(visible);
      if (visible(group) && boxes.length && !boxes.some((b) => b.checked)) {
        boxes[0].click();
        changed++;
      }
    }
    if (!changed) break;
  }
  let tokenField = form.querySelector('[name="cf-turnstile-response"]');
  if (!tokenField) {
    tokenField = document.createElement("input");
    tokenField.type = "hidden";
    tokenField.name = "cf-turnstile-response";
    form.appendChild(tokenField);
  }
  tokenField.value = token;
  // Clicking Submit arms the required checkbox-group checks in request-form.js;
  // cancel that submission so the caller can submit once the form is checked.
  const hold = (event) => event.preventDefault();
  form.addEventListener("submit", hold);
  form.querySelector('button[type="submit"]').click();
  form.removeEventListener("submit", hold);
  const invalid = [...form.elements].filter((el) => el.willValidate && !el.checkValidity()).map((el) => el.name);
  // What gets submitted, to spot scenarios that end up with the same answers.
  const answered = [...new FormData(form)]
    .filter(([name, value]) => name !== "cf-turnstile-response" && value !== "")
    .map(([name, value]) => `${name}=${value}`)
    .join("\n");
  return { action: form.action, invalid, answered, missing: [...missing] };
}

// The DRY_RUN tickets formsender has logged since the given time, oldest first.
function ticketsSince(since) {
  const log = compose("logs", "--no-log-prefix", "--since", since, "formsender");
  const tickets = [];
  for (const chunk of log.split("DRY_RUN ticket (not sent to RT)\n").slice(1)) {
    const lines = [];
    for (const line of chunk.split("\n")) {
      if (/^(INFO|DEBUG|WARNING|ERROR|CRITICAL) |^\[\d{4}-|^\S+ - - \[|^- \S+ - - \[/.test(line)) break;
      lines.push(line);
    }
    tickets.push(lines.join("\n").trimEnd() + "\n");
  }
  return tickets;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!compose("ps", "-q", "formsender").trim()) {
    throw new Error("formsender isn't running; start it with scripts/formsender-test.sh -d");
  }
  const channel = process.env.FORM_TEST_BROWSER ?? "chrome";
  const browser = await chromium.launch(channel ? { channel } : {});
  const page = await browser.newPage();
  await page.route("https://challenges.cloudflare.com/**", (route) => route.abort());
  const results = [];
  const submitted = new Map();
  const missing = new Set();
  try {
    for (const form of FORMS) {
      await page.goto(opts.base + form.path, { waitUntil: "domcontentloaded" });
      const scenarios = await page.evaluate(discoverScenarios);
      for (const scenario of scenarios) {
        const name = `${form.key}/${slug(scenario.name)}`;
        if (opts.only && !opts.only.test(name)) continue;
        const file = path.join(opts.out, `${name}.txt`);
        await page.goto(opts.base + form.path, { waitUntil: "domcontentloaded" });
        const filled = await page.evaluate(fillForm, {
          ...scenario,
          answers: ANSWERS,
          checked: CHECKED,
          token: TURNSTILE_TOKEN,
        });
        const { action, invalid, answered } = filled;
        filled.missing.forEach((field) => missing.add(field));
        const host = new URL(action).hostname;
        if (!["localhost", "127.0.0.1", "::1"].includes(host)) {
          throw new Error(`${form.path} posts to ${action}; run hugo server --environment formtest`);
        }
        if (invalid.length) {
          results.push({ name, ok: false, note: `form not accepted, invalid: ${invalid.join(", ")}` });
          continue;
        }
        if (submitted.has(answered)) {
          rmSync(file, { force: true });
          results.push({ name, ok: true, skipped: true, note: `same answers as ${submitted.get(answered)}` });
          continue;
        }
        submitted.set(answered, name);
        // The previous ticket is already in the log, so the first one after now is this one.
        const since = new Date().toISOString();
        await Promise.all([
          page.waitForURL(/form-submitted/, { timeout: 15000 }),
          page.evaluate(() => document.querySelector(".webform-client-form").requestSubmit()),
        ]);
        if (new URL(page.url()).search) {
          results.push({ name, ok: false, note: `formsender redirected with ${new URL(page.url()).search}` });
          continue;
        }
        let ticket = null;
        for (let attempt = 0; !ticket && attempt < 20; attempt++) {
          ticket = ticketsSince(since)[0];
          if (!ticket) await new Promise((resolve) => setTimeout(resolve, 500));
        }
        if (!ticket) {
          results.push({ name, ok: false, note: "no ticket found in the formsender log" });
          continue;
        }
        mkdirSync(path.dirname(file), { recursive: true });
        writeFileSync(file, ticket);
        results.push({ name, ok: true, note: path.relative(process.cwd(), file) });
      }
    }
  } finally {
    await browser.close();
  }
  for (const r of results) console.log(`${r.skipped ? "skip" : r.ok ? "ok  " : "FAIL"} ${r.name}  ${r.note}`);
  const failed = results.filter((r) => !r.ok).length;
  const sent = results.filter((r) => !r.skipped).length;
  console.log(`\n${sent - failed} of ${sent} submissions produced a ticket`);
  if (missing.size) {
    console.log(`\nNo answer in scripts/form-test-answers.mjs for: ${[...missing].sort().join(", ")}`);
  }
  process.exitCode = failed ? 1 : 0;
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
