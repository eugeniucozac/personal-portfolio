const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    viewproject:{
        type: String,
        required: true
    },
    viewgithub:{
        type: String,
        required: true
    },
    technologies:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    } 
});

module.exports = mongoose.model("projects", ProjectSchema);