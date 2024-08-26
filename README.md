OSUOSL Hugo Static Site
=======================

Migrated from our static [Pelican site](https://github.com/osuosl/osuosl-pelican)

Based off of the Mainroad theme on https://github.com/Vimux/Mainroad and the previous [OSL theme](https://github.com/osuosl/dougfir-pelican-theme)

Changes From Pelican
--------------------

Hugo uses markdown to write its pages, thus the front matter of a page will look slightly different.

The author of a page should be included as an array of ``authors`` within the front matter:

```
---
authors: [OSUOSL Admin]
---
```

For now, images in front matter are not supported. To include a header image, at the top of a blog post,
there is a CSS tag, ``#blog`` that mimics the header image:

```
![Image Alt](/images/image_path#blog)
```

To include a blog post on the front page's carousel, add it to the [carousel.yaml](/data/carousel.yaml) file.

Development
-----------

To compile and host the site under development on port 1313, use:

```
$ hugo server
```