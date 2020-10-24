const express = require("express");
const Model = require("./modules/Model");
const upload = require("./modules/upload");
const toUint8Array = require("base64-to-uint8array");
const fs = require("fs");
const cors = require("cors");
const app = express();

// Load model
let model = new Model();
(async () => {
    model.load();
    console.log("Model loaded");
})();

// Startup app
app.use(express.static(__dirname + '/public'));
app.use(cors());
// Router
app.get("/", (req, res) => {
  res.status(200).sendFile(__dirname + "/views/index1.html");
});
app.post('/predict', upload.single('image'), async (req, res) => {
    // Upload no image
    if (req.body.image[5] != 'i') {
        res.status(401).json({err: 'Please provide an image'});
    } else {
        // Read file uploaded
        let data = req.body.image.replace('data:image/jpeg;base64,','').replace('data:image/png;base64,','');
        let imageArray = toUint8Array(data);
        try {
            let top3 = await model.predict(imageArray);
            res.status(200).json(top3);
        }
        catch (e) {
            res.status(401).json({err: "Unsupported image type"});
        }
    }
})

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})