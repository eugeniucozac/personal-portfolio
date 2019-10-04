const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HeaderSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    experience:{
        type: String,
        required: true
    },
    position:{
        type: String,
        required: true
    },
    image: {
        type: String
    }
});

module.exports = mongoose.model("headers", HeaderSchema);