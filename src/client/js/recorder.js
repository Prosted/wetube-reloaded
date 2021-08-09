import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const body = document.body;
const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

const files = {
    input : "recorder.webm",
    output : "output.mp4",
    thumb :  "thumbnail.jpg",
};


let stream;
let recorder;
let videoFile;

const handleStart = (event) => {
    actionBtn.innerText = "Stop Recording";
    actionBtn.removeEventListener("click", handleStart);
    actionBtn.addEventListener("click", handleStop);
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
    actionBtn.innerText = "Download";
    actionBtn.removeEventListener("click", handleStop);
    actionBtn.addEventListener("click", handleDownload);
    recorder.stop();
}


const downloadFile = (fileUrl, fileName) =>{
    const a = document.createElement("a");
    a.href=fileUrl;
    a.download = fileName;
    body.appendChild(a);
    a.click();
    body.removeChild(a);
}

const handleDownload = async () => {
    actionBtn.innerText = "Downloading..";
    actionBtn.disabled = true;

    const ffmpeg = createFFmpeg({log:true});
    await ffmpeg.load();
    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

    await ffmpeg.run("-i", files.input, "-r", "60", files.output);
    await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb);

    const mp4File = ffmpeg.FS("readFile", files.output);
    const thumbFile = ffmpeg.FS("readFile", files.thumb);

    const mp4Blob = new Blob([mp4File.buffer], {type:"video/mp4"});
    const thumbBlob = new Blob([thumbFile.buffer], {type:"image/jpg"});

    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    //video download
    downloadFile(mp4Url, "My Video.mp4");
    downloadFile(thumbUrl, "My thumbnail.jpg");

    //remove all link
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumb);
    ffmpeg.FS("unlink", files.input);
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);

    //init
    actionBtn.innerText = "Start Recording";
    actionBtn.removeEventListener("click", handleDownload);
    actionBtn.addEventListener("click", handleStart);
    actionBtn.disabled=false;
    init();
}


const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio : false, 
        video : {
            width : 1024, 
            height : 576,
        },
    });
    video.srcObject = stream;
    video.play();
}

init();

actionBtn.addEventListener("click", handleStart);