const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

let volumeValue =0.5;
video.volume = volumeValue;

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
        if(Number(video.volume) === 0 ){
            video.volume = 0.5;
            volumeValue = 0.5;
        }
    }else{
        video.muted = true;
    }
    muteBtn.innerHTML = video.muted ? "UnMute" : "Mute";
    volume.value = video.muted ? 0 : volumeValue;
}

const handleVolume = (event) => {
    const {
        target : {value}
    } = event;
    volumeValue = value;
    video.volume = value;
    if(video.muted){
        video.muted=false;
    }
    if(video.volume === 0){
        video.muted = "true";
    }
    muteBtn.innerHTML = video.muted ? "UnMute" : "Mute";
}

playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMute);
volume.addEventListener("input", handleVolume);

