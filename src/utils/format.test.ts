import { formatKorean } from "./format"

test.each`
  number        | expected
  ${1e5}        | ${"0"}
  ${1.1 * 1e5}  | ${"0"}
  ${5 * 1e5}    | ${"0"}
  ${0.99 * 1e6} | ${"1백"}
  ${1e6}        | ${"1백"}
  ${1.1 * 1e6}  | ${"1백"}
  ${5 * 1e6}    | ${"5백"}
  ${0.99 * 1e7} | ${"1천"}
  ${1e7}        | ${"1천"}
  ${1.1 * 1e7}  | ${"1천"}
  ${5 * 1e7}    | ${"5천"}
  ${0.99 * 1e8} | ${"1억"}
  ${1e8}        | ${"1억"}
  ${1.1 * 1e8}  | ${"1억"}
  ${5 * 1e8}    | ${"5억"}
  ${0.99 * 1e9} | ${"10억"}
`("$number => $expected", ({ number, expected }) => {
  expect(formatKorean(number)).toBe(expected)
})
