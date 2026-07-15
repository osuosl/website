// pa11y-ci configuration: WCAG 2.1 AA scan over a representative page set,
// run in CI against the built site (see .github/workflows/hugo_build.yml).
//
// Two runners, both fully enabled (no ignored rules): axe and htmlcs
// analyze differently and each has caught real bugs the other missed —
// axe flagged the light-mode active-nav contrast, htmlcs flagged the
// required-asterisk contrast that axe's text heuristics skip. See the
// "Accessibility testing" section of the README for the rationale and
// the manual QA checklist that covers what scanners cannot see (dialog
// contents, dropdown panels, both color modes, zoom/reflow).
module.exports = {
  defaults: {
    standard: "WCAG2AA",
    runners: ["axe", "htmlcs"],
    timeout: 30000,
    chromeLaunchConfig: {
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    },
    // axe reports two kinds of result: "violations" (it proved a failure)
    // and "incomplete" (it could not decide and a human must look). pa11y
    // folds both into errors by default, which would fail the build on
    // things axe merely could not measure — notably contrast anywhere an
    // image sits behind or on the element: the hero's photo, and the
    // chevron background-image Bootstrap draws on every .form-select.
    //
    // Capping needs-review at "warning" keeps every rule enabled on every
    // element and still fails the build on proven violations, while the
    // undecidable ones stay visible in the CI output instead of blocking
    // it. This replaces hiding those elements: hideElements drops the
    // element from the DOM both runners see, so it silently deletes ALL
    // coverage of it (an unlabeled select would have gone undetected).
    // What axe cannot measure is covered instead by the manual contrast
    // sweep in the README's QA checklist, and for the selects by a
    // computed-contrast assertion in both color modes.
    levelCapWhenNeedsReview: "warning",
    hideElements: [
      // Google reCAPTCHA widget internals: a third-party, cross-origin
      // iframe we cannot modify (it also ships a hidden unlabeled
      // textarea). Google provides the accessible audio challenge inside
      // the widget itself. Unlike the cases above, this is not a
      // "cannot measure" — it is a "cannot fix", so it stays hidden.
      // NOTE: these exceptions are specific to the v2 checkbox widget.
      // If the forms move to reCAPTCHA v3 (invisible), remove these,
      // re-run the scan, and re-add only what still fires — likely just
      // the floating badge iframe, or nothing if the badge is replaced
      // with Google's inline attribution text.
      ".g-recaptcha",
      "iframe[src*='recaptcha']",
      "#g-recaptcha-response",
    ].join(", "),
  },
  // The URL list is generated from the built site so new pages are
  // scanned automatically instead of relying on someone extending a
  // hand-written list. Alias redirect stubs (Hugo's internal
  // meta-refresh template, no real content) are always skipped.
  //
  // By default, individual blog posts and tag pages are sampled by one
  // representative each: they are hundreds of instances of one template,
  // and scanning them all costs ~4 minutes on every CI run. Set
  // PA11Y_FULL=1 to sweep every rendered page instead — worth doing
  // before a launch, after editing old posts (their raw HTML predates
  // the markdownlint alt-text rule), or after touching the blog
  // template or syntax highlighting. The full sweep passed 172/172 on
  // 2026-07-15.
  urls: (() => {
    const fs = require("fs");
    const path = require("path");
    const site = path.join(__dirname, "public");
    const base = "http://localhost:8080";
    const full = !!process.env.PA11Y_FULL;

    if (!fs.existsSync(site)) {
      throw new Error(".pa11yci.js: build the site first (hugo && npx pagefind --site public)");
    }

    const urls = [];
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          walk(path.join(dir, entry.name));
        } else if (entry.name === "index.html") {
          const page = fs.readFileSync(path.join(dir, entry.name), "utf8");
          // Alias stub: CI builds with --minify, which strips the
          // attribute quotes, so match both forms.
          if (/http-equiv=["']?refresh/i.test(page)) {
            continue;
          }
          const url = path.relative(site, dir).replaceAll(path.sep, "/");
          if (!full && /^(blog|tags)\/.+/.test(url)) {
            continue;
          }
          urls.push(`${base}/${url && url + "/"}`);
        }
      }
    };
    walk(site);

    if (!full) {
      urls.push(`${base}/blog/drupal_infrastructure/`, `${base}/tags/student-stories/`);
    }
    return urls.concat([`${base}/404.html`]).sort();
  })(),
};
