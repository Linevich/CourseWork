const mongoose = require("mongoose")

const ProjectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    members: {
        type: Object
    },
    group:{
        type: mongoose.Schema.Types.ObjectID,
        required: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectID,
        required: false,
    }
});
const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;