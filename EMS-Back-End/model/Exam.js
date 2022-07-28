const mongoose = require('mongoose');

/*
Exam Schema
-> Used to save exam related data
*/

const examSchema = new mongoose.Schema({
    courseTitle: {
        type: String,
        required: true,
    },
    courseCode: {
        type: String,
        required: true,
    },
    startTime: {
        // Change type to object
        type: Date,
        require: true
    },
    examDuration: {
        type: Number,
        required: true
    },
    requested: {
        type: [String],
        required: false
    }, 
    currentReg:{
        type: String,
        required: false,
    },
    ended: {
        type: [String],
        required: false
    },
    regList: {
        type: [String],
        required: false
    },

    courseTeacher: {
        type: String,
        required: true
    },
    details:{
        type: [{
            startTime: Date,
            endTime: Date,
            registrationNumber: String,
        }],
        required: false,
        default: []
    },
    email: {
        type: String,
        required: true
    },
    isEnded: {
        type: Boolean,
        default: false,
    },

});
const Exam = mongoose.model('exam',examSchema);
module.exports = Exam;
/// params: model name, and schema


