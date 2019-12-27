const mongoose = require("mongoose")

const GroupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    members: {
        type: Object
    },
    owner: {
        type: mongoose.Schema.Types.ObjectID,
        required: true,
        ref: "User"
    }
});
const Group = mongoose.model("Group", GroupSchema);

module.exports = Group;