


// Get cached image
function init() {
    let cached_image = document.getElementById("input-image");
    if (cached_image.files.length > 0) {
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
    reader.readAsDataURL(event.target.files[0]);
}

// Convert to base64
function imgToBase64(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;

    // I think this won't work inside the function from the console
    img.crossOrigin = 'anonymous';

    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg',1);
}

