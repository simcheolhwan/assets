import { last } from "ramda"

export const prev = <T>(history: Dictionary<T>): T => {
  const key = last(Object.keys(history).sort())
  return history[key!]
}
