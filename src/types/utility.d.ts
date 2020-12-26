interface Dictionary<A> {
  [index: string]: A
}

type State = "loading" | "hasValue" | "hydrated"
interface Loadable<T> {
  state: State
  contents: T
}
