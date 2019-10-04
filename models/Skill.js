const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SkillSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    progress: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("skills", SkillSchema);