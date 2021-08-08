const recorderBtn = document.getElementById("recorder");
const video = document.getElementById("preview");


const handleRecorder = async (event) => {
    const stream = await navigator.mediaDevices.getUserMedia({audio : false, video : {width : 300, height : 200}});
    video.srcObject = stream;
    video.play();
}

recorderBtn.addEventListener("click", handleRecorder);