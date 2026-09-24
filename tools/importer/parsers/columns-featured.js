/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-featured. Base: columns.
 * Source: https://wknd.site/us/en.html
 * Generated: 2026-09-23
 *
 * Library convention (columns): first row block name, subsequent rows have N columns.
 * This variant: one content row, two columns.
 *   Column 1: image (left).
 *   Column 2: eyebrow (pretitle) + heading + description + CTA link (right).
 * Source: .teaser.cmp-teaser--featured with .cmp-teaser__pretitle, .cmp-teaser__title (h2),
 *   .cmp-teaser__description, .cmp-teaser__action-link (a), .cmp-teaser__image img.
 */
export default function parse(element, { document }) {
  const image = element.querySelector('.cmp-teaser__image img, .cmp-image img, img');

  const textCell = [];
  const eyebrow = element.querySelector('.cmp-teaser__pretitle');
  if (eyebrow) textCell.push(eyebrow);
  const title = element.querySelector('.cmp-teaser__title, h1, h2, h3');
  if (title) textCell.push(title);
  const description = element.querySelector('.cmp-teaser__description, p:not(.cmp-teaser__pretitle)');
  if (description) textCell.push(description);
  const ctaLinks = Array.from(element.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a'));
  textCell.push(...ctaLinks);

  // Empty-block guard: bail if no image and no text content.
  if (!image && !textCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Two-column layout: image left, text right.
  const cells = [[image || '', textCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-featured', cells });
  element.replaceWith(block);
}
