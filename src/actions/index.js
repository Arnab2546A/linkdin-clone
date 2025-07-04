import { auth, provider } from '../firebaseConfig.js';
import { signInWithPopup } from "firebase/auth";
import { SET_USER } from "./actionType.js";
import { storage } from '../firebaseConfig.js';
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
export function postArticleAPI(payload){
  return (dispatch)=>{
    if(payload.image!==""){
      const upload= storage.ref(`images/${payload.image.name}`)
      .put(payload.image);
      upload.on("state_changed",(snapshot)=>{
        const progress=((snapshot.bytesTransferred/snapshot.totalBytes)*100);
        console.log(`Progress: ${progress}%`);
        if(snapshot.state==="RUNNING"){
          console.log(`Progress: ${progress}%`);
        }
      },(error)=>
        console.log(error),
      async()=>{
        const downloadURL=await upload.snapshot.ref.getDownloadURL();
        db.collection("articles").add({
          actor: {
            description: payload.user.email,
            title: payload.user.displayName,
            date: payload.timestamp,
            image: payload.user.photoURL,
          },
          video: payload.video || "",
          sharedImg: downloadURL,
          comments: 0,
          description: payload.description,
          likes: 0,
        })
      }
    )
      
    }
  }
}