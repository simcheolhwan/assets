import { toUpward } from "./chartUtils"

const input = [
  { t: new Date("2021-01-01"), y: 1 },
  { t: new Date("2021-01-02"), y: 3 },
  { t: new Date("2021-01-03"), y: 2 },
  { t: new Date("2021-01-04"), y: 4 },
  { t: new Date("2021-01-05"), y: 4 },
]

const output = [
  { t: new Date("2021-01-01"), y: 1 },
  { t: new Date("2021-01-03"), y: 2 },
  { t: new Date("2021-01-04"), y: 4 },
  { t: new Date("2021-01-05"), y: 4 },
]

test("toUpward", () => {
  expect(toUpward(input)).toEqual(output)
})
