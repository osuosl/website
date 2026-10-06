#!/usr/bin/env node
// Check that .github/dependabot.yml still limits version updates to Font
// Awesome's minor and patch releases without touching security updates (see
// the comment in that file). Dependabot applies allow lists, name-only ignore
// rules and ignored versions to security updates too, so the file may hold one
// npm entry with no allow list, and one ignore rule per direct dependency
// (the types Dependabot reads for npm) with only dependency-name and
// update-types: semver-major for Font Awesome, all three levels for the rest.
// Any other key on the npm entry has to be one that can't narrow security
// updates; options such as exclude-paths, target-branch, groups or
// versioning-strategy are refused rather than reasoned about.
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FONT_AWESOME = "@fortawesome/fontawesome-free";
const MAJOR = "version-update:semver-major";
const NPM_KEYS = [
  "package-ecosystem",
  "directory",
  "schedule",
  "ignore",
  "labels",
  "assignees",
  "milestone",
  "commit-message",
  "open-pull-requests-limit",
  "cooldown",
];
const ALL = [MAJOR, "version-update:semver-minor", "version-update:semver-patch"];

const pkg = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies, ...pkg.optionalDependencies });
const problems = [];

let config;
try {
  config = parse(readFileSync(path.join(ROOT, ".github/dependabot.yml"), "utf8"));
} catch (error) {
  console.error(`.github/dependabot.yml isn't valid YAML: ${error.message}`);
  process.exit(1);
}

const updates = Array.isArray(config?.updates) ? config.updates : [];
for (const entry of updates) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    problems.push(`every updates entry in dependabot.yml must be a mapping, not ${JSON.stringify(entry)}`);
    continue;
  }
  if ("allow" in entry) {
    problems.push(`the ${entry["package-ecosystem"]} entry has an allow list, which would also limit security updates`);
  }
}
const npm = updates.filter((entry) => entry && typeof entry === "object" && entry["package-ecosystem"] === "npm");
if (npm.length !== 1) {
  problems.push(`dependabot.yml needs exactly one npm entry, not ${npm.length}`);
} else {
  const extra = Object.keys(npm[0]).filter((key) => !NPM_KEYS.includes(key));
  if (extra.length) {
    problems.push(
      `the npm entry has ${extra.join(", ")}, which scripts/check-dependabot.mjs doesn't allow; see the comment there`,
    );
  }
  if (npm[0].directory !== "/") {
    problems.push(`the npm entry's directory must be "/", not ${JSON.stringify(npm[0].directory)}`);
  }
}

const rules = npm.length === 1 && Array.isArray(npm[0].ignore) ? npm[0].ignore : [];
const names = [];
for (const rule of rules) {
  const name = rule?.["dependency-name"];
  const label = typeof name === "string" ? name : JSON.stringify(rule);
  const extra = Object.keys(rule ?? {}).filter((key) => !["dependency-name", "update-types"].includes(key));
  if (extra.length) {
    problems.push(
      `the ignore rule for ${label} has ${extra.join(", ")}; only dependency-name and update-types are safe`,
    );
  }
  if (typeof name !== "string" || !deps.includes(name)) {
    problems.push(`the ignore rule for ${label} must name one direct dependency exactly, with no wildcards`);
    continue;
  }
  if (names.includes(name)) {
    problems.push(`${name} has more than one ignore rule`);
  }
  names.push(name);
  const types = rule["update-types"];
  const want = name === FONT_AWESOME ? [MAJOR] : ALL;
  if (!Array.isArray(types) || types.length !== want.length || !want.every((type) => types.includes(type))) {
    problems.push(`the ignore rule for ${name} needs update-types ${JSON.stringify(want)}`);
  }
}
for (const dep of deps.filter((dep) => !names.includes(dep))) {
  problems.push(`${dep} has no ignore rule in dependabot.yml, so it would get weekly version update PRs`);
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`dependabot.yml covers all ${deps.length} direct dependencies.`);
