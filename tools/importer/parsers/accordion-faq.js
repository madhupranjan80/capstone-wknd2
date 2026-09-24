/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://wknd.site/us/en/faqs.html
 * Generated: 2026-09-23
 *
 * Block table (2 columns):
 *   Row 1: block name.
 *   One row per Q&A item: [question text, answer content].
 * Iteration key: div.cmp-accordion__item (7 items, iterationSafe per structure.json —
 * plain <div>s, no nested interactive elements, so no item-collapse trap).
 */
export default function parse(element, { document }) {
  // Each accordion item is a Q&A pair.
  const items = element.querySelectorAll('.cmp-accordion__item, [class*="accordion__item"]');

  const cells = [];

  items.forEach((item) => {
    // Question: the clickable title/label.
    const titleEl = item.querySelector('.cmp-accordion__title, .cmp-accordion__button, .cmp-accordion__header');
    const question = (titleEl ? titleEl.textContent : '').replace(/\s+/g, ' ').trim();

    // Answer: the panel body content, preserving semantic HTML (paragraphs, headings, etc.).
    const panel = item.querySelector('.cmp-accordion__panel, [class*="accordion__panel"]');
    const answerCell = [];
    if (panel) {
      // Prefer the innermost text containers so we drop AEM's grid/container wrappers.
      const textBlocks = panel.querySelectorAll('.cmp-text, .text');
      if (textBlocks.length) {
        textBlocks.forEach((tb) => {
          [...tb.children].forEach((child) => answerCell.push(child));
        });
      } else {
        // Fallback: pull recognizable content nodes directly from the panel.
        panel
          .querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol, img, a')
          .forEach((node) => answerCell.push(node));
      }
    }

    // Skip fully empty items; otherwise emit a 2-cell row.
    if (!question && !answerCell.length) return;
    cells.push([question, answerCell.length ? answerCell : '']);
  });

  // Empty-block guard: nothing extracted, unwrap in place.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
