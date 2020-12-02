interface Dictionary<A> {
  [index: string]: A
}

interface Loadable<T> {
  state: State
  contents: T
}
