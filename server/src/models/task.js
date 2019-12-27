const mongoose = require("mongoose")
const TaskSchema = mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    complited: {
        type: Boolean,
        default: false
    },
    subtask: {
        type: Object
    },
    project:{
        type: mongoose.Schema.Types.ObjectID,
        required: false,

    },
    owner: {
        type: mongoose.Schema.Types.ObjectID,
        required: false,
        
    }
});
const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;