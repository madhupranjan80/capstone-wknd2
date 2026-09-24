export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-featured-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-featured-img-col');
        }
      }
    });
  });

  // buttonize the CTA link (source renders it as a solid yellow "Full Article" button).
  // Core decorateButtons only styles links wrapped in <strong>/<em>, which the
  // authored plain link is not, so promote it here to reuse the global a.button styles.
  block.querySelectorAll('p > a[href]').forEach((a) => {
    const p = a.closest('p');
    if (p && p.textContent.trim() === a.textContent.trim() && !a.querySelector('img')) {
      a.classList.add('button');
      p.classList.add('button-container');
    }
  });
}
