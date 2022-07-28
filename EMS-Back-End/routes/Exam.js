const router = require('express').Router();

const _ = require('underscore');

const Exam = require('../model/Exam');
const User = require('../model/User');
const jwtauth = require('../middleware/jwtauth');
const e = require('express');
const { response } = require('express');
const Viva = require('../model/Viva');
const { updateOthersSchedule, updateOthersScheduleForBreak } = require('./helper');
/*
 Exam ->
    create
    delete
    update
*/

/*
Helper function
*/
function createVivaForEachStudent(id, regList) {
  regList.forEach(roll => {
    const viva = new Viva({
      examId: id,
      registrationNumber: roll.toString(),
      questions: [],
      marks: 15,
    })
    viva.save(err => {
      if (err)
        console.log(err);
    })
  })
}


/*

Used to create exam
Only teachers can access this route**
Passes data according to Exam schema (Check exam schema)

Teacher email -> req.body.email,
Course Title -> req.body.courseTitle,
CourseCode -> req.body.courseCode,
Exam start Time -> req.body.startTime, // Stored as an object
Exam Duration -> req.body.examDuration, /// Viva Duration per person
Course Teacher name -> req.body.courseTeacher,
RegList -> req.body.regList (This array contains the list of students allowed for the exam)

Call this using: localhost:3000/create
*/

router.post('/create', (req, res) => {

  const tempArray = req.body.regList;

  const duration = req.body.examDuration * 60000;
  let currentTime;
  let detailArray = [];
  let checker = 0;

  // tempArray.sort();
  tempArray.forEach(i => {
    if (checker === 0) {
      checker = 1;
      currentTime = req.body.startTime;
      currentTime = new Date(currentTime);
    }

    var endDate = new Date(parseInt(currentTime.getTime()) + parseInt(duration - 1000));
    var nextDate = new Date(parseInt(currentTime.getTime()) + parseInt(duration));
    var data = {

      startTime: currentTime,
      endTime: endDate,
      registrationNumber: parseInt(i)
    }
    detailArray.push(data);
    currentTime = nextDate;
  });

  const exam = new Exam({
    email: req.body.email,
    courseTitle: req.body.courseTitle,
    courseCode: req.body.courseCode,
    startTime: req.body.startTime, // Stored as an object
    examDuration: req.body.examDuration, /// Viva Duration per person
    courseTeacher: req.body.courseTeacher,
    regList: req.body.regList,
    requested: [],
    ended: [],
    currentReg: null,
    details: detailArray
  });


  exam.save((err, doc) => {
    if (!err) {


      createVivaForEachStudent(doc._id, doc.regList);

      res.status(200).json("Exam Created Successfully!")
    } else {
      res.status(404).json(`Error:${err}`);
    }
  })
});

/*
Used to add a questions to a viva to show the student that is currently in the exam (targetting a student)
This route can only be called by a teacher

Passes data as: 
      registrationNumber -> req.body.registrationNumber,
      questions -> req.body.questions,
      marks -> req.body.marks

  
Use route as: localhost:3000//addQuestions/{Exam id}
*/

router.post("/addQuestions/:id", (req, res) => {

  const viva = new Viva({
    examId: req.params.id,
    registrationNumber: req.body.registrationNumber,
    questions: req.body.questions,
    marks: req.body.marks
  });
  console.log("hell" + req.body);
  viva.save(err => {
    if (!err) {
      // console.log("done");
      res.status(200).json("Question Added Succssfully")
    }
    else {
      console.log(err);
      res.status(404).json(`Error:${err}`);
    }
  })
})

/*
This route is never used

*/
router.post('/delete/:id', (req, res) => {
  Exam.find({ _id: req.params.id }, (err, found) => {
    if (!err) {
      const value = req.body.value;
      let array = found[0].regList;
      array = array.filter(item => item != value);
      found[0].regList = array;
      found[0].save();
      // console.log(found[0].regList);
    }
    else {
      res.status(404).json(`Error : ${err}`);
    }
  })
})

/*
Used to get teachers question bank
Passed data as: 
               Email -> req.body.email (Teaches email)
call as: localhost:3000/getQuestions
*/
router.post("/getQuestions", (req, res) => {
  Question.find({}).then(found => {
    let resArray = [];
    let dataArray = [];
    found.forEach((item) => {
      if (item.courseTeacher == req.body.email) {
        resArray = item.question;
        resArray.forEach((i) => {
          dataArray.push(i);
        });

      }

    });

    res.status(200).json(dataArray);
  }).catch((err) => {
    res.status(404).json(`Error:${err}`);
  })
})

/*

Used to show a specific exams student list, students whos exam has already ended, whos exam in still running and whos exam is scheduled

call as: localhost:3000/details/{Exam id}

*/

router.get("/details/:id", (req, res) => {
  const { id } = req.params;
  Exam.find({
    _id: req.params.id
  })
    .then(found => Promise.all(found[0].details.map(async (element) => {
        let st, et;
        st = element.startTime.toLocaleTimeString();
        et = element.endTime.toLocaleTimeString();
        console.log(element.registrationNumber, element.startTime, st, et);
        const viva = await Viva.findOne({ examId: id, registrationNumber: element.registrationNumber });
        const data = {
          startTime: st.slice(0, st.length - 6) + st.slice(st.length - 3, st.length),
          endTime: et.slice(0, et.length - 6) + et.slice(et.length - 3, et.length),
          value: st.slice(0, st.length - 6) + st.slice(st.length - 3, st.length) + ' - ' +
            et.slice(0, et.length - 6) + et.slice(et.length - 3, et.length),
          reg: element.registrationNumber,
          isRunningNow: String(found[0].currentReg) === String(element.registrationNumber),
          isEnded: viva.isEnded
        };
        
        console.log(found[0].currentReg, element.registrationNumber)
        console.log(data);
        return data;
      })).then(schedule => res.status(200).json(schedule))
    )
    .catch(err => res.status(404).json(`Error:${err}`));
})

/*
Used to get the all the exams available

call as: localhost:3000/currentExam

*/
router.get('/currentExam', (req, res) => {

  Exam.find({}, (err, found) => {
    if (!err) {
      var running = [];
      var ended = [];
      var upComing = [];
      found.forEach(element => {
        const currentTime = new Date();
        var startTime = new Date(element.startTime);

        var endTime = new Date(parseInt(startTime.getTime()) + parseInt((element.regList.length)) * parseInt(element.examDuration) * 60000);
        // console.log(startTime + " " + endTime);
        let st, et;
        st = startTime.toLocaleTimeString();
        et = endTime.toLocaleTimeString();

        const data = {
          _id: element._id,
          email: element.email,
          courseTeacher: element.courseTeacher,
          courseCode: element.courseCode,
          courseTitle: element.courseTitle,
          date: startTime.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
          startTime: st.slice(0, st.length - 6) + st.slice(st.length - 3, st.length),
          endTime: et.slice(0, et.length - 6) + et.slice(et.length - 3, et.length),
          isEnded: element.isEnded,
        }
        if (data.isEnded) {
          data.status = 'ended';
          ended.push(data);
        } else if (parseInt(startTime.getTime()) > parseInt(currentTime.getTime())) {
          data.status = 'upcoming';
          upComing.push(data);
        } else if (parseInt(startTime.getTime()) <= parseInt(currentTime.getTime())) {
          data.status = 'running';
          running.push(data);
        }
        

      });
      const returnData = {
        runningExam: running,
        upComingExam: upComing,
        endedExam: ended
      }
      res.status(200).json(returnData);
    } else {
      console.log(err);
      res.status(404).json(`Error:${err}`)
    }
  })

});

/*
Find a specific exams information

Call as: localhost:3000/{Exam id}

*/
router.get("/:id", (req, res) => {
  Exam.findOne({ _id: req.params.id }, (err, found) => {
    if (!err) {
      //console.log(found);
      res.status(200).json(found);
    }
    else {
      console.log(`Error : ${err}`);
    }
  })
})

/*
Used to update a specific exam
This route is never used
*/

router.put("/:id", (req, res) => {
  console.log('req---', req.body, req.params.id);
  Exam.findByIdAndUpdate(req.params.id, { ...req.body }, (err, found) => {
    if (!err) {
      //console.log(found);
      res.status(200).json(found);
    }
    else {
      console.log(`Error : ${err}`);
    }
  })
})


/*
Can reschedule an exam
This route is never used

call as:
       localhost:3000/reschedule/{Exam id}
*/

router.put('/reschedule/:id', (req, res) => {
  Exam.find({
    _id: req.params.id
  }, (err, found) => {
    if (!err) {
      const updatedMinutes = parseInt(req.body.updatedMinutes) * 60000;
      // console.log(updatedMinutes);
      var tempArray = []
      var checker = 0;
      found[0].details.forEach(element => {
        var newStartTime = new Date(element.startTime).getTime();
        var newEndTime = new Date(element.endTime).getTime();
        if (parseInt(element.registrationNumber) === parseInt(req.body.registrationNumber)) {
          // console.log("Paisi");
          checker = 1;
        }
        if (checker === 1) {
          newStartTime = new Date(parseInt(newStartTime) + updatedMinutes);
          newEndTime = new Date(parseInt(newEndTime) + updatedMinutes);
        }
        const data = {
          startTime: new Date(newStartTime).toLocaleTimeString(),
          endTime: new Date(newEndTime).toLocaleTimeString(),
          registrationNumber: element.registrationNumber
        }
        tempArray.push(data);
      });
      // console.log(tempArray);
      found[0].details = tempArray;
      found[0].save(err => {
        if (!err) {
          res.status(200).json("Rescheduled Successfully");
        }
      })
    } else {
      console.log(err);
      res.status(404).json(`Error:${err}`)
    }
  })
});

/*
For deleting an exam
Never used

Use as: localhost:3000/delete/{Exam id}

*/
router.delete("/delete/:id", (req, res) => {
  Exam.deleteMany({ _id: req.params.id }, (err) => {
    if (!err) {
      res.status(200).json("Exam deleted Successfully");
    }
    else {
      res.status(404).json(`Error:${err}`);
    }
  })
})

/*
For deleting questions asked in viva
Never used
*/
router.delete("/deleteQuestion/:id", (req, res) => {
  try{
    Viva.deleteMany({ _id: req.params.id }, (err) => {
      if (!err) {
        res.status(200).json("Deleted Successfully!!");
      }
      else {
        res.status(404).json(`Error:${err}`);
      }
    })
  }
  catch(err)
  {

  }
})



/*
Called when student sends join request to a specific exam
Send params as:
          Student email -> req.body.email
          Exam id -> req.body.id

Call as: localhost:3000/joinRequest
*/

router.post('/joinRequest',async(req, res) => {
  // req.body.email
  // req.body.id
  const email = req.body.email
  const user = await User.findOne({email: email});
  const regNo = user.registrationNo
  const id = req.body.id
  const exam = await Exam.findOne({_id: id});
  const ara = exam.requested.concat(exam.ended);
  ara.push(exam.currentReg);
  let inTheList = false;
  exam.details.forEach(detail => {
    if (String(detail.registrationNumber) === (user.registrationNo)) {
      inTheList = true;
    }
  })
  if (!inTheList) {
    return res.status(200).json({
      error: true,
      message: "You don't have permission to this exam",
    });
  }
  var i;
  for(i = 0 ; i < ara.length ; i++) {
    if(ara[i] == regNo) {
        return res.status(200).json(exam);
    }
  }
  const newReqArray = exam.requested;
  newReqArray.push(regNo);
  try {
    await Exam.findOneAndUpdate({_id: id}, {requested: newReqArray}, {new: true}, (error, Data) =>{
        console.log("Exam updated");
        return res.status(200).json(Data);
    });
  } catch(err) {
    console.log("Error while join req!")
      return res.status(404).json('Error');
  } 
});

/*

Teacher adds a student to the exam
This route can only be used by a teacher***
Send params as: 
              Student registation number -> req.body.registrationNo
              Exam id ->  req.body.id

call as: locahost:3000/approveStudent
*/

router.post('/approveStudent', async(req,res) => {
  // Send registrationNo and Exam ID

  const regNo = req.body.registrationNo
  const id = req.body.id
  const exam = await Exam.findOne({_id: id});
  let currentStudent = exam.currentReg

  /// 1. send current to last
  /// 2. then set current student

  // 1. Below:

  let ara = exam.ended;
  let ara1 = exam.requested
  if(currentStudent != null) {
    ara.push(currentStudent);
  }
  else {
    currentStudent = regNo
  }
  
  var index = 0;
  var i;
  for(i = 0 ; i < ara1.length ; i++) {
    if(ara1[i] == regNo) {
      index = i
      break
    }
  }

  /// remove regNo from requested
  ara1.splice(index, 1); // removing exactly 1 item


  try {
    const nowDetails = (exam.details || []).map(detail => {
      if (detail.registrationNumber === regNo) {
        detail.startTime = Date.now();
      }
      return detail;
    })
    const Data = await Exam.findOneAndUpdate({_id: id}, {ended : ara, currentReg: regNo, requested: ara1, details: nowDetails}, {new: true})
    const viva = await Viva.find({examId: id, registrationNumber: currentReg});
    if (!viva) {
      await Viva.create({
          examId: id,
          registrationNumber: currentReg,
          questions: [],
          marks: 0,
          startTime: Date.now(),
      });
    }
    return res.status(200).json(Data);
  } catch(err) {
      return res.status(404).json('Error');
  } 
});

/*
Used for removing a student from exam
This route can only be used by a teacher
Send params as:
            Exam id -> req.body.id
Call as: localhost:3000/endExamForStudent

*/


router.post('/endExamForStudent', async(req,res) => {
  const id = req.body.id
  try {
    const exam = await Exam.findOne({_id: id});
    const regNo = exam.currentReg;
    await Viva.findOneAndUpdate({ examId: id, registrationNumber: regNo }, { isEnded: true, endTime: Date.now() });
    const updateObj = await updateOthersSchedule(exam, exam.currentReg);
    updateObj.$push = { ended: regNo };
    updateObj.currentReg = null; 
    await Exam.findOneAndUpdate({_id: id}, updateObj, {new: true}, (error, Data) =>{
        console.log("Exam updated");
        return res.status(200).json(Data);
    });
    
  } catch(err) {
      console.log(err);
      return res.status(404).json('Error');
  } 
});

/*

For taking a break during viva

Send params as:

           Exam id -> req.body.id
           viva break duration -> req.body.breakDuration

call as: localhost:3000/vivaBreak
*/

router.post('/vivaBreak', async(req,res) => {
  const { id, breakDuration } = req.body
  try {
    const exam = await Exam.findOne({_id: id});
    const updateObj = await updateOthersScheduleForBreak(exam, breakDuration || 0);
    await Exam.findOneAndUpdate({_id: id}, updateObj, {new: true}, (error, Data) =>{
        console.log("Exam updated");
        return res.status(200).json(Data);
    });
  } catch(err) {
      console.log(err);
      return res.status(404).json('Error');
  }
});

/*
Used to help frontend to get students status

Data passed as:
            Student email -> req.body.email
            Registration number -> req.body.regstrationNo
            Exam id -> req.body.id

*/


router.post('/verifyPermission', async(req, res) => {
  try{
    const email = req.body.email
    const user = await User.findOne({email: email});
    const regNo = user.registrationNo
    const id = req.body.id
    const exam = await Exam.findOne({_id: id});
    const current = exam.currentReg
    const { ended, details } = exam;
    const filteredEnded = _.filter(ended, reg => String(reg) === String(user.registrationNo));
    const filteredDetailed = _.filter(details, ({ registrationNumber }) => {
      console.log('---------', registrationNumber);
      return String(registrationNumber) === String(user.registrationNo);
    });
    console.log('------hi', filteredDetailed, filteredDetailed.length);
    let permission = false;
    if (filteredDetailed.length === 0) {
      return res.status(200).json({
        permission: false,
        status: 'noperm',
        details,
      });
    } else {
      permission = true;
    }
    if (filteredEnded.length) {
      return res.status(200).json({
        permission,
        status: 'ended',
        details,
      });
    }
    if(regNo == current) {
      return res.status(200).json({
        permission,
        status: 'running',
        details,
      });
    }
    return res.status(200).json({
      permission,
      status: 'waiting',
      details,
    });
  }
  catch(err)
  {
    return res.status(404).json({permission: false});
  }
})


/*

Used to remove a student from the waiting list of exam
Send params as:
          Student Registration Number -> req.body.registrationNo
          Exam id -> req.body.id

Call as: locahost:3000/rejectStudent
*/

router.post('/rejectStudent', async(req,res) => {
  console.log("reject");
  // Send registrationNo and Exam ID
  /// REJECTS A STUDENT FROM exam
  const regNo = req.body.registrationNo
  const id = req.body.id
  const exam = await Exam.findOne({_id: id});
 
  /// 1. send current to last
  /// 2. then set current student
 
  // 1. Below:
 
  let ara1 = exam.requested
 
  var index = 0;
  var i;
  for(i = 0 ; i < ara1.length ; i++) {
    if(ara1[i] == regNo) {
      index = i
      break
    }
  }
 
  /// remove regNo from requested
  ara1.splice(index, 1); // removing exactly 1 item
  
  try {
    await Exam.findOneAndUpdate({_id: id}, {requested: ara1}, {new: true}, (error, Data) =>{
        console.log("Exam updated");
        return res.status(200).json(Data);
    });
  } catch(err) {
    console.log(err);
      return res.status(404).json('Error');
  } 
});

/*
For frontend to know which student is currently in the exam
Send params as: 
              Exam id -> req.body.id

Call as: localhost:3000/getCurrentReg
*/


router.post('/getCurrentReg', async(req,res)=>{
  try{
    const id = req.body.id;
    const exam = await Exam.findOne({_id:id});
    let currentReg =exam.currentReg;
    if(currentReg===null)
      currentReg = 'None';
    return res.status(200).json({currentReg: currentReg});
  }
  catch(err){
    return res.status(404).json({currentReg: null});
  }
})

module.exports = router
