const mongoose = require('mongoose');

/*

User registration info is saved here

*/

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 3
    },
    lastName: {
        type: String,
        required: true,
        min: 3
    },
    email: {
        type: String,
        required: true,
        max: 40,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    teacherMode: {
        type: Boolean,
        required: true
    },
    teacherPass: {
        type: String,
        required: false
    },

    registrationNo: {
        type: String,
        required: false
    }, 

    /// Extra added fields for profile
    phoneNo: {
        type: String,
        required: false
    },

    designation: {
        type: String,
        required: false
    },

    about: {
        type: String,
        required: false
    },

    profilePic: {
        type: String,
        required: false
    }

});
const User  =  mongoose.model('user',userSchema);
module.exports = User ;
/// params: model name, and schema
