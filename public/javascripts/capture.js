// Set default size
let width = 300;
let height = 0;
let streaming = false;

let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let photo = document.getElementById('preview-image');
let startButton = document.getElementById('take-photo');

// Fill the photo with an indication that none has been
// captured.
function clearPhoto() {
    let context = canvas.getContext('2d');
    context.fillStyle = "#FFF";
    context.fillRect(0, 0, canvas.width, canvas.height);

    let data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
}


// Check whether streaming or not
function capture() {
    if (!streaming) {
        startCapture();
    } else {
        takePhoto();
        stopCapture();
    }
}

// Obvious function
function startCapture() {

    // Change button value
    startButton.innerText = "Take photo";
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    // Ask for permission
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then((stream) => {
            document.getElementById("capture").innerText = "Chụp ảnh";
            video.srcObject = stream;
            video.play();
        })
        .catch((err) => {
            console.log("An error occurred: " + err);
        });

    // Display
    video.addEventListener('canplay', (ev) => {
        if (!streaming) {
            height = video.videoHeight / (video.videoWidth/width);

            // Firefox currently has a bug where the height can't be read from
            // the video, so we will make assumptions if this happens.

            if (isNaN(height)) {
                height = width * (5/6);
            }

            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
        }
    }, false);

    clearPhoto();
}

// Take photo
function takePhoto() {
    if (streaming) {
        startButton.innerText = "Capture from camera";

        let context = canvas.getContext('2d');
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);
            let data = canvas.toDataURL('image/png');
            photo.setAttribute('src', data);

        } else {
            clearPhoto();
        }
    }
}

// Stop capture
function stopCapture() {
    document.getElementById("capture").innerText = "Bật camera";
    if (streaming) {
        const stream = video.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach(function (track) {
            track.stop();
        });
        streaming = false;
        video.srcObject = null;
    }
}
