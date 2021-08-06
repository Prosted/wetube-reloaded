const videoContainer = document.getElementById("videoContainer");
const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeLine = document.getElementById("timeLine");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenBtnIcon = fullScreenBtn.querySelector("i");
const videoControllers = document.getElementById("videoControllers");

let controllersTimeOut;
let controllersMoveMentTimeOut;
let volumeValue =0.5;
video.volume = volumeValue;

const handlePlayBtn = (event) => {
    if(video.paused){
        video.play();
    }
    else{
        video.pause();
    }
    playBtnIcon.className = video.paused ? "fas fa-play" : "fas fa-pause";
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
    muteBtnIcon.className = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
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
    muteBtnIcon.className = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
}

const formatTime = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(14, 5);
}

const handleLoadedMetadata = () => {
    const videoTotalTime = Math.floor(video.duration);
    totalTime.innerText = formatTime(videoTotalTime);
    timeLine.max = videoTotalTime;
};

const handleTimeUpdate = () => {
    const videoCurrentTime = Math.floor(video.currentTime);
    const videoTotalTime = Math.floor(video.duration);
    timeLine.value = videoCurrentTime;
    currenTime.innerText = formatTime(Math.floor(video.currentTime));
    if(videoCurrentTime === videoTotalTime){
        resetVideoTime();
    }
};

const resetVideoTime = () => {
    timeLine.value=0;
    video.currentTime=0;
    video.paused = true;
    playBtnIcon.className = "fas fa-play";
    video.pause();
}

const handleTimeLineChange = (event) => {
    const {
        target : {value},
    } = event;
    video.currentTime = value;
}

const handleFullScreen = (event) => {
    const isFullScreenNow = document.fullscreenElement;
    if(isFullScreenNow){
        fullScreenBtnIcon.className = "fas fa-expand";
        document.exitFullscreen();
    }else{
        fullScreenBtnIcon.className = "fas fa-compress-arrows-alt";
        videoContainer.requestFullscreen();
    }
}

const hideControllers = () => {
    videoControllers.classList.remove("show");
}

const handleMouseMove = (event) => {
    if(controllersTimeOut){
        clearTimeout(controllersTimeOut);
        controllersTimeOut = null;
    }
    if(controllersMoveMentTimeOut){
        clearTimeout(controllersMoveMentTimeOut);
        controllersMoveMentTimeOut = null;
    }
    videoControllers.classList.add("show");
    controllersMoveMentTimeOut = setTimeout(hideControllers, 3000);
}

const handleMouseLeave = (event) => {
    controllersTimeOut = setTimeout(hideControllers, 3000);
}

const handleVideoClick = (event) => {
    if(video.paused){
        video.play();
    }
    else{
        video.pause();
    }
    playBtnIcon.className = video.paused ? "fas fa-play" : "fas fa-pause";
}

const handleSpacebar = (event) => {
    const {keyCode} = event;
    if(keyCode === 32){
        if(video.paused){
            video.play();
        }else{
            video.pause();
        }
        playBtnIcon.className = video.paused ? "fas fa-play" : "fas fa-pause";
    }
}

const handleEnded = (event) => {
    const {id} = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, {method:"POST"});
}

playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMute);
volume.addEventListener("input", handleVolume);
timeLine.addEventListener("input", handleTimeLineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("click", handleVideoClick);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
document.addEventListener("keydown", handleSpacebar);

if (video.readyState == 4) {
    handleLoadedMetadata();
}

