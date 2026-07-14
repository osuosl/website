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
    hideElements: [
      // Google reCAPTCHA widget internals: a third-party, cross-origin
      // iframe we cannot modify (it also ships a hidden unlabeled
      // textarea). Google provides the accessible audio challenge inside
      // the widget itself.
      // NOTE: these exceptions are specific to the v2 checkbox widget.
      // If the forms move to reCAPTCHA v3 (invisible), remove these,
      // re-run the scan, and re-add only what still fires — likely just
      // the floating badge iframe, or nothing if the badge is replaced
      // with Google's inline attribution text.
      ".g-recaptcha",
      "iframe[src*='recaptcha']",
      "#g-recaptcha-response",
      // Hero text over a photo: axe cannot compute contrast when an image
      // is behind text, so it reports "must verify" as an error. The hero
      // has a 66% dark scrim; even over pure-white image pixels the
      // computed contrast for the white text is >= 7.2:1 (see the scrim
      // comment in assets/scss/_madrone.scss).
      ".hero .container-site",
      // Bootstrap selects: the dropdown chevron is a background-image
      // (data: SVG pinned to the right edge), and any background image
      // makes axe report contrast as unverifiable (messageKey bgImage,
      // computed ratio 0) even though the text sits on the solid
      // $input-bg with 2.25rem of padding reserved for the chevron.
      // Text and background are the same tokens (--bs-body-color on
      // --bs-body-bg) that both runners fully verify on .form-control
      // inputs on the same pages, so a token regression still fails the
      // scan. Re-check this exception if .form-select ever gets its own
      // colors.
      ".form-select",
    ].join(", "),
  },
  urls: [
    "http://localhost:8080/",
    "http://localhost:8080/about/",
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
