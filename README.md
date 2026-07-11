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

This project uses npm for the functionality of Prettier and Markdownlint. You can check that npm is installed from the
command line by running:

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

The site must conform to [WCAG 2.1 AA](https://www.w3.org/TR/WCAG21/) (the ADA Title II web rule, which OSU requires of
its units). CI runs [pa11y-ci](https://github.com/pa11y/pa11y-ci) (config: `.pa11yci.js`) as a blocking check over a
representative page set, with **two runners, both fully enabled**:

- [axe-core](https://github.com/dequelabs/axe-core) — actively maintained by Deque, analyzes fully rendered pages
  (including CSS custom properties), and is tuned for few false positives.
- [HTML CodeSniffer](https://github.com/squizlabs/HTML_CodeSniffer) — maps checks directly onto WCAG techniques and is
  stricter and more verbose; older and less actively maintained than axe.

We run both because they analyze differently and each has caught real bugs the other missed in this repo: axe flagged
the light-mode active-nav contrast; HTML CodeSniffer flagged the required-asterisk contrast that axe's text heuristics
skip. When the runners disagree, fix the issue or document a narrowly-scoped exception with a comment in `.pa11yci.js` —
the config intentionally contains no ignored rules.

To run the scan locally:

```bash
hugo && npx pagefind --site public
python3 -m http.server 8080 --directory public &
npx pa11y-ci --config .pa11yci.js
```

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

## Adding Content

Content is added inside the `/content` folder, though it varies based on what you would like to do.

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

## License

[Apache 2.0](https://choosealicense.com/licenses/apache-2.0/)
