# OSUOSL Hugo Static Site

Migrated from our static [Pelican site](https://github.com/osuosl/osuosl-pelican)

Based off of the Mainroad theme on https://github.com/Vimux/Mainroad and the previous
[OSL theme](https://github.com/osuosl/dougfir-pelican-theme)

## Changes From Pelican

Hugo uses markdown to write its pages, thus the front matter of a page will look slightly different.

The author of a page should be included as an array of `authors` within the front matter:

```md
---
authors: [OSUOSL Admin]
---
```

To add a header image at the top of a blog pst, use the CSS tag `#blog`:

```md
![Image Alt](/images/image_path#blog)
```

## Dependencies

The search feature is implemented using [Pagefind](https://pagefind.app/) and can be installed with `npx` or by
[downloading the binary](https://pagefind.app/docs/installation/#downloading-a-precompiled-binary).

## Development

To compile and host the site under development on port 1313, use:

```bash
hugo server
```

Pagefind sources from the `public/` directory hugo compiles when the website is built. To view the website with full
functionality:

First compile it:

```bash
hugo
```

Then run it using pagefind:

```bash
./pagefind --site public --serve
```
