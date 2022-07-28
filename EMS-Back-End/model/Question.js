const mongoose = require ("mongoose");

/*
Stored the questions for each teacher that were asked by that teacher during viva
*/

const QuestionSchema = new mongoose.Schema({
    question:{
      type: Array,
      required:true
    },
    email:{
      type:String,
      required:true
    }
});
const Question = mongoose.model("question",QuestionSchema);
module.exports = Question;
