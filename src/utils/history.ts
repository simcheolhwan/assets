import { subDays } from "date-fns"
import { last } from "ramda"
import { formatDate } from "../utils/format"

export const yesterday = formatDate(subDays(new Date(), 1))

export const prev = <T>(history: Dictionary<T>): T => {
  const key = last(Object.keys(history).sort())
  return history[key!]
}
