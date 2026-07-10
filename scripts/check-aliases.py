#!/usr/bin/env python3
"""Verify alias redirect stubs in the built site.

Every Hugo alias page must point at a real page in the same build — never
at another alias (chains) and never at a missing page. This guarantees the
site itself can't ship a redirect chain or loop.

Usage: python3 scripts/check-aliases.py [public]
"""
import re
import sys
from pathlib import Path

REFRESH = re.compile(r'http-equiv="?refresh"?[^>]*url=([^">]+)', re.I)


def is_alias_stub(path: Path) -> str | None:
    """Return the refresh target if this file is an alias stub."""
    try:
        if path.stat().st_size > 2048:
            return None
        text = path.read_text(errors="replace")
    except OSError:
        return None
    match = REFRESH.search(text)
    return match.group(1) if match else None


def main() -> int:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "public")
    stubs = {}
    for path in root.rglob("index.html"):
        target = is_alias_stub(path)
        if target:
            stubs[path] = target

    errors = []
    for path, target in sorted(stubs.items()):
        # strip scheme/host: alias targets are absolute production URLs
        target_path = re.sub(r"^https?://[^/]+", "", target).split("#")[0]
        if not target_path.startswith("/"):
            errors.append(f"{path}: unexpected target {target!r}")
            continue
        dest = root / target_path.strip("/") / "index.html"
        if target_path == "/":
            dest = root / "index.html"
        if not dest.is_file():
            errors.append(f"{path}: target {target_path} does not exist")
        elif is_alias_stub(dest):
            errors.append(f"{path}: target {target_path} is itself an alias (chain/loop)")

    print(f"checked {len(stubs)} alias stubs")
    if errors:
        print("ALIAS ERRORS:")
        for error in errors:
            print(" ", error)
        return 1
    print("all alias targets are real pages")
    return 0


if __name__ == "__main__":
    sys.exit(main())
