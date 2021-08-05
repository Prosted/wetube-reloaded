const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");


const handlePlayBtn = (event) => {
    if(video.paused){
        video.play();
    }
    else{
        video.pause();
    }
}

const handlePause = (event) => playBtn.innerHTML = "Pause";
const handlePlay = (event) => playBtn.innerHTML = "Play";

playBtn.addEventListener("click", handlePlayBtn);
video.addEventListener("play", handlePlay);
video.addEventListener("pause", handlePause);
muteBtn.addEventListener("click", handleMute);

