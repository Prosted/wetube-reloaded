import Video from "../models/Video";


//global Router
export const home = async(req, res) => { 
    const videos = await Video.find({}).sort({createdAt : "desc"});
    return res.render("home", {pageTitle : "Home", videos});
}

export const search = (req, res) =>{
    const {keyword} = req.query;
    console.log(keyword);
    if(keyword){
    }
    return res.render("search", {pageTitle : "Search"});
}

//video Router

export const watch = async(req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video)
        return res.render("404", {pageTitle:"Video not Found"});
    return res.render("watch", {pageTitle : `watch ${video.title}`, video});
};
export const getEdit = async(req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video)
        res.render("404", {pageTitle:"Video not Found"});  
    res.render("edit", {pageTitle : `Editing ${video.title}`, video});
};

export const postEdit = async(req, res) => {
    const {id} = req.params;
    const video = await Video.exists({_id:id});
    const {title, description, hashtags} = req.body;
    if(!video){
        return res.render("404", {pageTitle:"Video not Found"});
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
    const {title, description, hashtags} = req.body;
    try{
        await Video.create({
            title,
            description,
            hashtags: Video.formatHashtags(hashtags),
        });
        return res.redirect("/");
    }catch(error){
        return res.render("upload", {pageTitle: "upload", errorMessage : error._message});
    }
}

export const deleteVideo = async(req, res) =>{
    const {id} = req.params;
    await Video.findByIdAndDelete(id);
    res.redirect("/");

}
