let svgCache = {};

/**
 * @name fetchFromCache
 * @returns {Promise} a shared promise across requests for this resource.
 * @description HTML `fetch` only goes so far to cache responses.
 *   This utility prevents fetch requests on the same page session
 *   (and especially those requested in close proximity)
 *   from pinging the server multiple times by storing
 *   a cache dictionary in the module scope.
 *   Also runs response.text() before returning.
 */
const fetchFromCache = (url) => {
  if (!svgCache[url]) {
    svgCache[url] = fetch(url).then((data) => data.text());
  }

  return svgCache[url];
};

/**
 * @name InlineSVG
 * @description A custom element that inlines SVG artwork
 *   into the page for DOM manipulation and CSS inheritance.
 *   Automatically makes IDs unique to prevent collisions with
 *   other inline SVGs or HTML elements on the same page.
 */
export default class InlineSVG extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    fetchFromCache(this.attributes.src.value).then((data) => {
      // match IDs and convert to array
      const IDs = [...data.matchAll(/id=["']([a-zA-Z0-9_]*)["']/gi)].map(
        (match) => match[1]
      );
      // replace each id and its references
      IDs.forEach((id) => {
        // add a fancy lil random alphanumeric string to the end of the id
        const newID = `${id}-${Math.random().toString(36).slice(2)}`;
        // this replaces the id *and* its references, regardless of where they appear
        data = data.replaceAll(id, newID);
      });

      // add svg to HTML
      this.innerHTML = data;
    });
  }
}

customElements.define("inline-svg", InlineSVG);
