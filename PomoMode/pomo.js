import express from "express";
import Mongoose from "mongoose";
import cors from 'cors';
import dotenv from "dotenv";
import root from "./routes/router.js";
import { MONGO_URL } from "./controllers/config.js";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();
Mongoose.set('strictQuery', false);

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/", root);

app.use(express.static(path.join(__dirname, 'Frontend')));

Mongoose.connect(MONGO_URL)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server launched at http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error(" DB connection error:", err);
  });
