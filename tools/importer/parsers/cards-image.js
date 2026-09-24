/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-image. Base: cards.
 * Source: https://wknd.site/us/en.html
 * Generated: 2026-09-23
 *
 * Library convention (cards): 2 columns, one row per card.
 *   Cell 1: card image (mandatory).
 *   Cell 2: title (heading) + description + optional CTA.
 * Source: .cmp-image-list > li.cmp-image-list__item each containing
 *   .cmp-image-list__item-image img, .cmp-image-list__item-title (span),
 *   .cmp-image-list__item-description (span), and image/title links (href for clickable card).
 */
export default function parse(element, { document }) {
  const cells = [];

  let items = Array.from(element.querySelectorAll('.cmp-image-list__item'));
  if (!items.length) {
    items = Array.from(element.querySelectorAll('li, .card, article'));
  }

  items.forEach((item) => {
    const image = item.querySelector('.cmp-image-list__item-image img, .cmp-image img, img');

    // The card links to its target; preserve the URL as the title link.
    const titleLink = item.querySelector('.cmp-image-list__item-title-link, a[href]');
    const href = titleLink ? titleLink.getAttribute('href') : null;
    const titleText = item.querySelector('.cmp-image-list__item-title, h1, h2, h3, h4');

    const contentCell = [];
    if (titleText) {
      const heading = document.createElement('h3');
      if (href) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = titleText.textContent.trim();
        heading.append(link);
      } else {
        heading.textContent = titleText.textContent.trim();
      }
      contentCell.push(heading);
    }

    const description = item.querySelector('.cmp-image-list__item-description, p');
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      contentCell.push(p);
    }

    // Skip empty cards; both cells must have content per convention.
    if (!image && !contentCell.length) return;

    cells.push([image || '', contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-image', cells });
  element.replaceWith(block);
}
