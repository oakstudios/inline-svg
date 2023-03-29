import { fetchFromCache, uniquifyIDs } from './utils.js';

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
      data = this.uniquifyIDs(data);

      // add svg to HTML
      this.innerHTML = data;
    });
  }
}
