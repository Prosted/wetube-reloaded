
const videoContainer = document.getElementById("videoContainer");
const form =document.getElementById("commentForm");
const delBtn = document.querySelectorAll(".deleteComment");
const commentsUl = document.querySelector(".video__comments ul");

const addComment = (text, id) => {
    const commentsContainer = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    const icon = document.createElement("i")
    const span = document.createElement("span");
    const delBtn = document.createElement("span");
    newComment.dataset.id = id;
    icon.className = "far fa-comment";
    span.innerText = text;
    delBtn.className="deleteComment";
    delBtn.addEventListener("click", handleDelete);
    delBtn.innerText="❌";
    newComment.className = "video__comment";

    
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(delBtn);
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
    if(response.status === 201){
        textarea.value = "";
        const { newCommentId } = await response.json();
        addComment(text, newCommentId);
    }
}

const handleDelete = async (event) => {
    const li = event.target.parentNode;
    const {id} = li.dataset;
    const videoId = videoContainer.dataset.id;
    const response = await fetch(`/api/videos/${videoId}/delete-comment`, {
        method:"POST",
        headers : {
            "Content-Type": "application/json",
        },
        body : JSON.stringify({id}),
    })
    if(response.status === 201){
        commentsUl.removeChild(li);
    }
}

if(form){
    form.addEventListener("submit", handleSubmit);
    delBtn.forEach(element => {
        element.addEventListener("click", handleDelete);      
    });
}