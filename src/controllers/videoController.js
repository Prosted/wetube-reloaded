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
export const home = async(req, res) => { //await를 쓰기 위해 async를 쓰기로 규칙이 되어있다.
    try{ //콜백과 다르게 에러를 알아보기 힘들기 때문에 에러처리를 위해 try catch를 사용한다.
        const videos = await Video.find({}); //find함수가 다 처리 되기 전 까지 자바스크립트가 아래 코드를 실행하지 않고 기다려줌
        res.render("home", {pageTitle : "Home", videos});
    }catch(error){
        return res.render("server-error");
    }
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
