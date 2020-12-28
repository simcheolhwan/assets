import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
}

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const db = firebase.database()
