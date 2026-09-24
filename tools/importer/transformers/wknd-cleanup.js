/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND site-wide cleanup.
 * Removes non-authorable site chrome (header, footer, mobile nav, tracking iframe)
 * and stray inline elements. All selectors verified against migration-work/cleaned.html.
 *
 * Adventure detail pages add page-level chrome that is also non-authorable:
 *   - breadcrumb nav (site-generated navigation, not authored per-page)
 *   - "Share this Adventure" title + social share widget (Facebook/Pinterest)
 * These are removed here so the import contains only authorable content.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Non-authorable global chrome that could interfere with block parsing.
    // Verified in cleaned.html:
    //   header.experiencefragment.cmp-experiencefragment--header (line 5)
    //   #toggleNav (line 568), #mobileNav (line 574) - mobile nav trigger + drawer
    //   iframe#destination_publishing_iframe_wkndsite_0 - Adobe demdex ID-sync (line 566)
    WebImporter.DOMUtils.remove(element, [
      'header.cmp-experiencefragment--header',
      '#toggleNav',
      '#mobileNav',
      '#destination_publishing_iframe_wkndsite_0',
    ]);
  }

  if (hookName === H.after) {
    // Remaining non-authorable chrome + leftover elements after block parsing.
    // Verified in cleaned.html:
    //   footer.experiencefragment.cmp-experiencefragment--footer (line 471)
    //   stray empty <meta> tags nested inside cmp-image blocks (lines 183, 204, 227, 271, 334, 378)
    //   iframe / noscript safety nets
    WebImporter.DOMUtils.remove(element, [
      'footer.cmp-experiencefragment--footer',
      'meta',
      'iframe',
      'noscript',
    ]);

    // Adventure-page chrome. Verified in cleaned.html:
    //   breadcrumb nav (line 165): div.breadcrumb.cmp-breadcrumb--fixed / nav.cmp-breadcrumb
    //   social share widget (line 270): div.sharing (fb-share-button + pinterest anchor)
    //   share heading (line 265): div.title wrapping <h5>Share this Adventure</h5>,
    //     the immediate previous sibling of div.sharing (no stable class of its own,
    //     so anchored by relationship rather than a guessed selector).
    // Remove the "Share this Adventure" heading first, while div.sharing still
    // exists as its anchor (the <h5> title wrapper has no stable class of its own,
    // so it is located as the immediate previous sibling of the share widget).
    element.querySelectorAll('div.sharing').forEach((sharing) => {
      const prev = sharing.previousElementSibling;
      if (prev && prev.classList.contains('title')) prev.remove();
    });
    WebImporter.DOMUtils.remove(element, [
      'div.breadcrumb.cmp-breadcrumb--fixed',
      'div.sharing',
    ]);
  }
}
