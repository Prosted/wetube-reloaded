import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email : {type : String, required : true, unique: true},
    avatarUrl : {type:String},
    userName : {type : String, required : true, unique: true},
    socialOnly : {type:Boolean, default:false},
    password : {type : String},
    name : {type : String, required : true},
    location : String,
});

userSchema.pre('save', async function(){
    this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);

export default User;