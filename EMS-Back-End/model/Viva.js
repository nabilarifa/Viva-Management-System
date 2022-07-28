const mongoose = require ("mongoose");

/*
questionSchema is used to save questions and comments of teachers that were made during exam
*/

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    authorEmail: { type: String, required: true },
    authorName: String,
    comments: [{
        comment: String,
        email: String,
    }]
});

const vivaSchema = new mongoose.Schema({
    examId:{
        type : String,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true
    },
    questions: {
        type: [questionSchema],
        required: true,
        default: [],
    },
    marks:{
        type: Number,
        required: false,
        default: 0,
    },
    startTime: {
        type: Date,
        default: Date.now(),
    },
    endTime: {
        type: Date,
        default: Date.now(),
    },
    isEnded: {
        type: Boolean,
        default: false,
    }
});
const Viva = mongoose.model("viva",vivaSchema);
module.exports = Viva;