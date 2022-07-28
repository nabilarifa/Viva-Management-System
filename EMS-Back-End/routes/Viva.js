
const router = require('express').Router();

const Viva = require('../model/Viva');
const Exam = require('../model/Exam');
const User = require('../model/User');

/*
Created to get the viva history (all the questions that were asked to a student)
But this route is never used.

data passed as:
          Exam id -> req.body.id
          Registration number -> req.body.registrationNumber

call using: localhost:3000/getVivaHistory

*/

router.post('/getVivaHistory', (req, res) => {
    try{
        Exam.find({ _id: req.body.id }, (err, response) => {
            if (!err) {
                const currentReg = response[0].currentReg;
                if (currentReg == null) {
                    res.status(404).json([]);
                }
                else {
                    Viva.find({ examId: req.body.id, registrationNumber: currentReg }, (err, found) => {
                        if (!err) {
                            try{
                                ((found[0] || {}).questions || []).reverse();
                            }
                            catch(err)
                            {
                                console.log(err);
                            }
                            res.status(200).json(found[0]);
                        }
                        else {
                            res.status(404).json(`Error: ${err}`);
                        }
                    })
                }
            }
        })
    }
    catch(err)
    {
        console.log(err);
    }
})



// router.post('/addToViva', (req, res) => {
//     Viva.find({ examId: req.body.id }, (err, found) => {
//         if (!err) {
//             let tempArray = found[0].questions;
//             console.log(found);
//             const data = {
//                 question: req.body.question,
//                 comment: []
//             }
//             tempArray.push(data);
//             console.log(tempArray);
//             found.questions = tempArray;
//             found[0].save(err => {
//                 res.status(200).json(found[0].questions);
//             })
//         }
//         else {
//             console.log(`Error: ${err}`);
//         }
//     })
// })



/*
used to show which students are in waiting list

call using: localhost:3000/waitingList/{Exam id}

*/
router.get('/waitingList/:id', (req, res) => {
    // console.log(req.params.id);
    Exam.find({ _id: req.params.id }, (err, found) => {
        if (!err) {
            res.status(200).json(found[0].requested);
        }
        else {
            res.status(404).json(`Error:${err}`)
        }
    })
})


/*
helper function to get user name just by passing the users email
*/

async function getNameByEmail(email){
    console.log("GETNAMEEEEEEEEEEEEEEEEEEEE")
    try {
        console.log(email);
        const resp = await User.findOne({email: email});
        console.log(resp);
        return resp.firstName + " " + resp.lastName;
    } catch(err) {
        console.log(err);
        return "error";
    }
}


/*

Used to post a comment to a question asked by a teacher
Only teacher can access this route**

Parameters passed as:
                Exam id -> req.body.examId
                question -> req.body.question (Question that is asked is also passed for simplicity)
                comment -> req.body.cooment
                email -> req.body.email (Commenters email)
call using: localhost:3000/postComment

*/

router.post('/postComment', async (req, res) => {
    try {

        const examId = req.body.id;
        const question = req.body.question;
        const comment = req.body.comment;
        const email = req.body.email;

        const exam = await Exam.findOne({_id: examId});
        const regNo = exam.currentReg;
        console.log('postComment + ' + regNo);
        let entry = await Viva.findOne({
            examId: examId,
            registrationNumber: regNo
        });
        const _id = entry._id;
        delete entry._id;
        const name = await getNameByEmail(email);
        (entry.questions || []).forEach(element => {
            if (element.question === question) {
                element.comments.push({ comment: name + ': ' + comment, email: email });
            }
        });
        const response = await Viva.findOneAndUpdate({ _id: _id }, entry, {new: true});
        res.status(200).json(response);
    }
    catch (err) {
        res.status(404).json(err);
    }
})

/*

Used to post questions in the exam
Only teacher can use this route**

Data passed as: 
               questions -> req.body.question
               Teacher name -> req.body.authorName (This teacher asked this question.)
               Teacher email -> req.body.authorEmail 

*/

router.post('/postQuestion', async (req, res) => {
    // examid
    try {
        const {
            question,
            authorName,
            authorEmail
        } = req.body;
        const id = req.body.id;
        let exam = await Exam.findOne({ _id: id });
        console.log(exam);
        const currentReg = exam.currentReg;
        const viva = await Viva.findOne({ examId: id, registrationNumber: currentReg });
        viva.questions.push({ question, comments: [], authorName, authorEmail });
        const response = await Viva.findOneAndUpdate({ _id: viva._id }, viva, {new: true});
        res.status(200).json(response);
    } catch (err) {
        res.status(404).json(err);
    }
})

/*
Never used
Delete it
*/

router.get('/', async (req, res) => {
    try {
        const viva = await Viva.findOne(req.query);
        console.log('viva query', req.query);
        res.status(200).json(viva);
    } catch (err) {
        res.status(404).json(err);
    }
})


module.exports = router;
