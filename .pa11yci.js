// pa11y-ci configuration: WCAG 2.1 AA scan over a representative page set,
// run in CI against the built site (see .github/workflows/hugo_build.yml).
//
// Two runners:
//  - axe: computes real rendered colors, including CSS custom properties.
//    Its color-contrast rule is the enforcing contrast check and has caught
//    real bugs (e.g. the light-mode active-nav contrast fix in this repo).
//  - htmlcs (HTML CodeSniffer): good structural checks, but it cannot
//    resolve CSS custom-property colors, so its two contrast rules
//    misreport on every Bootstrap 5 component site-wide (readings like
//    "1.36:1" against an unresolved var() background). Those two rules are
//    ignored globally below; every other htmlcs rule still applies.
//
// Note: scanners only see the page's initial state. Interactive states
// (open search dialog with results, dropdown panels, dark mode) are part
// of the manual QA checklist instead.
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
      ".g-recaptcha",
      "iframe[src*='recaptcha']",
      "#g-recaptcha-response",
      // Hero text over a photo: axe cannot compute contrast when an image
      // is behind text, so it reports "must verify" as an error. The hero
      // has a 66% dark scrim; even over pure-white image pixels the
      // computed contrast for the white text is >= 7.2:1 (see the scrim
      // comment in assets/scss/_madrone.scss).
      ".hero .container-xxl",
    ].join(", "),
    ignore: [
      // htmlcs contrast rules only — see the runner note above. axe's
      // color-contrast rule remains active on every element of every
      // scanned page.
      "WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail",
      "WCAG2AA.Principle1.Guideline1_4.1_4_3.G145.Fail",
    ],
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
