/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS (reused from earlier templates)
import heroTeaserParser from './parsers/hero-teaser.js';
import tabsAdventureParser from './parsers/tabs-adventure.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
// Adventures listing page: title (default) + hero teaser + a category tab strip
// whose panels contain adventure-card grids.
const PAGE_TEMPLATE = {
  name: 'adventures-2',
  description: 'WKND adventures listing page: page title, full-bleed hero teaser, and a category tab strip containing a grid of adventure cards.',
  blocks: [
    { name: 'hero-teaser', instances: ['.teaser.cmp-teaser--hero', '.cmp-teaser--hero'] },
    { name: 'tabs-adventure', instances: ['.tabs.panelcontainer', '.cmp-tabs'] },
  ],
  sections: [],
};

// PARSER REGISTRY
const parsers = {
  'hero-teaser': heroTeaserParser,
  'tabs-adventure': tabsAdventureParser,
};

// TRANSFORMER REGISTRY
const transformers = [cleanupTransformer];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
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
  const seen = new Set();
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (seen.has(element)) return;
        // skip elements nested inside an already-collected block (e.g. cards inside a tab panel)
        if (pageBlocks.some((b) => b.element.contains(element) || element.contains(b.element))) return;
        seen.add(element);
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

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

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
