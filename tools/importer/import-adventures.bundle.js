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

  // tools/importer/import-adventures.js
  var import_adventures_exports = {};
  __export(import_adventures_exports, {
    default: () => import_adventures_default
  });

  // tools/importer/parsers/carousel-adventure.js
  function parse(element, { document: document2 }) {
    const cells = [];
    let slides = Array.from(element.querySelectorAll(".cmp-carousel__item"));
    if (!slides.length) {
      slides = Array.from(element.querySelectorAll(".cmp-carousel__content .cmp-image, .cmp-carousel__content .image"));
    }
    slides.forEach((slide) => {
      const image = slide.querySelector(".cmp-image img, .image img, img");
      if (!image) return;
      cells.push([image, ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-adventure", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table-factsheet.js
  function parse2(element, { document: document2 }) {
    const cells = [];
    let items = Array.from(element.querySelectorAll(".cmp-contentfragment__element"));
    if (!items.length) {
      items = Array.from(element.querySelectorAll("dl.cmp-contentfragment__elements > div"));
    }
    items.forEach((item) => {
      const label = item.querySelector(".cmp-contentfragment__element-title, dt");
      const value = item.querySelector(".cmp-contentfragment__element-value, dd");
      if (!label && !value) return;
      const labelText = label ? label.textContent.trim() : "";
      const valueText = value ? value.textContent.trim() : "";
      cells.push([labelText, valueText]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "table-factsheet",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-adventure.js
  function parse3(element, { document: document2 }) {
    const cells = [];
    const labels = Array.from(element.querySelectorAll(".cmp-tabs__tablist .cmp-tabs__tab, ol.cmp-tabs__tablist > li"));
    const panels = Array.from(element.querySelectorAll(".cmp-tabs__tabpanel"));
    panels.forEach((panel, i) => {
      const label = labels[i];
      const labelText = label ? label.textContent.trim() : "";
      let contentRoot = panel.querySelector(".cmp-contentfragment__elements") || panel;
      const contentCell = [];
      Array.from(contentRoot.children).forEach((child) => {
        if (child.querySelector && !child.querySelector("img") && !child.textContent.trim()) return;
        contentCell.push(child);
      });
      if (!contentCell.length) contentCell.push(contentRoot);
      cells.push([labelText, contentCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-adventure", cells });
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
      element.querySelectorAll("div.sharing").forEach((sharing) => {
        const prev = sharing.previousElementSibling;
        if (prev && prev.classList.contains("title")) prev.remove();
      });
      WebImporter.DOMUtils.remove(element, [
        "div.breadcrumb.cmp-breadcrumb--fixed",
        "div.sharing"
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

  // tools/importer/import-adventures.js
  var PAGE_TEMPLATE = {
    name: "adventures",
    description: "WKND adventure detail page: breadcrumb, full-width hero image carousel, adventure fact sheet, and tabbed Overview/Itinerary/What-to-Bring content.",
    blocks: [
      { name: "carousel-adventure", instances: [".carousel.cmp-carousel--mini", ".cmp-carousel--mini"] },
      { name: "table-factsheet", instances: [".contentfragment.cmp-contentfragment--elements", ".cmp-contentfragment--elements"] },
      { name: "tabs-adventure", instances: [".tabs.panelcontainer", ".cmp-tabs"] }
    ],
    sections: [
      { id: "a1", name: "Breadcrumb", selector: [".breadcrumb.cmp-breadcrumb--fixed", ".cmp-breadcrumb"], style: null, blocks: [], defaultContent: [".cmp-breadcrumb"] },
      { id: "a2", name: "Hero Image Carousel", selector: [".carousel.cmp-carousel--mini"], style: null, blocks: ["carousel-adventure"], defaultContent: [] },
      { id: "a3", name: "Adventure Title + Fact Sheet + Share", selector: [".contentfragment.cmp-contentfragment--elements", ".cmp-contentfragment--elements"], style: null, blocks: ["table-factsheet"], defaultContent: [] },
      { id: "a4", name: "Tabbed Content", selector: [".tabs.panelcontainer", ".cmp-tabs"], style: null, blocks: ["tabs-adventure"], defaultContent: [] }
    ]
  };
  var parsers = {
    "carousel-adventure": parse,
    "table-factsheet": parse2,
    "tabs-adventure": parse3
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
        document2.querySelectorAll(selector).forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_adventures_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
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
  return __toCommonJS(import_adventures_exports);
})();
