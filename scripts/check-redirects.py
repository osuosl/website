#!/usr/bin/env python3
"""Follow every alias URL on a live host and fail on redirect loops.

Unlike the build-time alias check (scripts/check-aliases.py), this
exercises the real web server, so it catches collisions between Hugo
aliases and server-side redirect rules (for example a legacy Apache rule
bouncing a page back at an alias stub). It follows both HTTP 3xx
redirects and <meta http-equiv=refresh> targets.

Alias stubs embed absolute production URLs, so when testing another host
(a staging deploy), targets on the canonical host are rewritten onto the
host under test; use --canonical if the production URL ever changes.

Examples:
  python3 scripts/check-redirects.py https://osuosl.org
  python3 scripts/check-redirects.py https://osuosl-website-92.staging.osuosl.org

The alias list is derived from a local build (run `hugo` first).
"""
import argparse
import re
import sys
import urllib.request
from pathlib import Path

REFRESH = re.compile(r'http-equiv="?refresh"?[^>]*url=([^">]+)', re.I)


def alias_paths(root: Path):
    for path in root.rglob("index.html"):
        try:
            if path.stat().st_size > 2048:
                continue
            text = path.read_text(errors="replace")
        except OSError:
            continue
        if REFRESH.search(text):
            rel = path.parent.relative_to(root)
            yield "/" if str(rel) == "." else f"/{rel}/"


def rebase(url: str, base: str, canonical: str) -> str:
    """Keep the check on the host under test."""
    if canonical and url.startswith(canonical):
        return base + url[len(canonical):]
    return url


def follow(base: str, path: str, canonical: str, max_hops: int):
    """Return (ok, chain) following HTTP and meta-refresh redirects."""
    url = base + path
    chain = [url]
    seen = {url}
    for _ in range(max_hops):
        request = urllib.request.Request(url, headers={"User-Agent": "osl-redirect-check"})
        try:
            with urllib.request.urlopen(request, timeout=15) as response:
                body = response.read(4096).decode(errors="replace")
                final_url = rebase(response.geturl(), base, canonical)
        except Exception as exc:  # noqa: BLE001 - report any failure
            return False, chain + [f"ERROR: {exc}"]
        if final_url != url:
            if final_url in seen:
                return False, chain + [final_url, "LOOP"]
            seen.add(final_url)
            chain.append(final_url)
            url = final_url
        match = REFRESH.search(body)
        if not match:
            return True, chain
        target = match.group(1)
        if target.startswith("/"):
            target = base + target
        target = rebase(target, base, canonical)
        if target in seen:
            return False, chain + [target, "LOOP"]
        seen.add(target)
        chain.append(target)
        url = target
    return False, chain + ["TOO MANY HOPS"]


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("base_url", help="host to test, e.g. https://osuosl.org or a staging URL")
    parser.add_argument("--public", default="public", help="local build directory (default: public)")
    parser.add_argument(
        "--canonical",
        default="https://osuosl.org",
        help="production base URL embedded in alias stubs; rewritten onto base_url (default: %(default)s)",
    )
    parser.add_argument("--max-hops", type=int, default=5, help="redirect hop limit (default: %(default)s)")
    args = parser.parse_args()

    base = args.base_url.rstrip("/")
    canonical = args.canonical.rstrip("/")
    root = Path(args.public)
    if not root.is_dir():
        print(f"error: build directory {root} not found (run hugo first)", file=sys.stderr)
        return 2

    failures = 0
    paths = sorted(set(alias_paths(root)))
    for path in paths:
        ok, chain = follow(base, path, canonical, args.max_hops)
        if not ok:
            failures += 1
            print(f"FAIL {path}")
            for hop in chain:
                print(f"   -> {hop}")
    print(f"checked {len(paths)} alias URLs on {base}: {failures} failure(s)")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
