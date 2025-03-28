// functions/src/index.ts
import * as functions from 'firebase-functions';

// Enkel "Hello world" funksjon
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase Cloud Functions!");
});