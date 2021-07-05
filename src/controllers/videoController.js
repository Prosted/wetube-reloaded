import Video from "../models/Video";


//global Router
/* 비동기 처리방식 콜백함수
export const home = (req, res) => {
    Video.find({},  (error, videos) => {
        //에러가 발생했는지 여부를 조건문으로 확인
        if(error)
            return res.render("server-error");
        else
           return res.render("home", {pageTitle : "Home", videos}); //render은 2가지 인수를 받는데, 첫번째는 view의 이름이고 두번째는 템플릿에 보낼 오브젝트다. 오브젝트 안 변수는 원하는 만큼 보낼 수 있다.
    });
} 
*/

//동기처리방식 async & await
export const home = async(req, res) => { 
    const videos = await Video.find({});
    return res.render("home", {pageTitle : "Home", videos});
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
