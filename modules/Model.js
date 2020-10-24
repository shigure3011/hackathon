const tf = require("@tensorflow/tfjs");
const tf_node = require("@tensorflow/tfjs-node");
require("./classes");

module.exports = class Model {
    constructor() {
        this.model = undefined;
    }

    async load() {
        this.model = await tf.loadLayersModel("file://models/model.json");
        return this.model;
    };

    async predict(image) {
        // Pre-process the image
        let tensor = tf_node.node.decodeImage(image)
            .resizeNearestNeighbor([224, 224])
            .toFloat();

        let offset = tf.scalar(127.5);

        tensor = tensor.sub(offset)
            .div(offset)
            .expandDims();

        // Slice if image has 4 channels
        tensor = tf.slice(tensor, [0, 0, 0, 0], [-1, -1, -1, 3]);

        // Pass the tensor to the model and call predict on it.
        let predictions = await this.model.predict(tensor).data();
        let top3 = Array.from(predictions)
            .map((p, i) => { // this is Array.map
                return {
                    probability: p,
                    className: CLASSES[i]
                };

            }).sort((a, b) => {
                return b.probability - a.probability;

            }).slice(0, 3);
        return top3;
    }
}
