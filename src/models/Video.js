import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title : String,
    description : String,
    createdAt : Date,
    hashtag:[{type : String}], //문자열 배열 타입
    meta : {
        views : Number,
        ratin : Number,
    }
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
