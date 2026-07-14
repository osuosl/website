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
  urls: [
    "http://localhost:8080/",
    "http://localhost:8080/about/",
    "http://localhost:8080/about/people/",
    "http://localhost:8080/about/sponsors/",
    "http://localhost:8080/blog/",
    "http://localhost:8080/blog/drupal_infrastructure/",
    "http://localhost:8080/projects/",
    "http://localhost:8080/donate/",
    "http://localhost:8080/form-submitted/",
    "http://localhost:8080/services/hosting/request/",
    "http://localhost:8080/services/aarch64/request-hosting/",
    "http://localhost:8080/services/powerdev/request-hosting/",
    "http://localhost:8080/services/powerdev/request-ci/",
    "http://localhost:8080/services/ibm-z/request-ci/",
    "http://localhost:8080/404.html",
  ],
};
