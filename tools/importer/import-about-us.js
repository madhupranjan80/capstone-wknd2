/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS (reused from earlier templates)
import cardsImageParser from './parsers/cards-image.js';
import columnsFeaturedParser from './parsers/columns-featured.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
// Two pages: about-us.html (contributor/guide directory — mostly default content)
// and magazine.html (landing: featured promo + article-card grid).
const PAGE_TEMPLATE = {
  name: 'about-us',
  description: 'WKND about-us / magazine landing: editorial default content plus (on the magazine landing) a featured-article promo and an article-card grid.',
  blocks: [
    { name: 'cards-image', instances: ['.image-list.list', '.cmp-image-list'] },
    { name: 'columns-featured', instances: ['.teaser.cmp-teaser--featured', '.cmp-teaser--featured'] },
  ],
  sections: [],
};

// PARSER REGISTRY
const parsers = {
  'cards-image': cardsImageParser,
  'columns-featured': columnsFeaturedParser,
};

// TRANSFORMER REGISTRY (no section transformer — sections vary per page)
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
