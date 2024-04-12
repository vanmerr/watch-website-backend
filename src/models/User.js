const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    avartarURL : {
        type: String,
        default: ''
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    isAdmin:{
        default:false,
        type:Boolean
    }

}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema)