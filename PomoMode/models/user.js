import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true
    },

    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        minLength:8
    },
    username:{
        type:String,
        require:true,
        unique:true
    }   
},{timestamps:true})

userSchema.pre("save", async function(next) {
    try {
        if (!this.isModified("password")) return next();

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        console.log("Password has been encrypted");
        next();
    } catch (error) {
        console.log(error);
    }
})

const User = mongoose.model("User",userSchema)

export default User