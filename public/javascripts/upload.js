// Get cached image
function init() {
    let cached_image = document.getElementById("input-image");
    if (cached_image.files) {
        let reader = new FileReader();
        reader.onload = () => {
            let img = document.getElementById('preview-image');
            img.src = reader.result;
        }
        reader.readAsDataURL(cached_image.files[0]);
    }
}

// Upload image from file
function upload(event)
{
    let reader = new FileReader();
    reader.onload = () =>
    {
        let img = document.getElementById('preview-image');
        img.src = reader.result;
    }
    console.log(event.target.files[0]);
    reader.readAsDataURL(event.target.files[0]);
}


//Send POST request
const form = document.querySelector('form');
form.addEventListener('submit', function(ev) {
    ev.preventDefault();
    $("#prediction-list").empty();

    console.log(form);
    let xhr = new XMLHttpRequest();
    let img = new FormData(form);

    xhr.open("POST", "/predict", true);
    xhr.onreadystatechange = () => {
        $("#prediction-list").empty();
        if (xhr.readyState === XMLHttpRequest.DONE) {
            let status = xhr.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                let top3 = JSON.parse(xhr.response);
                top3.forEach((p) => {
                    $("#prediction-list").append(`<li style="list-style-type:none;">${p.className}: ${p.probability.toFixed(3)}</li>`);
                });
            } else {
                $("#prediction-list").append(`<li style="list-style-type:none;">${JSON.parse(xhr.response).err}</li>`);
            }
        } else {
            $("#prediction-list").append(`<li style="list-style-type:none;">Analyzing...</li>`);
        }
    }

    xhr.send(img);
});