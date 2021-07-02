import Video from "../models/Video";


//global Router
export const home = (req, res) => {
    console.log("Starting search");
    Video.find({},  (error, videos) => {
        console.log("seraching");
        console.log("errors", error);
        console.log("videos", videos);
    });
    console.log("Im the last");
    res.render("home", {pageTitle : "Home", videos : []}); //render은 2가지 인수를 받는데, 첫번째는 view의 이름이고 두번째는 템플릿에 보낼 오브젝트다. 오브젝트 안 변수는 원하는 만큼 보낼 수 있다.
} 


//video Router

export const watch = (req, res) => {
    const {id} = req.params;
    const video = videos[id-1];
    return res.render("watch", {pageTitle : `watch`});
};
export const getEdit = (req, res) => {
    const {id} = req.params;
    const video = videos[id-1];
    res.render("edit", {pageTitle : `Editing`});
};

export const postEdit = (req, res) => {
    const {id} = req.params;
    const {title} =req.body;
    res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    res.render("upload", {pageTitle : "Upload"});
}

export const postUpload = (req, res) => {
    const {title} = req.body;
    res.redirect("/");

}
