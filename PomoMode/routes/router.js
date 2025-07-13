import express from "express"
import User from "../models/user.js"
import jwt from "jsonwebtoken"
import bcrypt, { compare } from "bcryptjs"
import path from "path"
import { SECRET_KEY,sendResetEmail} from "../controllers/config.js"
import { fileURLToPath } from "url";
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const generateToken = (userId) =>{
    return jwt.sign({userId},SECRET_KEY,{expiresIn:"1d"})
}

const router = express.Router()
////////////////////////Roooootttttttt/////////////////////////////////////

router.get("/",(req,res)=>{
    res.status(200).sendFile(path.join(__dirname, '../Frontend/index.html'))

    console.log("In root")
})

////////////////////////Registerrrrrr////////////////////////////////////////

router.get('/register',async(req,res)=>{
    res.sendFile(path.join(__dirname, '../Frontend/signup.html'))
})
router.post('/register',async (req,res)=>{
    try{
        const {email,username,password} = req.body
        console.log(email,username,password)
        const existingemail = await User.findOne({email})

        if(existingemail){
            return res.status(400).json({message:"Email already exists ra pumks"})

        }
        const existinguser = await User.findOne({username})
        if(existinguser){
            return res.status(400).json({message:"Username already exists"})

        }
        //creating the user
        const profileImage = `https://api.dicebear.com/9.x/open-peeps/svg?seed=${username}`
        const user = new User({
            email,
            username,
            password,
            profileImage,
        })
        
        await user.save()
        console.log("user creted")  
        const token = generateToken(user._id)
        res.status(201).json({
            token,
            _id:user._id,
            username: user.username,
            email:user.email,
            profileImage: user.profileImage,
        })
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
})

////////////////////////Looogiinnnnnnn///////////////////////////////////////
router.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname, '../Frontend/login.html'))
})

router.post('/login',async(req,res)=>{
    const {email,password} = req.body
    try{

            const existinguser = await User.findOne({email})
            console.log(existinguser.email,existinguser.username)
            if(!existinguser){
                return res.status(410).json({message:"User does not exist"})
            }   
            const isMatch =  bcrypt.compare(password, existinguser.password);
            if (!isMatch)
            {
                return res.status(401).json({ message: "Incorrect password" });
            }
            console.log("User verification success!")
            const token = generateToken(existinguser._id)
            res.status(201).json({
                token,
                _id:existinguser._id,
                username: existinguser.username,
                email:existinguser.email,
                profileImage: existinguser.profileImage,
            })        
        }

    
    catch(err){

        res.status(500).json({message:"Internal Server Errir"})
        console.log(err)
    }
})
///////////////////////////////Password changeeee//////////////////////////////////////

router.get('/forgotpassword',(req,res) =>{
    res.sendFile(path.join(__dirname, '../Frontend/resetpassword.html'))
})
router.post('/forgotpassword', async (req,res) =>{
    const {email} =  req.body
    console.log("RESet pass Post",email)    
    try{

            const existinguser = await User.findOne({email})
            const token = existinguser.resetkey; // generate a random token
            const body = `
                <h2>Password Reset</h2>
                <p>Your reset token is: <strong>${token}</strong></p>
            `;
            if(!existinguser){
                console.log("email doesnot exist ")                
                return res.status(410).json({message:"User does not exist"})

            }   

            // Send the email
            try {
                await sendResetEmail(email,"Reset your Pomomode password",body);
                console.log("Email sent to", {email});
                res.status(200)
                } 
                catch (err) {
                console.error("Email failed:", err);
                res.status(500)
            }
 
        }

    
    catch(err){

        res.status(500).json({message:"Internal Server Error"})
        console.log(err)
    }



    
})
router.put('/forgotpassword',(req,res) =>{
    const pass = req.body

    //////updatethe pass... once smtp is through
})

///////////////////////////////////////////////////////////////////////////////
export default router