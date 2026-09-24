/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselAdventureParser from './parsers/carousel-adventure.js';
import tableFactsheetParser from './parsers/table-factsheet.js';
import tabsAdventureParser from './parsers/tabs-adventure.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'adventures',
  description: 'WKND adventure detail page: breadcrumb, full-width hero image carousel, adventure fact sheet, and tabbed Overview/Itinerary/What-to-Bring content.',
  blocks: [
    { name: 'carousel-adventure', instances: ['.carousel.cmp-carousel--mini', '.cmp-carousel--mini'] },
    { name: 'table-factsheet', instances: ['.contentfragment.cmp-contentfragment--elements', '.cmp-contentfragment--elements'] },
    { name: 'tabs-adventure', instances: ['.tabs.panelcontainer', '.cmp-tabs'] },
  ],
  sections: [
    { id: 'a1', name: 'Breadcrumb', selector: ['.breadcrumb.cmp-breadcrumb--fixed', '.cmp-breadcrumb'], style: null, blocks: [], defaultContent: ['.cmp-breadcrumb'] },
    { id: 'a2', name: 'Hero Image Carousel', selector: ['.carousel.cmp-carousel--mini'], style: null, blocks: ['carousel-adventure'], defaultContent: [] },
    { id: 'a3', name: 'Adventure Title + Fact Sheet + Share', selector: ['.contentfragment.cmp-contentfragment--elements', '.cmp-contentfragment--elements'], style: null, blocks: ['table-factsheet'], defaultContent: [] },
    { id: 'a4', name: 'Tabbed Content', selector: ['.tabs.panelcontainer', '.cmp-tabs'], style: null, blocks: ['tabs-adventure'], defaultContent: [] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'carousel-adventure': carouselAdventureParser,
  'table-factsheet': tableFactsheetParser,
  'tabs-adventure': tabsAdventureParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

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
        pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
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

    // 1. beforeTransform (cleanup + section-break markers)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block; skip elements already replaced by a prior parser
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks / metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root URL to /index)
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
