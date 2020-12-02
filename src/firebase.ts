import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "assets-production.firebaseapp.com",
  projectId: "assets-production",
  appId: "1:268103117736:web:fca1022dd5abfadee6cb9d",
}

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const db = firebase.database()
