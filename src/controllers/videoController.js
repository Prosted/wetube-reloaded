import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";


//root Router
export const home = async (req, res) => {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");
    return res.render("home", { pageTitle: "Home", videos });
  };

export const search = async(req, res) =>{
    const {keyword} = req.query;
    let videos = [];
    if(keyword){
        videos = await Video.find({title : {$regex:new RegExp(`^${keyword}$`,"i")}}).populate("owner");
    }
    return res.render("search", {pageTitle : "Search", videos});
}

//video Router
export const watch = async(req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id).populate("owner").populate("comments").populate("owner");
    if(!video)
        return res.render("error", {pageTitle:"Video not Found"});
    return res.render("watch", {pageTitle : `watch ${video.title}`, video});
};

export const getEdit = async(req, res) => {
    const {id} = req.params;
    const {
        session :{
            user : {_id},
        }
    }=req;
    const video = await Video.findById(id);
    if(!video)
        return res.status(404).render("error", {pageTitle:"Video not Found"});  
    if(String(video.owner)!==String(_id)){
        req.flash("error", "You are not video's owner");
        return res.status(403).redirect("/");
    }
    res.render("edit", {pageTitle : `Editing ${video.title}`, video});
};

export const postEdit = async(req, res) => {
    const {id} = req.params;
    const {
        session :{
            user : {_id},
        }
    }=req;
    const video = await Video.findById(id);
    const {title, description, hashtags} = req.body;
    if(!video){
        return res.status(404).render("error", {pageTitle:"Video not Found"});
    }
    if(String(video.owner)!==String(_id)){
        req.flash("error", "You are not video's owner");
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags : Video.formatHashtags(hashtags),
    });
    res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    res.render("upload", {pageTitle : "Upload"});
}

export const postUpload = async(req, res) => {
    const {
        user : {_id},
    } = req.session;
    const {video, thumb} = req.files;
    const {title, description, hashtags} = req.body;
    try{
        const newVideo = await Video.create({
            owner : _id,
            title,
            fileUrl : video[0].path,
            thumbUrl : thumb[0].path,
            description,
            hashtags: Video.formatHashtags(hashtags),
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        await user.save();
        req.flash("success", "video is successfully upload");
        return res.redirect("/");
    }catch(error){
        return res.status(400).render("upload", {pageTitle: "upload", errorMessage : error._message});
    }
}

export const deleteVideo = async(req, res) =>{
    const {id} = req.params;
    const {
        session : {
            user : {_id},
        }
    }=req;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("error", {pageTitle:"Video not Found"});
    }
    if(String(video.owner)!==String(_id)){
        req.flash("error", "You are not video's owner");
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    req.flash("success", "video is successfully delete");
    return res.redirect("/");
}

export const registerView = async (req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    video.meta.views+=1;
    await video.save();
    return res.sendStatus(200);
} 

export const createComment = async (req, res) => {
    const {
        body : {text},
        params : {id},
        session : {user}
    } =req;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    const newComment = await Comment.create({
        text,
        createdAt : new Date(),
        video : id,
        owner : user._id,
    });
    video.comments.push(newComment._id);
    await video.save();
    const owner = await User.findById(user._id);
    owner.comments.push(newComment._id);
    await owner.save();
    return res.sendStatus(201).json({newCommentId : newComment._id});
}

const deleteCommentId = async (obj, id) => {
    const arr = obj.comments
    for(let i = 0; i<arr.length; i++){
        if(arr[i] == id){
            arr.splice(i, 1);
            break;
        }
    }
    await obj.save();
}


export const deleteComment = async (req, res) => {
    const {id} =req.body;
    const comment = await Comment.findByIdAndDelete(id);
    console.log(comment);
    const {video, owner} = comment;
    const videoObject = await Video.findById(video); 
    const ownerObject = await User.findById(owner);
    await deleteCommentId(videoObject, id);
    await deleteCommentId(ownerObject, id);
    return res.sendStatus(201);
}