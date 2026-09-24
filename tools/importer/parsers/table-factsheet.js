/* eslint-disable */
/* global WebImporter */
/**
 * Parser for table-factsheet. Base: table.
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html
 * Generated: 2026-09-23
 *
 * Library convention (Table, no header): multiple 2-column rows, no header row.
 *   First cell = label, second cell = value.
 * Source structure: .cmp-contentfragment > dl.cmp-contentfragment__elements
 *   > .cmp-contentfragment__element (repeating ×6, iterationSafe), each with
 *   dt.cmp-contentfragment__element-title (label) and
 *   dd.cmp-contentfragment__element-value (value).
 * Produce a "Table (no header)" variant: one row per label/value pair.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each fact-sheet element is a label/value pair. Iterate the element wrappers (digest: iterationSafe).
  let items = Array.from(element.querySelectorAll('.cmp-contentfragment__element'));
  if (!items.length) {
    // Fallback: direct children of the description list.
    items = Array.from(element.querySelectorAll('dl.cmp-contentfragment__elements > div'));
  }

  items.forEach((item) => {
    const label = item.querySelector('.cmp-contentfragment__element-title, dt');
    const value = item.querySelector('.cmp-contentfragment__element-value, dd');
    // Both cells required for a valid 2-column row; skip incomplete pairs.
    if (!label && !value) return;

    // Normalize label to plain text and value preserving its node content.
    const labelText = label ? label.textContent.trim() : '';
    const valueText = value ? value.textContent.trim() : '';
    cells.push([labelText, valueText]);
  });

  // Empty-block guard: no label/value pairs found.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // "Table (no header)" variant — pass the variant option so no header row is rendered.
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'table-factsheet',
    cells,
  });
  element.replaceWith(block);
}
