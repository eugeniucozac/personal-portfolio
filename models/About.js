const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AboutSchema = new Schema({
    content:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("abouts", AboutSchema);