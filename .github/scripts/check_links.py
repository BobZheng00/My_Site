"""Fail if any internal link, anchor or asset referenced by the site's HTML is missing.

usage: python check_links.py <site_dir>

External URLs (http, mailto, data, ...) are skipped; this only checks what ships with the site.
"""
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

URL_ATTRS = {"href", "src"}
EXTERNAL_SCHEMES = {"http", "https", "mailto", "tel", "data", "javascript"}


class Collector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.refs = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name == "id" and value:
                self.ids.add(value)
            elif name in URL_ATTRS and value:
                self.refs.append((self.getpos()[0], value))

    handle_startendtag = handle_starttag


def parse(path):
    collector = Collector()
    collector.feed(path.read_text(encoding="utf-8"))
    return collector


def main(site_dir):
    root = Path(site_dir).resolve()
    pages = sorted(root.rglob("*.html"))
    parsed = {page: parse(page) for page in pages}
    problems = []

    for page, info in parsed.items():
        for line, ref in info.refs:
            parts = urlsplit(ref)
            if parts.scheme in EXTERNAL_SCHEMES or parts.netloc:
                continue
            path, fragment = unquote(parts.path), unquote(parts.fragment)
            if not path:
                target = page
            elif path.startswith("/"):
                target = root / path.lstrip("/")
            else:
                target = (page.parent / path).resolve()
            if target.is_dir():
                target = target / "index.html"
            where = f"{page.relative_to(root)}:{line}"
            if not target.exists():
                problems.append(f"{where}  missing file  {ref}")
            elif fragment and target.suffix == ".html":
                ids = parsed[target].ids if target in parsed else parse(target).ids
                if fragment not in ids:
                    problems.append(f"{where}  missing anchor  {ref}")

    checked = sum(len(info.refs) for info in parsed.values())
    if problems:
        print("\n".join(problems))
        print(f"\n{len(problems)} broken reference(s) in {len(pages)} page(s).")
        return 1
    print(f"OK: {checked} references in {len(pages)} page(s), none broken.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "_site"))
