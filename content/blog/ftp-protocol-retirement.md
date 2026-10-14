---
title: "Turning Off FTP Protocol Access to Our Mirrors"
date: 2026-10-14
authors: ["Lance Albertson"]
---

On **Tuesday, December 15, 2026 at 9:00 AM PST (17:00 UTC)**, we will turn off the FTP protocol (`ftp://`) on
`ftp.osuosl.org` and the rest of our mirror hostnames. Only FTP is affected: our mirrors, the `ftp.osuosl.org` name and
every file stay, available over HTTP and HTTPS at the same paths, and most of it over rsync too.

## What you need to do

If you download from our mirrors with an `ftp://` URL, switch it to HTTPS. The paths are the same, so
`ftp://ftp.osuosl.org/pub/<project>/` becomes `https://ftp.osuosl.org/pub/<project>/`. That includes scripts,
configuration files, documentation and download pages that link to us. If you reach us through a project name on another
domain, such as `ftp.<project>.org`, use `https://ftp.osuosl.org/` for HTTPS for now: those names don't have their own
certificates yet, and we're working on adding them.

If you run a mirror that syncs from us over FTP, switch to rsync at `rsync://rsync.osuosl.org/<module>/`.
`rsync.osuosl.org` serves all of our rsync modules, so it is the best name to sync from. Not every project we mirror has
an rsync module, though. If the one you need is missing, email [support@osuosl.org](mailto:support@osuosl.org) to
request it.

This also covers `ftp-osl.osuosl.org`, `ftp-chi.osuosl.org`, `ftp-nyc.osuosl.org`, and any other name that points at our
mirrors, whether through a CNAME to `ftp.osuosl.org` or our IP addresses. That includes project names such as
`ftp.<project>.org` and `<project>.osuosl.org`. Those names keep working over HTTP and rsync, and `<project>.osuosl.org`
names over HTTPS as well; only FTP stops.

## Why we're doing this

FTP is one of the oldest protocols on the internet, and most major projects have moved away from it. Anonymous FTP has
no practical way to encrypt a download or confirm that a file wasn't altered on its way to you; HTTPS does both, which
is why we point you there. FTP also opens a separate data connection on a negotiated port for every transfer, which
needs special handling in firewalls, NAT and load balancers, and it can't be cached or accelerated the way HTTP can.
Keeping it running means extra software, firewall rules and a kernel module on every mirror for a protocol that already
has better replacements.

We're not the first to make this change. kernel.org
[shut down its public FTP access](https://www.kernel.org/shutting-down-ftp-services.html) in March 2017, and Debian
[did the same](https://lists.debian.org/debian-announce/2017/msg00001.html) that November for many of the same reasons.
Browsers followed in 2021, when [Chrome 88](https://developer.chrome.com/blog/chrome-88-deps-rems) and
[Firefox 90](https://blog.mozilla.org/security/2021/07/20/stopping-ftp-support-in-firefox-90/) removed FTP support
entirely.

Subscribe at [status.osuosl.org](https://status.osuosl.org/) for reminders as the date gets closer. If you have
questions, or think this will cause problems for your project, please email
[support@osuosl.org](mailto:support@osuosl.org).
