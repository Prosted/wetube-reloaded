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

const handleDownload = (event) => {
    const a = document.createElement("a");
    a.href=videoFile;
    a.download = "My Video💚.webm";
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