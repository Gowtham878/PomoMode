import dotenv from "dotenv"
dotenv.config()


const SECRET_KEY = process.env.SECRET_KEY
const ALGORITHM = process.env.ALGORITHIM
const EXPIRE_COUTDOWN = process.env.ACCESS_TOKEN_EXPIRE_MINUTES

const MONGO_USER = process.env.MONGO_USER
const MONGO_PASS = process.env.MONGO_PASS
const MONGO_CLUSTER = process.env.MONGO_CLUSTER
const DB_NAME = process.env.DB_NAME

const MONGO_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`;

export {
    SECRET_KEY,
    ALGORITHM,
    EXPIRE_COUTDOWN,
    MONGO_URL
}