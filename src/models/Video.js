import mongoose from "mongoose";
/* // 아래 static 대신 쓸 수 있는 방법 그냥 함수를 만들어서 써버리는 방법임.
export const formatVideo = (hashtags) => {
    console.log(hashtags);
    //인덱스를 쓰는 이유는 mongoose가 자동으로 인자로 받은 hashtags를 배열로 바꿔줬기 때문.
    return hashtags[0].split(",").map(word => (word.startsWith("#") ? word : `#${word}`));
}
*/

const videoSchema = new mongoose.Schema({
    title : {type : String, required : true, trim : true, uppercase : true},
    fileUrl : {type:String, required:true},
    description : {type : String, required : true},
    createdAt : {type:Date, required : true, default : Date.now},
    hashtags:[{type : String}], //문자열 배열 타입
    meta : {
        views : {type : Number, required : true, default : 0},
        rating : {type : Number, required : true, default : 0},
    },
    owner : {type:mongoose.Schema.Types.ObjectId, required:true, ref:"User"},
});

videoSchema.static('formatHashtags', function(hashtags){
    return hashtags.split(",").map(word => (word.startsWith("#") ? word : `#${word}`));
})


const Video = mongoose.model("Video", videoSchema);
export default Video;
