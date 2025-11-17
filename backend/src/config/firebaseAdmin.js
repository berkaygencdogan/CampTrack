import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname üret
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serviceAccountKey.json tam yolu
const serviceAccountPath = path.join(__dirname, "../../serviceAccountKey.json");

// JSON dosyasını oku
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Firebase Admin başlat
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
export default admin;
