const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PastexperienceSchema = new Schema({
    skill: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("pastexperiences", PastexperienceSchema);