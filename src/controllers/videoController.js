let videos = [
    {
        title : "First Video",
        rating : 5,
        comments : 2,
        createdAt : "2 minutes ago",
        views : 1,
        id : 1
    },
    {
        title : "Second Video",
        rating : 5,
        comments : 2,
        createdAt : "2 minutes ago",
        views : 59,
        id : 2
    },
    {
        title : "Third Video",
        rating : 5,
        comments : 2,
        createdAt : "2 minutes ago",
        views : 101,
        id : 3
    },
];

//global Router
export const trending = (req, res) => {
    res.render("home", {pageTitle : "Home", videos}); //render은 2가지 인수를 받는데, 첫번째는 view의 이름이고 두번째는 템플릿에 보낼 오브젝트다. 오브젝트 안 변수는 원하는 만큼 보낼 수 있다.
} 


//video Router

export const watch = (req, res) => {
    const {id} = req.params;
    const video = videos[id-1];
    return res.render("watch", {pageTitle : `watch ${video.title}`, video});
};
export const getEdit = (req, res) => {
    const {id} = req.params;
    const video = videos[id-1];
    res.render("edit", {pageTitle : `Editing ${video.title}`, video});
};

export const postEdit = (req, res) => {
    const {id} = req.params;
    const {title} =req.body;
    videos[id-1].title = title;
    res.redirect(`/videos/${id}`);
}

