import { listenerCount } from "events";

const videoContainer = document.getElementById("videoContainer");
const form =document.getElementById("commentForm");

const addComment = (text) => {
    const commentsContainer = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    const icon = document.createElement("i")
    const span = document.createElement("span");
    icon.className = "far fa-comment";
    span.innerText = text;
    newComment.className = "video__comment";

    newComment.appendChild(icon);
    newComment.appendChild(span);
    commentsContainer.prepend(newComment);
} 


const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    if(text===""){
        return;
    }
    const videoId = videoContainer.dataset.id;
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
    });
    const {status} = response;
    if(status === 201){
        addComment(text);
    }
    textarea.value="";
}

if(form){
    form.addEventListener("submit", handleSubmit);
}