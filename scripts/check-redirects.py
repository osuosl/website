#!/usr/bin/env python3
"""Follow every alias URL on a live host and fail on redirect loops.

Unlike the build-time alias check, this exercises the real web server, so
it catches collisions between Hugo aliases and server-side redirect rules
(for example a legacy Apache rule bouncing a page back at an alias stub).
It follows both HTTP 3xx redirects and <meta http-equiv=refresh> targets.

Usage:
  python3 scripts/check-redirects.py https://osuosl.org [public]

Run it against production or a staging deploy after the site is published.
The alias list is derived from the local build in `public/` (build first).
"""
import re
import sys
import urllib.request
from pathlib import Path

REFRESH = re.compile(r'http-equiv="?refresh"?[^>]*url=([^">]+)', re.I)
MAX_HOPS = 5


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


def follow(base: str, path: str):
    """Return (ok, chain) following HTTP and meta-refresh redirects."""
    url = base + path
    chain = [url]
    seen = {url}
    for _ in range(MAX_HOPS):
        request = urllib.request.Request(url, headers={"User-Agent": "osl-redirect-check"})
        try:
            with urllib.request.urlopen(request, timeout=15) as response:
                body = response.read(4096).decode(errors="replace")
                final_url = response.geturl()
        except Exception as exc:  # noqa: BLE001 - report any failure
            return False, chain + [f"ERROR: {exc}"]
        if final_url not in seen:
            chain.append(final_url)
            if final_url in seen:
                return False, chain + ["LOOP"]
            seen.add(final_url)
        match = REFRESH.search(body)
        if not match:
            return True, chain
        target = match.group(1)
        if target.startswith("/"):
            target = base + target
        if target in seen:
            return False, chain + [target, "LOOP"]
        seen.add(target)
        chain.append(target)
        url = target
    return False, chain + ["TOO MANY HOPS"]


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    base = sys.argv[1].rstrip("/")
    root = Path(sys.argv[2] if len(sys.argv) > 2 else "public")
    failures = 0
    paths = sorted(set(alias_paths(root)))
    for path in paths:
        ok, chain = follow(base, path)
        if not ok:
            failures += 1
            print(f"FAIL {path}")
            for hop in chain:
                print(f"   -> {hop}")
    print(f"checked {len(paths)} alias URLs on {base}: {failures} failure(s)")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
