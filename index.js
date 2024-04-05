import { fetchFromCache, scopeIDs } from "./utils.js"

/**
 * @name InlineSVG
 * @description A custom element that inlines SVG artwork
 *   into the page for DOM manipulation and CSS inheritance.
 *   Automatically makes IDs unique to prevent collisions with
 *   other inline SVGs or HTML elements on the same page.
 */
export default class InlineSVG extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
    const scopedIDs =
      this.attributes["scoped"]?.value === "false" ? false : true

    this.setAttribute("data-loading", true)

    fetchFromCache(this.attributes.src.value).then((data) => {
      // store this in case we need to re-render with different options
      this.rawData = data

      if (scopedIDs) {
        data = scopeIDs(data)
      }

      // add svg to HTML
      this.innerHTML = data

      this.setAttribute("data-loading", false)
    })
  }
}
