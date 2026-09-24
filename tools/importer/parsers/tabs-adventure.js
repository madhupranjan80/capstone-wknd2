/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-adventure. Base: tabs.
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html
 * Generated: 2026-09-23
 *
 * Library convention (Tabs): 2 columns, one row per tab.
 *   Cell 1: tab label (mandatory).
 *   Cell 2: tab panel content (mandatory) — rich content (paragraphs, headings, images, lists).
 * Source structure: .cmp-tabs > ol.cmp-tabs__tablist > li.cmp-tabs__tab (labels)
 *   and sibling div.cmp-tabs__tabpanel (panel content, repeating ×N, iterationSafe).
 *   Labels and panels are parallel ordered lists (Overview / Itinerary / What to Bring).
 */
export default function parse(element, { document }) {
  const cells = [];

  const labels = Array.from(element.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab, ol.cmp-tabs__tablist > li'));
  // Panels are the repeating iterationSafe unit; iterate them and pair by index with labels.
  const panels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel'));

  panels.forEach((panel, i) => {
    const label = labels[i];
    const labelText = label ? label.textContent.trim() : '';

    // Extract the meaningful panel content. Prefer the inner content fragment body,
    // dropping the redundant duplicate title and empty grid scaffolding.
    let contentRoot = panel.querySelector('.cmp-contentfragment__elements') || panel;

    const contentCell = [];
    Array.from(contentRoot.children).forEach((child) => {
      // Skip empty layout-grid wrappers that carry no visible content.
      if (child.querySelector && !child.querySelector('img') && !child.textContent.trim()) return;
      contentCell.push(child);
    });

    // Fallback: if filtering removed everything, keep the whole panel content root.
    if (!contentCell.length) contentCell.push(contentRoot);

    cells.push([labelText, contentCell]);
  });

  // Empty-block guard: no panels found.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-adventure', cells });
  element.replaceWith(block);
}
