/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document: document2 }) {
    const cells = [];
    let slides = Array.from(element.querySelectorAll(".cmp-carousel__item"));
    if (!slides.length) {
      slides = Array.from(element.querySelectorAll(".teaser.cmp-teaser--hero, .cmp-teaser"));
    }
    slides.forEach((slide) => {
      const image = slide.querySelector(".cmp-teaser__image img, .cmp-image img, img");
      const contentCell = [];
      const title = slide.querySelector(".cmp-teaser__title, h1, h2, h3");
      if (title) contentCell.push(title);
      const description = slide.querySelector(".cmp-teaser__description, p");
      if (description) contentCell.push(description);
      const ctaLinks = Array.from(slide.querySelectorAll(".cmp-teaser__action-link, .cmp-teaser__action-container a"));
      contentCell.push(...ctaLinks);
      if (!image && !contentCell.length) return;
      cells.push([image || "", contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-featured.js
  function parse2(element, { document: document2 }) {
    const image = element.querySelector(".cmp-teaser__image img, .cmp-image img, img");
    const textCell = [];
    const eyebrow = element.querySelector(".cmp-teaser__pretitle");
    if (eyebrow) textCell.push(eyebrow);
    const title = element.querySelector(".cmp-teaser__title, h1, h2, h3");
    if (title) textCell.push(title);
    const description = element.querySelector(".cmp-teaser__description, p:not(.cmp-teaser__pretitle)");
    if (description) textCell.push(description);
    const ctaLinks = Array.from(element.querySelectorAll(".cmp-teaser__action-link, .cmp-teaser__action-container a"));
    textCell.push(...ctaLinks);
    if (!image && !textCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[image || "", textCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-image.js
  function parse3(element, { document: document2 }) {
    const cells = [];
    let items = Array.from(element.querySelectorAll(".cmp-image-list__item"));
    if (!items.length) {
      items = Array.from(element.querySelectorAll("li, .card, article"));
    }
    items.forEach((item) => {
      const image = item.querySelector(".cmp-image-list__item-image img, .cmp-image img, img");
      const titleLink = item.querySelector(".cmp-image-list__item-title-link, a[href]");
      const href = titleLink ? titleLink.getAttribute("href") : null;
      const titleText = item.querySelector(".cmp-image-list__item-title, h1, h2, h3, h4");
      const contentCell = [];
      if (titleText) {
        const heading = document2.createElement("h3");
        if (href) {
          const link = document2.createElement("a");
          link.setAttribute("href", href);
          link.textContent = titleText.textContent.trim();
          heading.append(link);
        } else {
          heading.textContent = titleText.textContent.trim();
        }
        contentCell.push(heading);
      }
      const description = item.querySelector(".cmp-image-list__item-description, p");
      if (description) {
        const p = document2.createElement("p");
        p.textContent = description.textContent.trim();
        contentCell.push(p);
      }
      if (!image && !contentCell.length) return;
      cells.push([image || "", contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-image", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-teaser.js
  function parse4(element, { document: document2 }) {
    const image = element.querySelector(".cmp-teaser__image img, .cmp-image img, img");
    const contentCell = [];
    const title = element.querySelector(".cmp-teaser__title, h1, h2, h3");
    if (title) contentCell.push(title);
    const description = element.querySelector(".cmp-teaser__description, p");
    if (description) contentCell.push(description);
    const ctaLinks = Array.from(element.querySelectorAll(".cmp-teaser__action-link, .cmp-teaser__action-container a"));
    contentCell.push(...ctaLinks);
    if (!image && !contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) cells.push([image]);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-teaser", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "header.cmp-experiencefragment--header",
        "#toggleNav",
        "#mobileNav",
        "#destination_publishing_iframe_wkndsite_0"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "footer.cmp-experiencefragment--footer",
        "meta",
        "iframe",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-home.js
  var PAGE_TEMPLATE = {
    name: "home",
    description: "WKND home/landing page: hero carousel, featured article, recent articles grid, full-width adventure teaser, and destinations grid.",
    urls: [
      "https://wknd.site/us/en.html"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: [".carousel.cmp-carousel--hero", ".cmp-carousel--hero"]
      },
      {
        name: "columns-featured",
        instances: [".teaser.cmp-teaser--featured", ".cmp-teaser--featured"]
      },
      {
        name: "cards-image",
        instances: [".image-list.list", ".cmp-image-list"]
      },
      {
        name: "hero-teaser",
        instances: [".teaser.cmp-teaser--imagebottom", ".cmp-teaser--imagebottom"]
      }
    ],
    sections: [
      {
        id: "s1",
        name: "Hero Carousel",
        selector: [".carousel.cmp-carousel--hero"],
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "s2",
        name: "Featured Article",
        selector: [".teaser.cmp-teaser--featured"],
        style: "grey",
        blocks: ["columns-featured"],
        defaultContent: []
      },
      {
        id: "s3",
        name: "Recent Articles",
        selector: [".title.cmp-title--underline"],
        style: null,
        blocks: ["cards-image"],
        defaultContent: []
      },
      {
        id: "s4",
        name: "Next Adventures / Climbing New Zealand",
        selector: [".teaser.cmp-teaser--imagebottom"],
        style: null,
        blocks: ["hero-teaser"],
        defaultContent: []
      },
      {
        id: "s5",
        name: "Where do you want to go?",
        selector: [".title.aem-GridColumn"],
        style: null,
        blocks: ["cards-image"],
        defaultContent: []
      }
    ]
  };
  var parsers = {
    "carousel-hero": parse,
    "columns-featured": parse2,
    "cards-image": parse3,
    "hero-teaser": parse4
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        elements.forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
