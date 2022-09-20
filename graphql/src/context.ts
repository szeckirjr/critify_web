import { FirebaseApp } from 'firebase/app';
import { Database, getDatabase } from 'firebase/database';

import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATA_BASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

export const firebaseClient = initializeApp(firebaseConfig);

export interface Context {
  firebaseClient: FirebaseApp
  db: Database
  auth: Auth
}

export const context: Context = {
  firebaseClient,
  db: getDatabase(firebaseClient),
  auth: getAuth(firebaseClient),
};
