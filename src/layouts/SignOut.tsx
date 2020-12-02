import { useEffect } from "react"
import { useHistory } from "react-router-dom"
import { auth } from "../firebase"

const SignOut = () => {
  const { replace } = useHistory()

  useEffect(() => {
    const signOut = async () => {
      await auth.signOut()
      replace("/")
    }

    signOut()
  }, [replace])

  return null
}

export default SignOut
