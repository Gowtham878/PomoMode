import {express} from "express"
import { Mongoose } from "mongoose"
import {cors} from 'cors'
import dotenv from "dotenv"
import { MONGO_URL,  } from "./controllers/config.js"
dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());


Mongoose.connect(MONGO_URL)
    .then(()=>{
        app.listen(3000,()=>{
            console.log("Server launched at "+ 3000)
        })
    })
    .catch((err)=>{
        console.log(err)
    })