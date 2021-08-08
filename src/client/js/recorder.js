const recorderBtn = document.getElementById("recorder");
const video = document.getElementById("preview");

let stream;

const handleStart = (event) => {
    recorderBtn.innerText = "Stop Recording";
    recorderBtn.removeEventListener("click", handleStart);
    recorderBtn.addEventListener("click", handleStop);
    const recorder = new MediaRecorder(stream);
    console.log(recorder);
    recorder.ondataavailable= (event)=>{
        console.log("Done");
        console.log(event);
    };
    recorder.start();
    console.log(recorder);
    setTimeout(()=>{
        recorder.stop();
    }, 10000);
}

const handleStop = (event) => {
    recorderBtn.innerText = "Start Recording";
    recorderBtn.removeEventListener("click", handleStop);
    recorderBtn.addEventListener("click", handleStart);
}


const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({audio : false, video : {width : 300, height : 200}});
    video.srcObject = stream;
    video.play();
}

init();

recorderBtn.addEventListener("click", handleStart);