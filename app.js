const express = require("express");
const Model = require("./modules/Model");
const upload = require("./modules/upload");
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
  res.status(200).sendFile(__dirname + "/views/index.html");
});
app.post('/predict', upload.single('image'), async (req, res) => {
    // Upload no image
    if (!req.file) {
        res.status(401).json({err: 'Please provide an image'});
    } else {
        // Read file uploaded
        let img = fs.readFileSync(req.file.path);
        try {
            let top3 = await model.predict(img);
            res.status(200).json(top3);
        }
        catch (e) {
            res.status(401).json({err: "Unsupported image type"});
        }
        finally {
            fs.unlinkSync(req.file.path);
        }
    }
})

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})