const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    type:{
        type: String,
        required: true
    },
    icon:{
        type: String,
        required: true
    },
    details:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("contacts", ContactSchema);