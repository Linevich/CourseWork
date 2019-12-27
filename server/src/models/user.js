const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        required: true,
        trim: true
    },
    email: {
        required: true,
        type: String,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("Password must not contain the word password")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.virtual('tasks', {
    ref: "Tasks",
    localField: '_id',
    foreignField: 'owner'
})
UserSchema.virtual('groups', {
    ref: "Groups",
    localField: '_id',
    foreignField: 'owner'
})

UserSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
        console.log(user.password);
    }
    next();
});

UserSchema.statics.findOneByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error("Incorrect Email");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Incorrect Password");
    }
    return user;
}

UserSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user.id.toString()}, 'helloworld');
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

UserSchema.virtual('tasks', {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
})

UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

const User = mongoose.model("User", UserSchema);

module.exports = User;