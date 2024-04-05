// @vitest-environment jsdom
import { assert, expect, test, it, describe } from "vitest"
import { scopeIDs } from "../utils.js"

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

describe("scopes IDs and references when singlequotes are used", () => {
  const result = scopeIDs(template("id1", "'"))
  it("replaces ID", () => {
    expect(result).not.toMatch(/id=[\"\']id1[\'\"]/g)
  })
  it("replaces ID reference", () => {
    expect(result).not.toMatch(/url\(#id1\)/g)
  })
})
describe("scopes hyphenated IDs and references", () => {
  const result = scopeIDs(template("hyphenated-id"))
  it("replaces ID", () => {
    expect(result).not.toMatch(/id=[\"\']hyphenated-id[\'\"]/g)
  })
  it("replaces ID reference", () => {
    expect(result).not.toMatch(/\url\(#hyphenated-id\)/g)
  })
})
describe("scopes underscored IDs and references", () => {
  const result = scopeIDs(template("underscored_id"))
  it("replaces ID", () => {
    expect(result).not.toMatch(/id=[\"\']underscored_id[\'\"]/g)
  })
  it("replaces ID reference", () => {
    expect(result).not.toMatch(/url\(#underscored_id\)/g)
  })
})
describe("scopes IDs and references with escaped quotes", () => {
  const result = scopeIDs(template("escaped'quotes", '"'))
  it("replaces ID", () => {
    expect(result).not.toMatch(/id=[\"\']escaped\\"quotes[\'\"]/g)
  })
  it("replaces ID reference", () => {
    expect(result).not.toMatch(/url\(#escaped\"quotes\)/g)
  })
})
describe("does not replace IDs that are reserved element/attribute names", () => {
  const result = scopeIDs(`
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="mask" mask-type="alpha">
        <circle cx="50" cy="50" r="40" fill="black"/>
      </mask>
      <g mask="url(#mask)">
        <rect width="100" height="100" fill="red"/>
      </g>
    </svg>
  `)
  it("does replace `mask` ID URL reference", () => {
    expect(result).not.toMatch(/url\(#mask\)/g)
  })
  it("does not replace `mask` element name", () => {
    expect(result).toMatch(/\<mask id=/g)
  })
  it("does not replace `mask` attribute", () => {
    expect(result).toMatch(/\<g mask=/g)
  })
  it("does replace `mask` ID", () => {
    expect(result).not.toMatch(/id=["']mask["']/g)
  })
})
describe("replaces multiple IDs when referenced in `aria-*` arrays", () => {
  const result = scopeIDs(`
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-describedby="xxxx yyyy">
      <desc id="xxxx">Lorem ipsum</desc>
      <desc id="yyyy">Lorem ipsum</desc>
    </svg>
  `)
  const resultSingleQuotes = scopeIDs(`
    <svg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg' aria-describedby='xxxx yyyy'>
      <desc id='xxxx'>Lorem ipsum</desc>
      <desc id='yyyy'>Lorem ipsum</desc>
    </svg>
  `)
  it("replaces ID references", () => {
    expect(result).not.toMatch(/xxxx yyyy/g)
  })
  it("replaces ID references in single quotes", () => {
    expect(resultSingleQuotes).not.toMatch(/xxxx yyyy/g)
  })
  it("replaces each individual ID", () => {
    expect(result).toMatch(/id=["'](xxxx\-\S+)["']/g)
    expect(result).toMatch(/id=["'](yyyy\-\S+)["']/g)
  })
  it("replaces each insdividual ID in single quotes", () => {
    expect(resultSingleQuotes).toMatch(/id=["'](xxxx\-\S+)["']/g)
    expect(resultSingleQuotes).toMatch(/id=["'](yyyy\-\S+)["']/g)
  })
})
