const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeLine = document.getElementById("timeLine");

let volumeValue =0.5;
video.volume = volumeValue;

const handlePlayBtn = (event) => {
    if(video.paused){
        video.play();
    }
    else{
        video.pause();
    }
    playBtn.innerText = video.paused ? "Play" : "Pause";
}

const handleMute = (event) => {
    if(video.muted){
        video.muted = false;
        if(video.volume === 0 ){
            video.volume = 0.5;
            volumeValue = 0.5;
        }
    }else{
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "UnMute" : "Mute";
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
    muteBtn.innerText = video.muted ? "UnMute" : "Mute";
}

const formatTime = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
}

const handleLoadedMetadata = () => {
    const videoTotalTime = Math.floor(video.duration);
    totalTime.innerText = formatTime(videoTotalTime);
    timeLine.max = videoTotalTime;
};

const handleTimeUpdate = () => {
    currenTime.innerText = formatTime(Math.floor(video.currentTime));
};

const handleTimeLineChange = (event) => {
    const {
        target : {value},
    } = event;
    video.currentTime = value;
}



playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMute);
volume.addEventListener("input", handleVolume);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeLine.addEventListener("input", handleTimeLineChange);

if (video.readyState == 4) {
    handleLoadedMetadata();
}

