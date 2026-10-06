#!/usr/bin/env node
// Copy Font Awesome Free icons from the npm package into assets/icons, keep
// them in step with the version package.json pins, and check that nobody has
// edited them (README: "Icons"). The site builds from the copies, so the
// deploy host needs no Node; layouts/_partials/icon.html renders them.
//
//   npm run icons -- add solid/wrench regular/envelope   # copy new icons
//   npm run icons -- sync                                # re-copy after a bump
//   npm run icons -- check                               # fail on any drift
//   node scripts/fontawesome-icons.mjs apply <dir>      # take synced icons
//
// "apply" is for .github/workflows/fontawesome-sync.yml, which holds a write
// token and installs no npm packages. It checks a directory of icons
// extracted from the release tarball and only then copies it over
// assets/icons.
//
// Names are <style>/<name> as on fontawesome.com, where the style is solid,
// regular or brands; a bare name means solid. The copies are byte for byte,
// Font Awesome's attribution comment included.
import { copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PACKAGE = path.join(ROOT, "node_modules/@fortawesome/fontawesome-free");
const SOURCE = path.join(PACKAGE, "svgs");
const ICONS = path.join(ROOT, "assets/icons");
const STYLES = ["solid", "regular", "brands"];
// Every Font Awesome Free SVG is one <svg> with a viewBox, the attribution
// comment and a single <path>. icon.html inlines the files into every page,
// so anything else, such as a script or an event handler, is refused here and
// again in the Hugo build.
const SHAPE =
  /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="\d+ \d+ \d+ \d+"><!--![^<>]*--><path (?:fill="currentColor" )?d="[0-9A-Za-z .,-]+"\/><\/svg>\s*$/;

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parse(name) {
  const parts = name.split("/");
  const [style, icon] = parts.length === 1 ? ["solid", name] : parts;
  if (parts.length > 2 || !STYLES.includes(style) || !/^[a-z0-9-]+$/.test(icon)) {
    fail(`"${name}" isn't <style>/<name> with a style of ${STYLES.join(", ")} (a bare name means solid).`);
  }
  return `${style}/${icon}`;
}

// Every icon the site has copied, as <style>/<name>.
function copied() {
  return STYLES.flatMap((style) => {
    const dir = path.join(ICONS, style);
    return existsSync(dir)
      ? readdirSync(dir, { withFileTypes: true })
          .filter((entry) => entry.isFile() && entry.name.endsWith(".svg"))
          .map((entry) => `${style}/${entry.name.slice(0, -4)}`)
      : [];
  }).sort();
}

const plain = (file) => SHAPE.test(readFileSync(file, "utf8"));
// The version in a file's attribution comment; icon.html and the sync
// workflow read it with the same pattern.
const versionOf = (file) => readFileSync(file, "utf8").match(/Font Awesome Free (\d+\.\d+\.\d+) /)?.[1];

// Anything in assets/icons that isn't <style>/<name>.svg, which icon.html
// can't render as a Font Awesome icon. .DS_Store files from macOS are left
// alone; git doesn't track them.
function strays() {
  if (!existsSync(ICONS)) {
    return [];
  }
  return readdirSync(ICONS, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".DS_Store") {
      return [];
    }
    if (!entry.isDirectory() || !STYLES.includes(entry.name)) {
      return [`assets/icons/${entry.name}`];
    }
    return readdirSync(path.join(ICONS, entry.name), { withFileTypes: true })
      .filter((file) => !(file.isFile() && file.name.endsWith(".svg")) && file.name !== ".DS_Store")
      .map((file) => `assets/icons/${entry.name}/${file.name}`);
  });
}

const source = (icon) => path.join(SOURCE, `${icon}.svg`);
const target = (icon) => path.join(ICONS, `${icon}.svg`);

// The version package.json pins; the Hugo build reads the same entry.
function pinnedVersion() {
  const pinned = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8")).devDependencies?.[
    "@fortawesome/fontawesome-free"
  ];
  if (!pinned) {
    fail("package.json must list @fortawesome/fontawesome-free in devDependencies, which the Hugo build reads.");
  }
  if (!/^\d+\.\d+\.\d+$/.test(pinned)) {
    fail(`package.json must pin an exact @fortawesome/fontawesome-free version, not ${pinned}.`);
  }
  return pinned;
}

// The installed package's version, which has to be the pinned one.
function installedVersion() {
  const pinned = pinnedVersion();
  if (!existsSync(SOURCE)) {
    fail("The Font Awesome package isn't installed; run npm ci first.");
  }
  const installed = JSON.parse(readFileSync(path.join(PACKAGE, "package.json"), "utf8")).version;
  if (installed !== pinned) {
    fail(`package.json pins Font Awesome Free ${pinned} but ${installed} is installed; run npm ci first.`);
  }
  return installed;
}

const USAGE = "Usage: npm run icons -- add <style>/<name>... | sync | check, or apply <dir>";
const [command, ...args] = process.argv.slice(2);
if (!["add", "sync", "check", "apply"].includes(command)) {
  fail(USAGE);
}
const version = command === "apply" ? pinnedVersion() : installedVersion();

if (command === "add") {
  if (!args.length) {
    fail("Name at least one icon, such as: npm run icons -- add solid/wrench");
  }
  const icons = args.map(parse);
  const missing = icons.filter((icon) => !existsSync(source(icon)));
  if (missing.length) {
    fail(
      `Font Awesome Free ${version} has no ${missing.join(", ")}. ` +
        "Check the name and style at https://fontawesome.com/search?ic=free",
    );
  }
  const odd = icons.filter((icon) => !plain(source(icon)));
  if (odd.length) {
    fail(`Font Awesome Free ${version}'s ${odd.join(", ")} isn't a plain one-path SVG; not copying it.`);
  }
  for (const icon of icons) {
    mkdirSync(path.dirname(target(icon)), { recursive: true });
    copyFileSync(source(icon), target(icon));
    console.log(`Added ${icon} from Font Awesome Free ${version}`);
  }
} else if (command === "sync") {
  const icons = copied();
  const gone = icons.filter((icon) => !existsSync(source(icon)));
  if (gone.length) {
    fail(`Font Awesome Free ${version} no longer has ${gone.join(", ")}; replace them before syncing.`);
  }
  const odd = icons.filter((icon) => !plain(source(icon)));
  if (odd.length) {
    fail(`Font Awesome Free ${version}'s ${odd.join(", ")} isn't a plain one-path SVG; not syncing.`);
  }
  let changed = 0;
  for (const icon of icons) {
    if (!readFileSync(source(icon)).equals(readFileSync(target(icon)))) {
      copyFileSync(source(icon), target(icon));
      changed++;
    }
  }
  console.log(`Synced ${icons.length} icons with Font Awesome Free ${version}; ${changed} changed.`);
} else if (command === "check") {
  const icons = copied();
  const problems = strays().map((file) => `${file} isn't a <style>/<name>.svg icon file`);
  problems.push(
    ...icons.flatMap((icon) => {
      if (!plain(target(icon))) {
        return [`assets/icons/${icon}.svg isn't a plain one-path Font Awesome SVG`];
      }
      if (!existsSync(source(icon))) {
        return [`assets/icons/${icon}.svg isn't in Font Awesome Free ${version}`];
      }
      return readFileSync(source(icon)).equals(readFileSync(target(icon)))
        ? []
        : [`assets/icons/${icon}.svg differs from Font Awesome Free ${version}`];
    }),
  );
  if (problems.length) {
    fail(`${problems.join("\n")}\nRemove stray files, and run npm run icons -- sync to copy the icons again.`);
  }
  console.log(`All ${icons.length} icons match Font Awesome Free ${version}.`);
} else if (command === "apply") {
  // Accept only the icons assets/icons already has, as plain one-path SVGs
  // from the pinned version, and nothing else: no new names, no other files,
  // no links.
  const dir = args[0];
  if (args.length !== 1 || !existsSync(dir)) {
    fail("Usage: node scripts/fontawesome-icons.mjs apply <directory of synced icons>");
  }
  const problems = [];
  const found = [];
  for (const entry of readdirSync(dir)) {
    const sub = path.join(dir, entry);
    if (!STYLES.includes(entry) || !lstatSync(sub).isDirectory()) {
      problems.push(`${entry} isn't a style directory`);
      continue;
    }
    for (const file of readdirSync(sub)) {
      const icon = `${entry}/${file.slice(0, -4)}`;
      if (
        !file.endsWith(".svg") ||
        !lstatSync(path.join(sub, file)).isFile() ||
        !/^[a-z0-9-]+$/.test(file.slice(0, -4))
      ) {
        problems.push(`${entry}/${file} isn't an icon file`);
      } else if (!plain(path.join(sub, file))) {
        problems.push(`${icon} isn't a plain one-path Font Awesome SVG`);
      } else if (versionOf(path.join(sub, file)) !== version) {
        problems.push(`${icon} isn't from Font Awesome Free ${version}`);
      } else {
        found.push(icon);
      }
    }
  }
  const expected = copied();
  for (const icon of expected.filter((icon) => !found.includes(icon))) {
    problems.push(`${icon} is missing`);
  }
  for (const icon of found.filter((icon) => !expected.includes(icon))) {
    problems.push(`${icon} isn't one of the site's icons`);
  }
  if (problems.length) {
    fail(`Not applying the synced icons:\n${problems.join("\n")}`);
  }
  for (const icon of expected) {
    copyFileSync(path.join(dir, `${icon}.svg`), target(icon));
  }
  console.log(`Applied ${expected.length} icons from Font Awesome Free ${version}.`);
}
