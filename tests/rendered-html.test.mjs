import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the KORDIA landing page and motion hooks", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>KORDIA Outdoor Furniture Manufacturer \| Foshan, China<\/title>/i,
  );
  assert.match(html, /Built for <em>outdoor lifestyle\.<\/em>/);
  assert.match(html, /id="kordia-intro"/);
  assert.match(html, /class="intro-word">KORDIA<\/div>/);
  assert.match(html, /id="cursor-dot"/);
  assert.match(html, /id="cursor-ring"/);
  assert.match(html, /500\+ models of rope-weave/);
  assert.doesNotMatch(html, /codex-preview|Building your site/i);
});

test("ships local typography and accessible motion styles", async () => {
  const [layout, page, css, packageJson] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /@fontsource\/inter\/400\.css/);
  assert.match(layout, /@fontsource\/fraunces\/300\.css/);
  assert.match(packageJson, /"@fontsource\/inter"/);
  assert.match(packageJson, /"@fontsource\/fraunces"/);

  assert.match(page, /id="kordia-intro"/);
  assert.match(page, /id="cursor-dot"/);
  assert.match(page, /id="cursor-ring"/);
  assert.match(page, /addEventListener\("pointermove"/);
  assert.match(page, /addEventListener\("pointerdown"/);

  assert.match(css, /font-family:\s*"Inter"/);
  assert.match(css, /font-family:\s*"Fraunces"/);
  assert.match(css, /@keyframes introWordIn/);
  assert.match(css, /@keyframes cursorClick/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});
