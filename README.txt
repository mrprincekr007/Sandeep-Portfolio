SANDEEP PERSONAL PORTFOLIO

"A small archive of ordinary days" — a warm editorial portfolio built around
Sandeep's photos, everyday moments and the little things that make a person.

FILES
- index.html   Main website
- style.css    Layout, responsive design and motion
- script.js    Interactions and scroll behaviour
- photos/      The 7 original photos supplied for this project

HOW TO OPEN
1. Extract the ZIP.
2. Open index.html in a browser.

HOW TO EDIT
- Change text and headings in index.html.
- Change colours, spacing and layout in style.css.
- Instagram URL is currently set to:
  https://www.instagram.com/sandip_kumar___02/
- Replace images in photos/ while keeping the same filenames, or update their
  paths in index.html.
- Story frames live in the four .story__chapter articles. Each one has
  data-image, data-caption and data-index attributes used by the sticky story.
- Gallery items use .shot links with data-full and .shot__cap captions.

DESIGN
- Warm paper, deep ink and burnt orange.
- Instrument Serif for display type, Manrope for body copy, Caveat for notes.
- Sections: hero, ticker, about, sticky photo story, interests, gallery, contact.
- No npm install, build step, backend, database or extra libraries.

INTERACTIONS
- Branded intro loader, staggered hero entrance and slow ticker.
- Scroll progress line and active navigation highlighting.
- Blur-to-sharp scroll reveals and word-by-word split headings.
- Sticky photo story: the frame follows the chapters, swaps images with a
  preload, and releases at the end of the section.
- Gallery lightbox with captions, next/previous controls, arrow keys and Escape.
- Mobile menu with outside-click and Escape closing.
- Desktop-only custom cursor with contextual labels.
- Interests images appear on hover on devices that support hover.

ACCESSIBILITY & FALLBACKS
- Skip-to-content link, visible focus states and semantic headings.
- All gallery links still open the full photo if JavaScript is unavailable.
- A <noscript> layer keeps the hero, nav, reveals and story chapters readable
  without JavaScript.
- prefers-reduced-motion disables the loader, ticker, cursor, entrance and
  reveal animations while keeping all content visible.
- Images below the hero use lazy loading; the first hero photo is preloaded.

DEPLOY NOTES
- This is a static site: upload the folder to any static host.
- Google Fonts are loaded from fonts.googleapis.com. Replace the font link in
  index.html if you need a fully offline build.
- og:image and the JSON-LD image use relative paths. Change them to absolute
  URLs after deploying so social previews resolve correctly.
