import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title : {type : String, required : true, trim : true, uppercase : true, minLength : 5, maxLength : 20},
    description : {type : String, required : true, minLength : 20, maxLength : 140},
    createdAt : {type:Date, required : true, default : Date.now},
    hashtags:[{type : String}], //문자열 배열 타입
    meta : {
        views : {type : Number, required : true, default : 0},
        rating : {type : Number, required : true, default : 0},
    }
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
