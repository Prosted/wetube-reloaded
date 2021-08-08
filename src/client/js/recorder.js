const recorderBtn = document.getElementById("recorder");
const video = document.getElementById("preview");

let stream;
let recorder;

const handleStart = (event) => {
    recorderBtn.innerText = "Stop Recording";
    recorderBtn.removeEventListener("click", handleStart);
    recorderBtn.addEventListener("click", handleStop);
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable= (event)=>{
        const videoFile = URL.createObjectURL(event.data);
        console.log(videoFile);
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
    recorderBtn.addEventListener("click", handleStart);
    recorder.stop();
}


const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({audio : false, video : {width : 300, height : 200}});
    video.srcObject = stream;
    video.play();
}

init();

recorderBtn.addEventListener("click", handleStart);