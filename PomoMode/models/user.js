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
    resetkey:{
        type:String,
    },
    profileImage:{
        type:String,
        require:true,
        unique:true
    }   
},{timestamps:true})

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)
        this.resetkey = await bcrypt.hash(this.username, salt)
        console.log("Password has been encrypted");
        next();
    } catch (error) {
        console.log(error);
    }
})

export default mongoose.models.User || mongoose.model("User", userSchema);
