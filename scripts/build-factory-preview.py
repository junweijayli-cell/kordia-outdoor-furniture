#!/usr/bin/env python3
"""Create the local review entry point without changing production routing."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / 'index.html').read_text(encoding='utf-8')
html = html.replace('<meta name="robots" content="index, follow">',
                    '<meta name="robots" content="noindex, nofollow">')
html = html.replace('</head>', '''<!-- Local preview: open the factory route without an entrance animation. -->
<script>
  if (!location.hash) location.hash = '/factory';
  try { sessionStorage.setItem('kordia-intro', 'seen'); } catch {}
</script>
</head>''', 1)
output = ROOT / 'factory-preview.html'
output.write_text(html, encoding='utf-8')
print(f'Local review page: {output}')
