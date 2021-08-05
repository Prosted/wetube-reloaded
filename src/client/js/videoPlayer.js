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
    playBtn.innerHTML = video.paused ? "Play" : "Pause";
}

const handleMute = (event) => {
    if(video.muted){
        video.muted = false;
        volume.value = 0.5;
    }else{
        video.muted = true;
        volume.value = 0;
    }
    muteBtn.innerHTML = video.muted ? "UnMute" : "Mute";
}


playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMute);

