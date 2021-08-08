const recorderBtn = document.getElementById("recorder");

const handleRecorder = async (event) => {
    const stream = await navigator.mediaDevices.getUserMedia({audio : true, video : true});
    console.log(stream);
}

recorderBtn.addEventListener("click", handleRecorder);