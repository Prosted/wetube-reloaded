import User from "../models/User";
import Video from "../models/Video";


//root Router
export const home = async(req, res) => { 
    const videos = await Video.find({}).sort({createdAt : "desc"});
    return res.render("home", {pageTitle : "Home", videos});
}

export const search = async(req, res) =>{
    const {keyword} = req.query;
    let videos = [];
    if(keyword){
        videos = await Video.find({title : {$regex:new RegExp(`^${keyword}$`,"i")}});
    }
    return res.render("search", {pageTitle : "Search", videos});
}

//video Router
export const watch = async(req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id).populate("owner");
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
    const {path:fileUrl} = req.file;
    const {title, description, hashtags} = req.body;
    try{
        const newVideo = await Video.create({
            owner : _id,
            title,
            fileUrl,
            description,
            hashtags: Video.formatHashtags(hashtags),
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        await user.save();
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
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
}
