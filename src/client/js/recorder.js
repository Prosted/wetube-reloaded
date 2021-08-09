import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const body = document.body;
const recorderBtn = document.getElementById("recorder");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleStart = (event) => {
    recorderBtn.innerText = "Stop Recording";
    recorderBtn.removeEventListener("click", handleStart);
    recorderBtn.addEventListener("click", handleStop);
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable= (event)=>{
        videoFile = URL.createObjectURL(event.data);
        video.src=videoFile;
        video.srcObject=null;
        video.loop = true;
        video.play();
    };
    recorder.start();
}

const handleStop = (event) => {
    recorderBtn.innerText = "Download";
    recorderBtn.removeEventListener("click", handleStop);
    recorderBtn.addEventListener("click", handleDownload);
    recorder.stop();
}

const handleDownload = async (event) => {
    const ffmpeg = createFFmpeg({log:true});
    await ffmpeg.load();
    ffmpeg.FS("writeFile", "recorder.webm", await fetchFile(videoFile));

    await ffmpeg.run("-i", "recorder.webm", "-r", "60", "output.mp4");
    await ffmpeg.run("-i", "recorder.webm", "-ss", "00:00:01", "-frames:v", "1", "Thumbnail.jpg");

    const mp4File = ffmpeg.FS("readFile", "output.mp4");
    const thumbnailFile = ffmpeg.FS("readFile", "Thumbnail.jpg");

    const mp4Blob = new Blob([mp4File.buffer], {type:"video/mp4"});
    const thumbnailBlob = new Blob([thumbnailFile.buffer], {type:"image/jpg"});

    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbnailUrl = URL.createObjectURL(thumbnailBlob);

    //video download
    const videoLink = document.createElement("a");
    videoLink.href=mp4Url;
    videoLink.download = "My Video.mp4";
    body.appendChild(videoLink);
    videoLink.click();
    
    //thumbnail download
    const thumbnailLink = document.createElement("a");
    thumbnailLink.href =  thumbnailUrl;
    thumbnailLink.download =  "My Thumbnail.jpg";
    body.appendChild(thumbnailLink);
    thumbnailLink.click();
    
    //remove all link
    ffmpeg.FS("unlink", "output.mp4");
    ffmpeg.FS("unlink", "Thumbnail.jpg");
    ffmpeg.FS("unlink", "recorder.webm");
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbnailUrl);
    URL.revokeObjectURL(videoFile);
    body.removeChild(videoLink);
    body.removeChild(thumbnailLink);

    //init
    recorderBtn.innerText = "Start Recording";
    recorderBtn.removeEventListener("click", handleDownload);
    recorderBtn.addEventListener("click", handleStart);
    init();
}


const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({audio : false, video : true});
    video.srcObject = stream;
    video.play();
}

init();

recorderBtn.addEventListener("click", handleStart);