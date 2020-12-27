import { useEffect } from "react"
import { atom, useSetRecoilState } from "recoil"
import { auth } from "../firebase"

const email = process.env.REACT_APP_EMAIL!

interface AuthState {
  state: "idle" | "loading" | "done"
  contents: boolean
}

export const authState = atom<AuthState>({
  key: "auth",
  default: { state: "idle", contents: false },
})

const useAuth = () => {
  const setAuth = useSetRecoilState(authState)

  useEffect(() => {
    setAuth({ state: "loading", contents: false })

    auth.onAuthStateChanged((user) =>
      setAuth(
        user
          ? { state: "done", contents: true }
          : { state: "idle", contents: false }
      )
    )
  }, [setAuth])

  const signIn = async ({ password }: { password: string }) => {
    try {
      setAuth({ state: "loading", contents: false })
      await auth.signInWithEmailAndPassword(email, password)
      setAuth({ state: "done", contents: true })
    } catch (error) {
      alert(error.message)
      setAuth({ state: "idle", contents: false })
    }
  }

  return signIn
}

export default useAuth
