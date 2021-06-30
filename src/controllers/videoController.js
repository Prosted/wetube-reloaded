//global Router
export const trending = (req, res) => {
    res.render("home", {pageTitle : "Home", potato : "I love Potato"}); //render은 2가지 인수를 받는데, 첫번째는 view의 이름이고 두번째는 템플릿에 보낼 변수다. 변수는 원하는 만큼 보낼 수 있다.
} 
export const search = (req, res) => res.send("Search Video");

//video Router
export const upload = (req, res) => res.send("Upload Video");
export const see = (req, res) => {
    res.render("watch");
};
export const edit = (req, res) => {
    res.render("edit");
};
export const deleteVideo = (req, res) =>{
    console.log(req.params);
    return res.send("Delete Video")
};

