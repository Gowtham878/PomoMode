import dotenv from "dotenv"
import nodemailer from 'nodemailer'
dotenv.config()


const SECRET_KEY = process.env.SECRET_KEY
const ALGORITHM = process.env.ALGORITHIM
const EXPIRE_COUTDOWN = process.env.ACCESS_TOKEN_EXPIRE_MINUTES
const GMAIL = process.env.Mail
const PASSWORD = process.env.M_pass
const MONGO_USER = process.env.MONGO_USER
const MONGO_PASS = process.env.MONGO_PASS
const MONGO_CLUSTER = process.env.MONGO_CLUSTER
const DB_NAME = process.env.DB_NAME
console.log(GMAIL,PASSWORD)


const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: GMAIL,          
    pass: PASSWORD,      
  },
});

const sendResetEmail = async (to, subject, htmlContent) => {
  try {
    console.log(to)
    const info = await transporter.sendMail({
        from: `"PomoMode Support" ${GMAIL}`,
        to,
        subject,
        html: htmlContent,
    });
    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Email failed:", err);
    throw err;
  }
};
const MONGO_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`;

export {
    SECRET_KEY,
    ALGORITHM,
    EXPIRE_COUTDOWN,
    MONGO_URL,
    transporter,
    sendResetEmail,

}