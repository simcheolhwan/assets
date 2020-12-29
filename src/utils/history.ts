import { last } from "ramda"

export const latest = <T>(history: Dictionary<T>): T => {
  const key = last(Object.keys(history).sort())
  return history[key!]
}
