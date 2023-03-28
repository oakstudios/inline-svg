import { assert, expect, test } from 'vitest'
import { uniquifyIDs } from '../utils.js'

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

test('uniquifyIDs', () => {
  expect(uniquifyIDs(template("hyphenated-id"))).not.toMatch(/hyphenated-id/g)
  expect(uniquifyIDs(template("underscored_id"))).not.toMatch(/underscored_id/g)
  expect(uniquifyIDs(template("escaped\"quotes", "\""))).not.toMatch(/escaped\"quotes/g)
})
