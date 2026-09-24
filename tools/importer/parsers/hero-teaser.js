/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-teaser. Base: hero.
 * Source: https://wknd.site/us/en.html
 * Generated: 2026-09-23
 *
 * Library convention (hero): 1 column, 3 rows (block name row, then 2 content rows).
 *   Row 2 (single cell): background image (optional).
 *   Row 3 (single cell): title (heading) + subheading/description + CTA link.
 * Source: .teaser.cmp-teaser--imagebottom with .cmp-teaser__title (h2),
 *   .cmp-teaser__description, .cmp-teaser__action-link (a), .cmp-teaser__image img.
 */
export default function parse(element, { document }) {
  const image = element.querySelector('.cmp-teaser__image img, .cmp-image img, img');

  const contentCell = [];
  const title = element.querySelector('.cmp-teaser__title, h1, h2, h3');
  if (title) contentCell.push(title);
  const description = element.querySelector('.cmp-teaser__description, p');
  if (description) contentCell.push(description);
  const ctaLinks = Array.from(element.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a'));
  contentCell.push(...ctaLinks);

  // Empty-block guard.
  if (!image && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // 1-column block: separate rows for background image and text content.
  const cells = [];
  if (image) cells.push([image]);           // row 2: background image (single cell)
  cells.push([contentCell]);                // row 3: text content (single cell holding all elements)

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-teaser', cells });
  element.replaceWith(block);
}
