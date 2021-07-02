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
    return res.render("home", {pageTitle : "Home", videos : []});
} //render, redirect같은 함수들은 호출 후 다른 함수 호출을 허용하지 않는다. 예를 들어 render함수 밑에 redirect함수를 적었다면 에러가 발생한다. 함수에 따라 아래에 코드를 적으면 안되는 사례가 있기 때문에 return을 쓰지 않아도 render 함수 만으로도 함수를 끝낼 수 있다. 다만 return은 함수를 끝내므로 render 옆에 return을 붙여 아래 코드에 대한 접근을 막아 실수를 방지할 수 있다. 결론 : render이나 redirect같은 함수는 한번더 함수호출하는걸 허용하지 않고 함수에 따라 return은 생략가능

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
