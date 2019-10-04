const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubtitleSchema = new Schema({
    block: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("subtitles", SubtitleSchema);