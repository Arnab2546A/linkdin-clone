import { auth, provider } from '../firebaseConfig.js';
import { signInWithPopup } from "firebase/auth";
import { SET_USER } from "./actionType.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import db from '../firebaseConfig.js';

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload
});

export function signInAPI() {
  return (dispatch) => {
    signInWithPopup(auth, provider)
      .then((payload) => {
        const user = payload.user;
        dispatch(setUser({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
        }));
      })
      .catch((error) => {
        alert(error.message);
      });
  };
}

export function getUserAuth(){
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setUser({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
        }));
      } else {
        dispatch(setUser(null));
      }
    });
  };
}

export function signOutAPI() {
  return (dispatch) => {
    auth.signOut()
      .then(() => {
        dispatch(setUser(null));
      })
      .catch((error) => {
        alert(error.message);
      });
  };
}

// Add this function to your actions/index.js
export function postArticleAPI(payload) {
  return (dispatch) => {
    // If you're not using this function anymore, you can leave it as an empty function
    // or implement it if needed for post creation
    console.log("Post article API called with payload:", payload);
  };
}