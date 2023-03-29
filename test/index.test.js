import { assert, expect, test, it, describe } from "vitest"
import { uniquifyIDs } from "../utils.js"

// Edit an assertion and save to see HMR in action

const template = (id, quote = '"') => `
<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <mask id=${quote}${id}${quote} mask-type="alpha">
    <circle cx="50" cy="50" r="40" fill="black"/>
  </mask>
  <g mask="url(#${id})">
    <rect width="100" height="100" fill="red"/>
  </g>
</svg>
`

describe("uniquifyIDs", () => {
  it("scopes IDs and references when singlequotes are used", () => {
    const result = uniquifyIDs(template("id1", "'"))
    expect(result).not.toMatch(/#id1/g)
    expect(result).not.toMatch(/id=["']id1['"]/g)
  })
  it("scopes hyphenated IDs and references", () => {
    const result = uniquifyIDs(template("hyphenated-id"))
    expect(result).not.toMatch(/#hyphenated-id/g)
    expect(result).not.toMatch(/id=["']hyphenated-id['"]/g)
  })
  it("scopes underscored IDs and references", () => {
    const result = uniquifyIDs(template("underscored_id"))
    expect(result).not.toMatch(/#underscored_id/g)
    expect(result).not.toMatch(/id=["']underscored_id['"]/g)
  })
  it("scopes IDs and references with escaped quotes", () => {
    const result = uniquifyIDs(template('escaped"quotes', '"'))
    expect(result).not.toMatch(/#escaped\"quotes/g)
    expect(result).not.toMatch(/id=["']escaped\"quotes['"]/g)
  })
  it("does not replace IDs used as reserved element names", () => {
    const result = uniquifyIDs(`
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="mask" mask-type="alpha">
          <circle cx="50" cy="50" r="40" fill="black"/>
        </mask>
        <g mask="url(#mask)">
          <rect width="100" height="100" fill="red"/>
        </g>
      </svg>
    `)
    expect(result).not.toMatch(/#mask/g)
    expect(result).toMatch(/\<mask id=/g)
    expect(result).not.toMatch(/id=["']mask["']/g)
  })
  it("replaces IDs in `url()`s, `aria-*` references", () => {
    const result = uniquifyIDs(`
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        
      </svg>
    `)
    expect(result).not.toMatch(/#xxxx/g)
    expect(result).not.toMatch(/id=["']xxxx["']/g)
  })
})
