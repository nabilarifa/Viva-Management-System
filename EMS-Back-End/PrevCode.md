// router.get('/currentExam', async (req,res) => {
//     //return res.json('Current exam');
//     const allexams = await Exam.find({});
//    // return res.json(allexams);
//     var running = []
//     var ended = []
//     var scheduled = []
//     var i;
//   // console.log(allexams.length);
//     for(i = 0 ; i < allexams.length ; i++) {

//         // test this whole thing by creating Dummy date
//         // -> Do it within today you good for nothing useless piece of shit
//         let obj = allexams[i]
//         // obj.att -> that's how it is accessed
//         let year = obj.date.getFullYear()
//         let month = obj.date.getMonth()
//         let day = obj.date.getDate()
//         let hours = obj.startTime.getHours()
//         let mins = obj.startTime.getMinutes()
//         let sec = obj.startTime.getSeconds()

//         // Obj's viva duration
//         duration = obj.examDuration /// in minutes actually

//         addedhours = hours + parseInt((duration + mins) / 60)

//         if(addedhours >= 13) {
//             addedhours += 1
//         }
//        // duration %= 60

//         addedmins = (mins + duration) % 60 /// Mins koto baarlo

//         addedday = day
//         addedmonth = month
//         addedyear = year
//         if(addedhours > 24) {
//             addedhours -= 24
//             addedday += 1
//         }
//         if(addedday > 30) {
//             addedday -= 30
//             addedmonth += 1
//         }
//         if(addedmonth > 12) {
//             addedmonth -= 12
//             addedyear += 1
//         }

//         let begin = new Date(year, month, day, hours, mins, sec)
//         let end = new Date(addedyear, addedmonth, addedday, addedhours, addedmins, sec)
//         /// Exam begin, Exam curr ,Exam end
//         let current = new Date()

//         /// start Date and Time
//        // startDate = String(begin.getFullYear()) + "-" + String(begin.getMonth() + 1) + "-"
//         setDate = String(begin.getDate())
//         var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
//         setDate = setDate + " " + months[begin.getMonth()] + ", " + String(begin.getFullYear())
//         startTime = begin.getHours()
//         setTime = ""
//         if(startTime > 12) {
//             startTime -= 12
//             setTime = String(startTime) +":" + String(begin.getMinutes()) + " PM"
//         }
//         else {
//             setTime = String(startTime) + ":" + String(begin.getMinutes()) + " AM"
//         }

//         endTime = end.getHours()
//         setEndTime = ""
//         if(endTime > 12) {
//             endTime -= 12
//             setEndTime = String(endTime) + ":" + String(end.getMinutes()) + " PM"
//         }
//         else {
//             setEndTime = String(endTime) + ":" + String(end.getMinutes()) + " AM" 
//         }
//         // End time

//         obj1 = {
//             courseTitle: obj.courseTitle,
//             courseCode: obj.courseCode,
//             startTime: setTime,
//             endTime: setEndTime,
//             date: setDate,
//             courseTeacher: obj.courseTeacher,
//             regList: obj.regList
//         }

//         if(current >= begin && current <= end) {
//             running.push(obj1)
//             console.log("Running")
//         }
//         else if(end < current) {
//             ended.push(obj1)
//             console.log("Ended")
//         }
//         else if(begin > current) {
//             scheduled.push(obj1)
//             console.log("Scheduled")
//         }
//     } 

//     data = {
//         runningExam: running,
//         finishedExam: ended,
//         upcomingExam: scheduled
//     }
//     console.log(data);
//     console.log(obj1);
//     return res.status(200).json(data)
//    // return res.json("Testing API")
// });
// router.post('/create', async(req, res) => {
//     // When an exam is created, i'll also pass the starting students id and ending students id
//     const exam = new Exam({
//         courseTitle: req.body.courseTitle,
//         courseCode: req.body.courseCode,
//         date: req.body.date,
//         startTime: req.body.startTime, // Stored as an object
//         examDuration: req.body.examDuration , /// Viva Duration per person
//         courseTeacher: req.body.courseTeacher,
//         regList: req.body.regList,
//         requested: req.body.requested
//     });

//     // 10:04

//     try {
//         await exam.save();
//         return res.status(200).json('Exam creation done');
//     } catch(err) {
//         console.log(err);
//         return res.status(404).json('Error creating exam');
//     }

//     //Access temp._id 
// });