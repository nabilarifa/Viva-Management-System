const router = require('express').Router();

const Question = require('../model/Question');


/*
Used to get the question bank of a teacher!

Data passed as: email -> req.body.email
call using: localhost:3000/getBank

*/

router.post('/getBank', async (req, res) => {
  console.log('getBank');
  let teacherEmail = req.body.email
  console.log(teacherEmail);
  try {
    const bank = await Question.find({ email: teacherEmail });
    if (bank.length)
      return res.status(200).json(bank[0].question);
    else
      return res.status(200).json([]);
  } catch (err) {
    console.log(err);
    return res.status(404).json("Erorr");
  }

});


/*
Use to add question  to a teachers bank
data passed as: 
           email -> req.body.email
           question -> req.body.question

call it using: localhost:3000/addQuestion
*/

router.post('/addQuestion', async(req,res) => {
  try {
    const email = req.body.email;
    const text = req.body.question;
    let obj = await Question.find({ email: email });
    if (obj.length==0) {
      const q = new Question({
        email: email,
        question: []
      });
      try {
        await q.save();
      } catch (err) {
        return res.status(200).json(err);
      }
    } 
    obj = await Question.findOne({ email: email });
    obj.question.push(text);

    const response = await Question.findOneAndUpdate({ email: email }, obj, {new: true});
    console.log(response);
    return res.status(200).json(response);
 }
  catch (err) {
   return res.status(404).json(err);

 }
});

/*
Used to delete a specific question from teachers question bank
pass data as:
            question -> req.body.question
            email -> req.body.email
call using: localhost:3000/deleteQuestion

*/

router.post('/deleteQuestion', async(req, res) => {
  /// ques, email
  try {
    const ques = req.body.question;
    const email = req.body.email;
    const bank = await Question.findOne({email: email});
    let ara = bank.question;
    let i;
    let index = 0;
    for(i = 0 ; i < ara.length ; i++) {
      if(ara[i] == ques) {
          index = i;
          break;
      }
    }
    ara.splice(index, 1);
    const resp = await Question.findOneAndUpdate({email: email}, {question: ara}, {new: true});
    return res.status(200).json(resp);
  } catch(err) {
    return res.status(404).json(err);
  }
});

module.exports = router;