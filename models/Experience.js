const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExperienceSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    company:{
        type: String,
        required: true
    },
    details:{
        type: String,
        required: true
    },
    startDate:{
        type: Date
    },
    endDate:{
        type: Date
    },
    category: {
        type: String,
        enum: ["experience", "education"]
    }
});

module.exports = mongoose.model("experiences", ExperienceSchema);