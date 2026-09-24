export default function decorate(block) {
  const rows = [...block.children];

  // First row containing a picture is the background image; remaining rows are the text content.
  rows.forEach((row) => {
    if (row.querySelector(':scope picture')) {
      row.classList.add('hero-teaser-image');
    } else {
      row.classList.add('hero-teaser-content');
    }
  });

  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Style the standalone CTA link as the WKND accent button. The project's
  // global decorateButtons only buttonizes links with authored bold/italic
  // formatting, but the source teaser renders "See Trip" as a solid CTA.
  const content = block.querySelector('.hero-teaser-content');
  if (content) {
    const cta = content.querySelector('p:last-child > a:only-child');
    const p = cta ? cta.closest('p') : null;
    if (cta && p && p.textContent.trim() === cta.textContent.trim()) {
      cta.className = 'button';
      cta.title = cta.title || cta.textContent;
      p.className = 'button-container';
    }
  }
}
