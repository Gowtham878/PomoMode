import express from "express"
import User from "../models/user.js"
import jwt from "jsonwebtoken"
import bcrypt, { compare } from "bcryptjs"
import path from "path"
import { SECRET_KEY } from "../controllers/config.js"
import { fileURLToPath } from "url";
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const generateToken = (userId) =>{
    return jwt.sign({userId},SECRET_KEY,{expiresIn:"1d"})
}

const router = express.Router()
router.get("/",(req,res)=>{
    res.status(200).sendFile(path.join(__dirname, '../Frontend/index.html'))

    console.log("In root")
})

router.get('/register',async(req,res)=>{
    res.sendFile(path.join(__dirname, '../Frontend/signup.html'))
})
router.post('/register',async (req,res)=>{
    try{
        const {email,username,password} = req.body
        console.log(email,username,password)
        res.redirect('/register')
        /*//checking if user exists
        const existingemail = await User.findOne({email})
        console.log(existingemail)
        if(existingemail){
            return res.status(400).json({message:"Email already exists"})

        }
        const existinguser = await User.findOne({username})
        if(existinguser){
            return res.status(400).json({message:"Username already exists"})

        }
        //creating the user

        //creating random profile image
        const profileImage = `https://api.dicebear.com/9.x/open-peeps/svg?seed=${username}`
        //
        const user = new User({
            email,
            username,
            password,
            profileImage,
        })
        
        await user.save()

        const token = generateToken(user._id)

        res.status(201).json({
            token,
            _id:user._id,
            username: user.username,
            email:user.email,
            profileImage: user.profileImage,
        })*/
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
})

router.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname, '../Frontend/login.html'))
})

router.post('/login',async(req,res)=>{
    const {email,password} = req.body
    console.log(email,password)
    try{

        const existinguser = await User.findOne({email})
        if(!existinguser){
            return res.status(410).json({message:"User does not exist"})
        }   
        const isMatch =  bcrypt.compare(password, existinguser.password);
        if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
            }
        }
    
    catch(err){

        res.status(500).json({message:"Internal Server Errir"})
        console.log(err)
    }
})

export default router