//DB모델 만들기
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        rim: true,
        unique: 1
    },
    password: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {//Expire
        type: Number
    }
});

const User = mongoose.model('User', userSchema);

module.exports = {User};