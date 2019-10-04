const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LogoexperienceSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("logoexperiences", LogoexperienceSchema);