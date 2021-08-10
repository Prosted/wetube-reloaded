import mongoose from "mongoose";

const commentShema = new mongoose.Schema({
    text : {type:String, required:true},
    createdAt : {type:Date, required : true},
    owner : {type : mongoose.Schema.Types.ObjectId, ref : "User"},
    video : {type : mongoose.Schema.Types.ObjectId, ref: "Video"}
});

const Comment=mongoose.model("Comment", commentShema);

export default Comment;