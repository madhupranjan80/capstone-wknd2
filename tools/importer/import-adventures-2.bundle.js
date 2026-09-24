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

  // tools/importer/import-adventures-2.js
  var import_adventures_2_exports = {};
  __export(import_adventures_2_exports, {
    default: () => import_adventures_2_default
  });

  // tools/importer/parsers/hero-teaser.js
  function parse(element, { document }) {
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
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-teaser", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-adventure.js
  function parse2(element, { document }) {
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
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-adventure", cells });
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

  // tools/importer/import-adventures-2.js
  var PAGE_TEMPLATE = {
    name: "adventures-2",
    description: "WKND adventures listing page: page title, full-bleed hero teaser, and a category tab strip containing a grid of adventure cards.",
    blocks: [
      { name: "hero-teaser", instances: [".teaser.cmp-teaser--hero", ".cmp-teaser--hero"] },
      { name: "tabs-adventure", instances: [".tabs.panelcontainer", ".cmp-tabs"] }
    ],
    sections: []
  };
  var parsers = {
    "hero-teaser": parse,
    "tabs-adventure": parse2
  };
  var transformers = [transform];
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
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          if (seen.has(element)) return;
          if (pageBlocks.some((b) => b.element.contains(element) || element.contains(b.element))) return;
          seen.add(element);
          pageBlocks.push({ name: blockDef.name, selector, element });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_adventures_2_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_adventures_2_exports);
})();
