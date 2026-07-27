"use client";

import { useMemo, useState } from "react";

const collections = [
  {
    name: "Sofa & Lounge",
    count: "136 models",
    image: "/images/collection-sofa.jpg",
    className: "collection-wide",
    copy: "Rope-weave sofa sets, modular sectionals and deep lounge seating.",
  },
  {
    name: "Outdoor Dining",
    count: "99 models",
    image: "/images/collection-dining.jpg",
    copy: "Four- to twelve-seat dining, bistro sets and bar programmes.",
  },
  {
    name: "Sun & Leisure",
    count: "91 models",
    image: "/images/collection-sun.jpg",
    copy: "Loungers, daybeds, swings and hanging chairs.",
  },
  {
    name: "Shade & Structures",
    count: "48 models",
    image: "/images/collection-shade.jpg",
    copy: "Parasols, louvred pergolas, gazebos and garden rooms.",
  },
  {
    name: "Fire & Kitchen",
    count: "11 models",
    image: "/images/collection-fire.jpg",
    copy: "Fire tables and stainless outdoor kitchen systems.",
  },
  {
    name: "Garden & Public Space",
    count: "29 models",
    image: "/images/collection-garden.jpg",
    className: "collection-full",
    copy: "Benches, picnic tables, planters and municipal furniture.",
  },
];

const products = [
  { name: "Rope Lounge Programme", category: "Lounge", ref: "Catalog p. 002", image: "/images/product-01.jpg" },
  { name: "Modular Terrace Sofa", category: "Lounge", ref: "Catalog p. 024", image: "/images/product-08.jpg" },
  { name: "Twelve-Seat Dining", category: "Dining", ref: "Catalog p. 071", image: "/images/collection-dining.jpg" },
  { name: "Solid Teak Dining", category: "Dining", ref: "Catalog p. 064", image: "/images/material-teak.jpg" },
  { name: "Poolside Lounger", category: "Leisure", ref: "Catalog p. 105", image: "/images/collection-sun.jpg" },
  { name: "Hanging Day Chair", category: "Leisure", ref: "Catalog p. 124", image: "/images/leisure-hanging.jpg" },
  { name: "Louvred Pergola", category: "Shade", ref: "Catalog p. 114", image: "/images/collection-shade.jpg" },
  { name: "LED Cantilever Parasol", category: "Shade", ref: "Catalog p. 137", image: "/images/shade-parasol.jpg" },
  { name: "Modular Outdoor Kitchen", category: "Fire & Kitchen", ref: "Catalog p. 134", image: "/images/collection-fire.jpg" },
  { name: "Linear Fire Table", category: "Fire & Kitchen", ref: "Catalog p. 133", image: "/images/fire-table.jpg" },
  { name: "Public Picnic System", category: "Public Space", ref: "Catalog p. 131", image: "/images/collection-garden.jpg" },
  { name: "Custom-Logo Planters", category: "Public Space", ref: "Catalog p. 132", image: "/images/public-planters.jpg" },
];

const filters = ["All", "Lounge", "Dining", "Leisure", "Shade", "Fire & Kitchen", "Public Space"];

export default function Home() {
  const [filter, setFilter] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleProducts = useMemo(
    () => filter === "All" ? products : products.filter((product) => product.category === filter),
    [filter],
  );

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="KORDIA home">KORDIA</a>
        <nav className={menuOpen ? "nav nav-open" : "nav"} aria-label="Main navigation">
          <a href="#collections" onClick={() => setMenuOpen(false)}>Collections</a>
          <a href="#models" onClick={() => setMenuOpen(false)}>Selected models</a>
          <a href="#materials" onClick={() => setMenuOpen(false)}>Materials</a>
          <a href="#factory" onClick={() => setMenuOpen(false)}>Factory</a>
        </nav>
        <div className="header-actions">
          <span className="locale">EN <i /> 中文</span>
          <a className="button button-small" href="https://wa.me/8613450846180" target="_blank" rel="noreferrer">Get a quote</a>
          <button
            className="menu-button"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <img src="/images/hero.jpg" alt="KORDIA outdoor lounge furniture beside a pool" />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="hero-kicker">Foshan, China · Outdoor furniture manufacturer</p>
          <h1>Built for <em>outdoor lifestyle.</em></h1>
          <p className="hero-copy">
            500+ models of rope-weave, aluminium and teak—sofas, dining, shade
            and outdoor kitchens—manufactured in Foshan and shipped worldwide.
          </p>
          <div className="hero-actions">
            <a className="button" href="#collections">Explore collections</a>
            <a className="button button-ghost" href="https://wa.me/8613450846180?text=Please%20send%20me%20the%202026%20KORDIA%20catalog" target="_blank" rel="noreferrer">Request 2026 catalog</a>
          </div>
          <div className="hero-stats" aria-label="KORDIA range statistics">
            <div><strong>500+</strong><span>Models</span></div>
            <div><strong>16</strong><span>Categories</span></div>
            <div><strong>40+</strong><span>Markets</span></div>
          </div>
        </div>
        <span className="hero-index">2026 / Outdoor programme</span>
      </section>

      <section className="section section-collections" id="collections">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The 2026 programme</p>
            <h2>A complete terrace,<br /><em>from one factory floor.</em></h2>
          </div>
          <p>
            Seating, dining, shade, fire and landscape in one coordinated
            programme—so buyers can consolidate a container instead of chasing
            six suppliers.
          </p>
        </div>

        <div className="collection-grid">
          {collections.map((collection, index) => (
            <a
              className={`collection-card ${collection.className ?? ""}`}
              href="#models"
              key={collection.name}
              onClick={() => setFilter(
                collection.name === "Sofa & Lounge" ? "Lounge"
                  : collection.name === "Outdoor Dining" ? "Dining"
                    : collection.name === "Sun & Leisure" ? "Leisure"
                      : collection.name === "Shade & Structures" ? "Shade"
                        : collection.name === "Fire & Kitchen" ? "Fire & Kitchen"
                          : "Public Space",
              )}
            >
              <div className="image-frame">
                <img src={collection.image} alt={collection.name} loading={index > 1 ? "lazy" : "eager"} />
                <span className="image-number">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="card-copy">
                <div>
                  <h3>{collection.name}</h3>
                  <p>{collection.copy}</p>
                </div>
                <span>{collection.count} ↗</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="section section-models" id="models">
        <div className="models-title">
          <div>
            <p className="eyebrow eyebrow-light">Selected models</p>
            <h2>Browse the <em>range.</em></h2>
          </div>
          <p>{visibleProducts.length} selected references</p>
        </div>
        <div className="filters" aria-label="Filter selected models">
          {filters.map((item) => (
            <button
              type="button"
              key={item}
              className={filter === item ? "filter-active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <article className="product-card" key={`${product.name}-${product.ref}`}>
              <div className="image-frame">
                <img src={product.image} alt={product.name} loading="lazy" />
                <span className="product-category">{product.category}</span>
              </div>
              <div className="product-copy">
                <div><h3>{product.name}</h3><p>{product.ref}</p></div>
                <a href="https://wa.me/8613450846180" target="_blank" rel="noreferrer" aria-label={`Request a quote for ${product.name}`}>＋</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-factory" id="factory">
        <div className="factory-intro">
          <p className="eyebrow">Why KORDIA</p>
          <h2>Capability,<br /><em>not decoration.</em></h2>
          <p>Four practical reasons overseas buyers source the full programme through KORDIA.</p>
        </div>
        <div className="factory-points">
          {[
            ["01", "One source, no trading margin.", "A single Foshan production network for metal fabrication, weaving, finishing, upholstery and loading."],
            ["02", "Built for weather.", "Powder-coated aluminium, solution-dyed rope, solid teak and quick-dry cushions specified for outdoor use."],
            ["03", "Your brand on the label.", "Custom colours, dimensions, neutral or branded packaging, and private-label programmes."],
            ["04", "Loaded and inspected.", "CBM planning, consolidated containers and pre-shipment quality control before every departure."],
          ].map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{copy}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="materials" id="materials">
        {[
          ["Olefin rope weave", "/images/material-rope.jpg"],
          ["Powder-coated aluminium", "/images/material-aluminium.jpg"],
          ["Solid teak", "/images/material-teak.jpg"],
        ].map(([name, image]) => (
          <article key={name}>
            <div className="image-frame"><img src={image} alt={name} loading="lazy" /></div>
            <span>{name}</span>
          </article>
        ))}
      </section>

      <section className="catalog-band">
        <div className="catalog-image image-frame">
          <img src="/images/catalog-feature.jpg" alt="KORDIA 2026 outdoor furniture collection" loading="lazy" />
        </div>
        <div className="catalog-copy">
          <p className="eyebrow eyebrow-light">2026 edition · 140 pages</p>
          <h2>Begin with the <em>full programme.</em></h2>
          <p>
            Send your market and category requirements. We will return the
            relevant model references, finish options and a project quotation.
          </p>
          <div>
            <a className="button" href="https://wa.me/8613450846180?text=I%27d%20like%20the%202026%20KORDIA%20catalog" target="_blank" rel="noreferrer">Request the catalog</a>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-lead">
          <p>Have a model, moodboard or competitor reference?</p>
          <h2>Let&apos;s build your<br /><em>outdoor programme.</em></h2>
          <a className="button" href="https://wa.me/8613450846180" target="_blank" rel="noreferrer">Talk to Fianna</a>
        </div>
        <div className="footer-bottom">
          <a className="wordmark wordmark-light" href="#top">KORDIA</a>
          <p>Foshan KORDIA Furniture Co., Ltd.<br />Chancheng, Foshan, Guangdong, China</p>
          <p>WhatsApp / WeChat<br /><a href="tel:+8613450846180">+86 134 5084 6180</a></p>
          <p>© 2026 KORDIA<br />Outdoor furniture for global trade</p>
        </div>
      </footer>
    </main>
  );
}
