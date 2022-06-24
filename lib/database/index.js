import config from "config";
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue, FieldPath } from 'firebase-admin/firestore';

const serviceAccount = config.get("Firestore");

initializeApp({
  credential: cert(serviceAccount)
});

const firestore = getFirestore();
firestore.settings({ ignoreUndefinedProperties: true });

export { firestore, FieldValue, FieldPath };