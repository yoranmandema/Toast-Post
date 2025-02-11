import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import {
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

// Implementation path:
//
// https://firebase.google.com/docs/storage/?hl=en&authuser=0&_gl=1*m2tebu*_ga*MjkzMDczNTUxLjE3MzkzMDI4NTI.*_ga_CW55HF8NVT*MTczOTMwMjg1NS4xLjEuMTczOTMwMjk2My40MC4wLjA.#implementation_path

export class FirebaseClient {
  private firebaseConfig: FirebaseOptions;
  private app: FirebaseApp;
  private storage: FirebaseStorage;

  constructor() {
    const firebaseConfig: FirebaseOptions = {
      apiKey: Deno.env.get("FIREBASE_APPKEY"),
      authDomain: "toast-post.firebaseapp.com",
      projectId: "toast-post",
      storageBucket: "toast-post.firebasestorage.app",
      messagingSenderId: "738638358414",
      appId: "1:738638358414:web:5aeb22a0102b76233366df"
    };

    this.firebaseConfig = firebaseConfig;

    const app = initializeApp(firebaseConfig);

    this.app = app;

    const storage = getStorage(app);

    this.storage = storage;
  }

  public async uploadImage(file: File) {
    if (!file) return;

    try {
      const storageRef = ref(this.storage, `uploads/${file.name}`); // Path in Firebase Storage
      const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);

      // Get the download URL after upload completes
      const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);

      return downloadURL; // Return the URL for further use
    } catch (error) {
      console.error("Upload failed:", error);
      throw error; // Handle error properly in your app
    }
  }
}

export const firebaseClient = new FirebaseClient();
