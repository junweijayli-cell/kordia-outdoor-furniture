import {
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const outputArgument = process.argv[2];

if (!outputArgument) {
  throw new Error(
    "Usage: node scripts/export-github-pages.mjs <github-pages-package-directory>",
  );
}

const projectRoot = process.cwd();
const outputRoot = path.resolve(outputArgument);
const outputName = path.basename(outputRoot).toLowerCase();

if (
  outputRoot === projectRoot ||
  outputRoot === path.parse(outputRoot).root ||
  !outputName.includes("github-pages-package")
) {
  throw new Error(
    "Refusing to replace an unsafe output path. Use a dedicated directory whose name contains github-pages-package.",
  );
}

const distRoot = path.join(projectRoot, "dist");
const clientRoot = path.join(distRoot, "client");
const serverEntry = path.join(distRoot, "server", "index.js");
const assetRoot = path.join(clientRoot, "assets");

const assetFiles = await readdir(assetRoot);
const stylesheetName = assetFiles.find(
  (name) => name.startsWith("index-") && name.endsWith(".css"),
);

if (!stylesheetName) {
  throw new Error("Could not find the compiled KORDIA stylesheet.");
}

const workerUrl = pathToFileURL(serverEntry);
workerUrl.searchParams.set("static-export", `${Date.now()}`);
const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
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

if (!response.ok) {
  throw new Error(`Static render failed with HTTP ${response.status}.`);
}

let html = await response.text();
html = html
  .replace(
    /<link\b(?=[^>]*\brel=["'](?:stylesheet|modulepreload)["'])[^>]*\/?>\s*/gi,
    "",
  )
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>\s*/gi, "")
  .replace(/<!--\s*-->/g, "")
  .replaceAll('="/images/', '="./images/')
  .replaceAll('="/assets/', '="./assets/')
  .replaceAll('="/favicon.svg', '="./favicon.svg')
  .replace(
    "</head>",
    [
      '<meta name="generator" content="KORDIA GitHub Pages static export">',
      '<link rel="stylesheet" href="./styles.css">',
      "</head>",
    ].join(""),
  )
  .replace(
    "</body>",
    '<script src="./script.js" defer></script></body>',
  );

if (
  html.includes('src="/images/') ||
  html.includes('href="/assets/') ||
  html.includes("self.__VINEXT") ||
  html.includes('rel="modulepreload"')
) {
  throw new Error("The rendered HTML still contains server-only asset references.");
}

let css = await readFile(path.join(assetRoot, stylesheetName), "utf8");
css = css.replaceAll("url(/assets/", "url(./assets/");

const script = `(() => {
  const intro = document.querySelector("#kordia-intro");
  let introTimer = 0;
  let introFallback = 0;

  const finishIntro = () => {
    if (!intro) return;
    intro.classList.add("is-done");
    window.clearTimeout(introTimer);
    window.clearTimeout(introFallback);
  };

  if (intro) {
    introTimer = window.setTimeout(finishIntro, 2200);
    introFallback = window.setTimeout(finishIntro, 4500);
    intro.addEventListener("click", finishIntro);
  }

  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".nav");
  menuButton?.addEventListener("click", () => {
    const open = nav?.classList.toggle("nav-open") ?? false;
    menuButton.setAttribute("aria-expanded", String(open));
  });
  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("nav-open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  const filterButtons = Array.from(document.querySelectorAll(".filters button"));
  const productCards = Array.from(document.querySelectorAll(".product-card"));
  filterButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("filter-active")),
    );
    button.addEventListener("click", () => {
      const requestedCategory = button.textContent.trim();
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("filter-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      productCards.forEach((card) => {
        const category =
          card.querySelector(".product-category")?.textContent.trim() ?? "";
        card.hidden =
          requestedCategory !== "All" && category !== requestedCategory;
      });
    });
  });

  const dot = document.querySelector("#cursor-dot");
  const ring = document.querySelector("#cursor-ring");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  if (!dot || !ring || !finePointer.matches) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let frame = 0;
  let clickTimer = 0;

  const onPointerMove = (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    dot.style.left = \`\${mouseX}px\`;
    dot.style.top = \`\${mouseY}px\`;
    dot.classList.add("is-visible");
    ring.classList.add("is-visible");
  };

  const onPointerOver = (event) => {
    if (event.target.closest("a, button, [data-cursor]")) {
      dot.classList.add("is-hovering");
      ring.classList.add("is-hovering");
    }
  };

  const onPointerOut = (event) => {
    if (!event.relatedTarget?.closest?.("a, button, [data-cursor]")) {
      dot.classList.remove("is-hovering");
      ring.classList.remove("is-hovering");
    }
  };

  const onPointerDown = () => {
    window.clearTimeout(clickTimer);
    ring.classList.remove("is-clicking");
    dot.classList.add("is-clicking");
    requestAnimationFrame(() => ring.classList.add("is-clicking"));
    clickTimer = window.setTimeout(() => {
      dot.classList.remove("is-clicking");
      ring.classList.remove("is-clicking");
    }, 520);
  };

  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = \`\${ringX}px\`;
    ring.style.top = \`\${ringY}px\`;
    frame = requestAnimationFrame(animateRing);
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerover", onPointerOver);
  document.addEventListener("pointerout", onPointerOut);
  document.addEventListener("pointerdown", onPointerDown);
  frame = requestAnimationFrame(animateRing);

  window.addEventListener(
    "pagehide",
    () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(clickTimer);
    },
    { once: true },
  );
})();`;

const readme = `# KORDIA Outdoor Furniture — GitHub Pages package

This branch contains the complete static website package at the repository root.
It is designed to be served directly by GitHub Pages without a Node.js server or
any external hosting provider.

- \`index.html\` — complete page markup
- \`styles.css\` — responsive design, local fonts, and motion styles
- \`script.js\` — intro, menu, filters, and cursor interactions
- \`images/\` — product and editorial photography
- \`assets/\` — self-hosted Inter and Fraunces font files
`;

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });
await Promise.all([
  cp(assetRoot, path.join(outputRoot, "assets"), { recursive: true }),
  cp(path.join(clientRoot, "images"), path.join(outputRoot, "images"), {
    recursive: true,
  }),
  cp(
    path.join(clientRoot, "favicon.svg"),
    path.join(outputRoot, "favicon.svg"),
  ),
]);
await Promise.all([
  writeFile(path.join(outputRoot, "index.html"), html),
  writeFile(path.join(outputRoot, "404.html"), html),
  writeFile(path.join(outputRoot, "styles.css"), css),
  writeFile(path.join(outputRoot, "script.js"), script),
  writeFile(path.join(outputRoot, "README.md"), readme),
  writeFile(path.join(outputRoot, ".nojekyll"), ""),
]);

console.log(`GitHub Pages package created at ${outputRoot}`);
