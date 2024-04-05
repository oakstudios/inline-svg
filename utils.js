let svgCache = {}

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
export const fetchFromCache = (url) => {
  if (!svgCache[url]) {
    svgCache[url] = fetch(url).then((data) => data.text())
  }

  return svgCache[url]
}

export const scopeIDs = (data) => {
  /** match IDs and convert to array */
  const regex = /id=["'](\S+)["']/gi
  const IDs = [...data.matchAll(regex)].map((match) => match[1])

  /** replace each id and its references */
  IDs.forEach((id) => {
    /** add a uuid to the id */
    const newID = `${id}-${crypto.randomUUID()}`

    /**
     * referring to https://www.w3.org/TR/wai-aria/#typemapping,
     * there are a few attributes that can contain an "ID reference list"
     */
    const idReferenceAttributes = ["id", "aria-activedescendant", "aria-errormessage"]
    idReferenceAttributes.forEach((attribute) => {
      const regex = new RegExp(`${attribute}=["']${id}["']`, "g")
      data = data.replaceAll(regex, `${attribute}="${newID}"`)
    })
    const idReferenceListAttributes = ["aria-controls", "aria-describedby", "aria-details", "aria-flowto", "aria-labeledby", "aria-owns"]
    idReferenceListAttributes.forEach((attribute) => {
      /**
       * in id reference list (space-separated (\S+) blocks), only modify the current `id` and leave the rest of the id reference list alone.
       * assume that the current `id` may appear anywhere in the space-separated list
       * example: `aria-describedby="xxxx yyyy"` becomes `aria-describedby="xxxx-234234 yyyy-234234"`
       */
      const regex = new RegExp(`${attribute}=["'](\ *((${id})|(\S+))\ *)*["']`, "g")
      data = data.replaceAll(regex, (match) => {
        return match
          .split(" ")
          .map((str) => (str === id ? `${newID}` : str))
          .join(" ")
      })
    })

    /** replace url-based ID references */
    data = data.replaceAll(`url(#${id})`, `url(#${newID})`)
  })
  return data
}
