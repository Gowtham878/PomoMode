import express from "express"
import  Mongoose  from "mongoose"
import cors from 'cors'
import dotenv from "dotenv"
import root from "./routes/router.js"
import { MONGO_URL  } from "./controllers/config.js"
import { fileURLToPath } from "url";
import path from "path"


dotenv.config()
Mongoose.set('strictQuery', false)



const app = express();
app.set("view engine", "ejs");

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend folder
app.use(express.static(path.join(__dirname, 'Frontend')));

app.use("/",root)

Mongoose.connect(MONGO_URL)
    .then(()=>{
        app.listen(3000,()=>{
            console.log("Server launched at "+ 3000)
        })
    })
    .catch((err)=>{
        console.log(err,"/n",MONGO_URL
        )
    })