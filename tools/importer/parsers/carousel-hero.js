/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base: carousel.
 * Source: https://wknd.site/us/en.html
 * Generated: 2026-09-23
 *
 * Library convention (carousel): 2 columns, one row per slide.
 *   Cell 1: slide image (mandatory).
 *   Cell 2: text content — title (heading), description, CTA link.
 * Source structure: .cmp-carousel__item > .teaser.cmp-teaser--hero, each with
 *   .cmp-teaser__title (h2), .cmp-teaser__description, .cmp-teaser__action-link (a), .cmp-image img.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each carousel item is one slide. Fallback to teaser blocks if item wrappers are absent.
  let slides = Array.from(element.querySelectorAll('.cmp-carousel__item'));
  if (!slides.length) {
    slides = Array.from(element.querySelectorAll('.teaser.cmp-teaser--hero, .cmp-teaser'));
  }

  slides.forEach((slide) => {
    const image = slide.querySelector('.cmp-teaser__image img, .cmp-image img, img');

    const contentCell = [];
    const title = slide.querySelector('.cmp-teaser__title, h1, h2, h3');
    if (title) contentCell.push(title);
    const description = slide.querySelector('.cmp-teaser__description, p');
    if (description) contentCell.push(description);
    const ctaLinks = Array.from(slide.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a'));
    contentCell.push(...ctaLinks);

    // Skip empty slides; both cells must have content per convention.
    if (!image && !contentCell.length) return;

    cells.push([image || '', contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
