# OSUOSL Hugo Static Site

Migrated from our static [Pelican site](https://github.com/osuosl/osuosl-pelican)

Based off of the [Mainroad theme](https://github.com/Vimux/Mainroad) and the previous
[OSL theme](https://github.com/osuosl/dougfir-pelican-theme)

## Development

### Prerequisites

Read the [Hugo getting started guide's prerequisite list](https://gohugo.io/getting-started/quick-start/#prerequisites)
and install the Hugo binary or package. You can check if it is installed from the command line by running:

```bash
hugo version
```

This project uses npm for Prettier, Markdownlint and managing the Font Awesome icons. You can check that npm is
installed from the command line by running:

```bash
npm -v
```

The search feature is implemented using [Pagefind](https://pagefind.app/) and can be run with the npm script `serve` or
by [downloading the binary](https://pagefind.app/docs/installation/#downloading-a-precompiled-binary).

### Setup

If you do not have permissions to work directly on a branch of the repository, you will have to
[fork the repo](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo)
and work from your fork. If you do have permission,
[create a branch](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-and-deleting-branches-within-your-repository)
and work from your branch.

Once the prerequisites are installed and you are working off the fork or branch,
[clone the repository](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository)
to your local machine.

This can be done from the command line:

```bash
# Fork
git clone git@github.com:YOURUSERNAMEHERE/website.git ./osl-website

# Branch
git clone git@github.com:osuosl/website.git ./osl-website
```

Then, navigate to the folder and then install the dependencies:

```bash
cd ./osl-website
npm install
```

### Local Development

To compile and host the site under development on port `1313`, run:

```bash
hugo server
```

Once Hugo is done setting up, you should see a success message:

```shell
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
Press Ctrl+C to stop
```

#### Formatting and Linting

This project uses [prettier](https://prettier.io) and [markdownlint](https://github.com/DavidAnson/markdownlint). You
can install them in your preferred editor to see changes as you edit or run them from the command line.

To format and lint from the command line, run:

```bash
# Format via prettier
npm run format

# Lint via markdownlint
npm run lint
```

### Preview Production

If you want to preview the production server to see the full search functionality, you can build the pages and then
serve from Pagefind. Pagefind sources from the `public/` directory Hugo compiles when the website is built.

First compile the pages:

```bash
hugo
```

Then run it using Pagefind through the provided helper npm script or the binary using the specific flags:

```bash
# NPM helper script
npm run serve

# Binary
./pagefind --site public --serve
```

## Testing

CI (`.github/workflows/hugo_build.yml`) runs on every pull request: a Hugo build, a Pagefind index, internal link/asset
validation ([htmltest](https://github.com/wjdp/htmltest) with `.htmltest.yml`), an alias-redirect check
(`scripts/check-aliases.py` — every redirect stub must land on a real page, so the site can never ship a redirect chain
or loop), and the accessibility scan described below. `scripts/check-redirects.py` is a manual companion that follows
redirects on a **live** host (production or a staging deploy), catching collisions between the site's redirects and
server-side Apache rules.

### Accessibility testing

The site must conform to [WCAG 2.1 Level AA](https://www.w3.org/TR/WCAG21/): the Department of Justice's rule on digital
accessibility under ADA Title II requires it of Oregon State University, with a compliance date of April 26, 2027 — see
[OSU's New ADA Rule on Digital Accessibility](https://accessibility.oregonstate.edu/digital-accessibility/ada) page. CI
runs [pa11y-ci](https://github.com/pa11y/pa11y-ci) (config: `.pa11yci.js`) as a blocking check. The URL list is
generated from the built site, so new pages are scanned automatically. By default every unique page is scanned;
individual blog posts and tag pages — hundreds of instances of one template — are sampled by one representative each,
and alias redirect stubs are skipped. Scans use **two runners, both fully enabled**:

- [axe-core](https://github.com/dequelabs/axe-core) — actively maintained by Deque, analyzes fully rendered pages
  (including CSS custom properties), and is tuned for few false positives.
- [HTML CodeSniffer](https://github.com/squizlabs/HTML_CodeSniffer) — maps checks directly onto WCAG techniques and is
  stricter and more verbose; older and less actively maintained than axe.

We run both because they analyze differently and each has caught real bugs the other missed in this repo: axe flagged
the light-mode active-nav contrast; HTML CodeSniffer flagged the required-asterisk contrast that axe's text heuristics
skip. When the runners disagree, fix the issue or document a narrowly-scoped exception with a comment in `.pa11yci.js` —
the config intentionally contains no ignored rules.

Two kinds of result get different treatment, and the distinction matters:

- **Proven violations fail the build.** No exceptions.
- **"Needs review" results are capped at warning** (`levelCapWhenNeedsReview`). These are cases axe could not measure
  rather than failures it found — mainly contrast where an image sits behind or on the element (the hero photo, the
  chevron Bootstrap draws on every `<select>`). They stay visible in the CI output, and the manual contrast sweep in the
  QA checklist below is what actually clears them.

Prefer that cap over `hideElements`, which drops the element from the DOM both runners see and therefore deletes _all_
coverage of it — an unlabeled `<select>` would sail through. `hideElements` is reserved for markup we cannot fix at all
(the third-party reCAPTCHA widget).

To run the scan locally:

```bash
hugo && npx pagefind --site public
python3 -m http.server 8080 --directory public &
npx pa11y-ci --config .pa11yci.js
```

To sweep **every** rendered page — all blog posts and tag pages included — set `PA11Y_FULL=1` (takes a few minutes; same
settings otherwise):

```bash
PA11Y_FULL=1 npx pa11y-ci --config .pa11yci.js
```

Run the full sweep before a launch, after editing old blog posts (their raw HTML predates the markdownlint alt-text
rule), or after changing the blog template or syntax highlighting.

#### Manual QA checklist

Automated scanners only see each page's initial, static state. Before launches or significant UI changes, also verify by
hand:

- **Keyboard**: Tab through every template — skip link appears first and works, nav dropdowns open with Enter/Space and
  close with Escape, the search dialog traps and restores focus, no keyboard traps.
- **Screen reader**: smoke test (NVDA + Firefox or VoiceOver + Safari) on the homepage, a form (including the error
  path), search, and a blog post.
- **Both color modes**: toggle dark mode and check contrast of interactive states (hover, focus, active), search
  results, and form messages — scanners only test the mode the browser prefers.
- **Interactive states**: open search with results on screen, open each nav dropdown, submit a form with an error.
- **Zoom/reflow**: 400% zoom (320px-wide reflow) with no horizontal scrolling or lost content; 200% text-only zoom.

### Testing the request forms

To see the RT ticket a request form would create, without sending one, run a local formsender in `DRY_RUN` mode with
Docker Compose and point a local Hugo server at it. This is optional; `hugo server` on its own is unaffected.

```bash
# Terminal 1: formsender, logging tickets instead of sending them
scripts/formsender-test.sh

# Terminal 2: the site, with the forms pointed at that formsender
hugo server --environment formtest
```

Submit a form at <http://localhost:1313/>, and the ticket (queue, subject, custom fields and body) appears in the
formsender output. Stop it with `Ctrl+C`, or `docker compose down` if you started it with `-d`.

- `scripts/formsender-test.sh` builds formsender from a local checkout when `FORMSENDER_SRC` (default `../formsender`)
  holds one, so unreleased formsender changes can be tested. Otherwise it uses the published
  `ghcr.io/osuosl/formsender:master` image, which needs a formsender release with `DRY_RUN` support.
- `compose.yaml` never gives formsender an `RT_TOKEN`, so a formsender without `DRY_RUN` support fails to start rather
  than creating real tickets.
- The `formtest` environment (`config/formtest/params.toml`) uses Cloudflare's always-pass
  [Turnstile test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/). Headless browsers may not
  get a token from the widget.
- Formsender accepts the same answers again (`DUPLICATE_CHECK_TIME=0`), which needs a formsender release that supports
  the setting.
- To use another port, set `FORMSENDER_PORT` and change `action` in `config/formtest/params.toml` to match.

To submit every form automatically, start formsender with `scripts/formsender-test.sh -d`, start the formtest server,
and run:

```bash
npm run test:forms
```

The script opens each form in Chrome through [Playwright](https://playwright.dev/), fills every visible field and
submits it. The answers, in `scripts/form-test-answers.mjs`, describe a made-up project so the tickets read like a real
request; the script lists any field that has no answer there, which gets a generic one. On the hosting form it makes one
submission per service, one per choice that reveals more questions, and one with everything chosen; each of the other
forms gets one submission. A scenario that ends up with the same answers as an earlier one is skipped. Each ticket is
saved to `tmp/form-tickets/<form>/<scenario>.txt`, and the script exits non-zero if any submission fails to produce one.

- `--only <regex>` runs only the scenarios whose name (such as `hosting/service-mirror`) matches.
- `--base <url>` points it at a server other than <http://localhost:1313>, and `--out <dir>` saves tickets elsewhere.
- It uses the installed Google Chrome. Set `FORM_TEST_BROWSER=` to use Playwright's own Chromium instead, after
  `npx playwright install chromium`.
- It refuses to submit a form whose action isn't on localhost, so it can't create real tickets.

### Previewing the status strip

Every page shows open incidents and maintenance from [status.osuosl.org](https://status.osuosl.org/) in a strip under
the navigation, and the strip is hidden when nothing is open. To see it with sample data, add `?status-demo` to any page
URL on `hugo server` or a PR preview, for example <http://localhost:1313/?status-demo>.

| URL parameter              | Shows                                                                       |
| -------------------------- | --------------------------------------------------------------------------- |
| `?status-demo`             | An outage, an incident and maintenance in progress, one of each color       |
| `?status-demo=incident`    | A partial service disruption                                                |
| `?status-demo=outage`      | A service disruption                                                        |
| `?status-demo=maintenance` | Maintenance in progress                                                     |
| `?status-demo=upcoming`    | Maintenance in three days (one 20 days out stays hidden)                    |
| `?status-demo=busy`        | Six notices, of which the strip shows two and a row counting the other four |
| `?status-demo=baddates`    | Incidents and maintenance with missing or inconsistent dates                |
| `?status-demo=badwindows`  | Scheduled maintenance with missing, ended or backwards times                |
| `?status-demo=clear`       | Nothing open, so the strip stays hidden                                     |
| `?status-demo=off`         | The live status page again                                                  |

The strip shows at most three rows. With more notices than that, it shows the two most important, in the order incidents
(worst first), maintenance in progress, then scheduled maintenance, and the third row counts the rest and links to the
status page.

The sample stays on every page you visit in that tab for a day, or until you use `?status-demo=off` or close the tab.
Its times are relative to when you load it. The sample data is in `assets/js/status-demo.js`, which only non-production
builds include, so the parameter does nothing on osuosl.org.

## Adding Content

Content is added inside the `/content` folder, though it varies based on what you would like to do.

### Request forms

The five hosting/CI request forms are data-driven: each page holds only its intro text plus a
`{{</* request-form <name> */>}}` shortcode, and the fields live in `data/forms/<name>.yml`. To add or change a field,
edit the YAML — the shortcode and the `form-field` partial render Bootstrap-styled, accessible markup (labels, help
text, required indicators, checkbox-group validation) automatically. The `form-field` partial's header lists every key,
including `toggle` fields that reveal follow-up questions and `group` fields that require at least one checked box. Each
form also sends its field labels, in form order, so formsender heads the ticket's answers with them. Three rules:

- A field's `name` key is the formsender POST parameter. Never rename one without coordinating with the formsender
  ticket templates.
- Shared formsender settings (action URL, token, Turnstile site key) live under `[params.formsender]` in
  `config/_default/params.toml`. PR previews build with `--environment staging`, whose `config/staging/params.toml`
  turns submissions off, since previews would otherwise send real tickets.
- Check a form change with [Testing the request forms](#testing-the-request-forms) before shipping it.

### Adding a New Blog Post

Regular pages use the default `/archetypes/default.md` archetype.

Blog posts are stored in `/content/blog` and use the associated `/archetypes/blog.md` archetype.

To add a blog post, use the `hugo new` command:

```bash
hugo new blog/your-slug-title-here.md
```

The author of a page should be included as an array of `authors` within the front matter:

```md
---
# ...
authors: [OSUOSL Admin]
# ...
---
```

To add a header image at the top of a blog post, use the CSS tag `#blog`:

```md
![Image Alt](/images/image_path#blog)
```

### Adding a New Tag

Tags (called Terms in Hugo) are added simply by adding an associated string in the frontmatter of a blog post. This
alone will create a semi-broken tag due to how tags are rendered, so you will have to add an associated page in the
content folder to add metadata.

After you add a tag to a blog post, create a new file in the directory `/content/tags/[tag name here]/_index.md`, making
the folder if it does not already exist.

Inside this file, include the frontmatter template below as well as any content you want displayed along with the tag:

```markdown
---
title: "Example Tag Here"
slug: example-tag-here
---

Content here will be placed on the tag page. You may also include images here.
```

If you do not do this, the tag will be displayed as not having a name.

### Icons

The site's icons are [Font Awesome Free](https://fontawesome.com/search?ic=free) SVGs, copied unchanged from the
`@fortawesome/fontawesome-free` npm package into `assets/icons/<style>/<name>.svg`. The package version is pinned in
`package.json`. The site builds from the copies, so the deploy needs no npm, and the site footer credits Font Awesome.

To use an icon, find it on fontawesome.com and note its name and style (solid, regular or brands). Copy it in, then
render it with the `icon.html` partial, adding the style before the name unless it is solid:

```bash
npm run icons -- add regular/envelope
```

```go-html-template
{{ partial "icon.html" (dict "name" "regular/envelope") }}
{{ partial "icon.html" (dict "name" "magnifying-glass" "label" "Search") }}
```

Pass `label` only when the icon stands alone without visible text. In page content, use the `icon` shortcode instead,
such as `{{< icon "hand-holding-dollar" >}}`. A name that isn't in `assets/icons/` fails the Hugo build and says which
`add` command to run.

The copies have to match the pinned package:

- `npm run icons -- check` fails if any file differs from the package or isn't a plain one-path Font Awesome SVG. The
  GitHub Actions build runs it.
- The Hugo build fails if an icon a page uses is from another version than the one `package.json` pins, or isn't a plain
  one-path SVG, so an upgrade that skipped `sync` can't be deployed.

To upgrade Font Awesome, install the new version, copy the icons again and look over the pages that use them:

```bash
npm install --save-dev --save-exact @fortawesome/fontawesome-free@<version>
npm run icons -- sync
```

## License

[Apache 2.0](https://choosealicense.com/licenses/apache-2.0/)
