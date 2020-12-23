import { subDays } from "date-fns"
import { last } from "ramda"
import { formatDate } from "../utils/format"

export const today = formatDate()
export const yesterday = formatDate(subDays(new Date(), 1))

export const latest = <T>(history: Dictionary<T>): T => {
  const key = last(Object.keys(history).sort())
  return history[key!]
}
