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
    const mp4File = ffmpeg.FS("readFile", "output.mp4");
    const mp4Blob = new Blob([mp4File.buffer], {type:"video/mp4"});
    console.log(mp4Blob);
    const mp4Url = URL.createObjectURL(mp4Blob);
    const a = document.createElement("a");
    a.href=mp4Url;
    a.download = "My Video";
    body.appendChild(a);
    a.click();
    recorderBtn.innerText = "Start Recording";
    recorderBtn.removeEventListener("click", handleDownload);
    recorderBtn.addEventListener("click", handleStart);
    body.removeChild(a);
    init();
}


const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({audio : false, video : true});
    video.srcObject = stream;
    video.play();
}

init();

recorderBtn.addEventListener("click", handleStart);