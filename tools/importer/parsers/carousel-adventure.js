/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-adventure. Base: carousel.
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html
 * Generated: 2026-09-23
 *
 * Library convention (carousel): 2 columns, one row per slide.
 *   Cell 1: slide image (mandatory).
 *   Cell 2: optional text content (title/description/CTA) — empty for adventure galleries.
 * Source structure: .carousel.cmp-carousel--mini > .cmp-carousel > .cmp-carousel__content
 *   > .cmp-carousel__item (repeating, iterationSafe), each with .image .cmp-image img.
 *   Slides are image-only (no title/description/CTA). May be one or several slides.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each carousel item is one slide. Iterate the item wrappers (digest: iterationSafe).
  let slides = Array.from(element.querySelectorAll('.cmp-carousel__item'));
  if (!slides.length) {
    // Fallback: image wrappers directly under the carousel content.
    slides = Array.from(element.querySelectorAll('.cmp-carousel__content .cmp-image, .cmp-carousel__content .image'));
  }

  slides.forEach((slide) => {
    const image = slide.querySelector('.cmp-image img, .image img, img');
    if (!image) return; // image is mandatory per convention; skip empty slides

    // Image-only gallery: cell 1 is the image, cell 2 (optional text) is empty.
    cells.push([image, '']);
  });

  // Empty-block guard: no slides with images found.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-adventure', cells });
  element.replaceWith(block);
}
