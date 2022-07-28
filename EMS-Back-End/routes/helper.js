const _ = require('underscore');
const moment = require('moment');
const Viva = require('../model/Viva');

/*

Helper function used to update the schedules of students that are in scheduled list when teacher takes a break

*/

exports.updateOthersSchedule = async (exam, currentReg) => {
  const detailsToUpdate = [];
  const details = await Promise.all(_.map(exam.details, async detail => {
    const viva = await Viva.findOne({ examId: exam._id, registrationNumber: detail.registrationNumber});
    if (!viva) return detail;
    if (String(detail.registrationNumber) === String(currentReg)) {
      detail.endTime = Date.now();
      return detail;
    }
    if (viva.isEnded) return detail;
    detailsToUpdate.push(detail);
    return detail;
  }));
  detailsToUpdate.sort((a, b) => {
    if (Number(a.registrationNumber) < Number(b.registrationNumber)) return -1;
    if (Number(a.registrationNumber) > Number(b.registrationNumber)) return 1;
    return 0;
  });
  const firstDetail = detailsToUpdate[0];
  if (!firstDetail)
    return { details };
  const diffInMinutes = moment().diff(firstDetail.startTime, 'minutes');
  detailsToUpdate.forEach(detail => {
    detail.startTime = moment(detail.startTime).add(diffInMinutes, 'minutes');
    detail.endTime = moment(detail.endTime).add(diffInMinutes, 'minutes');
  });

  return { details };
}

// this.updateOthersSchedule({
//   _id: '60d4221e6cc40fed68f5b662',
//   details: [                                                                                                                                                                                   
//     {                                                                                                                                                                                                        
//       "startTime": "2021-06-24T06:12:19.190Z",                                                                                                                                                               
//       "endTime": "2021-06-24T06:17:18.190Z",                                                                                                                                                                 
//       "registrationNumber": "2015331005"                                                                                                                                                                     
//     },                                                                                                                                                                                                       
//     {                                                                                                                                                                                                        
//       "startTime": "2021-06-24T06:17:19.190Z",                                                                                                                                                               
//       "endTime": "2021-06-24T06:22:18.190Z",                                                                                                                                                                 
//       "registrationNumber": "2015331006"                                                                                                                                                                     
//     },                                                                                                                                                                                                       
//     {                                                                                                                                                                                                        
//       "startTime": "2021-06-24T06:22:19.190Z",                                                                                                                                                               
//       "endTime": "2021-06-24T06:27:18.190Z",                                                                                                                                                                 
//       "registrationNumber": "2015331007"                                                                                                                                                                     
//     },                                                                                                                                                                                                       
//     {                                                                                                                                                                                                        
//       "startTime": "2021-06-24T06:27:19.190Z",                                                                                                                                                               
//       "endTime": "2021-06-24T06:32:18.190Z",                                                                                                                                                                 
//       "registrationNumber": "2015331008"                                                                                                                                                                     
//     },                                                                                                                                                                                                       
//     {                                                                                                                                                                                                        
//       "startTime": "2021-06-24T06:32:19.190Z",                                                                                                                                                               
//       "endTime": "2021-06-24T06:37:18.190Z",                                                                                                                                                                 
//       "registrationNumber": "2015331009"                                                                                                                                                                     
//     }                                            
//   ]
// })

/*

Helper function to update one student

*/

exports.updateOthersScheduleForBreak = async (exam, durationOfBreak) => { // durationOfBreak in minutes
  const detailsToUpdate = [];
  const details = await Promise.all(_.map(exam.details, async detail => {
    const viva = await Viva.findOne({ examId: exam._id, registrationNumber: detail.registrationNumber, isEnded: false });
    if (!viva) return detail;
    if (String(detail.registrationNumber) === String(exam.currentReg)) return detail;
    detailsToUpdate.push(detail);
    return detail;
  }));
  detailsToUpdate.forEach(detail => {
    detail.startTime = moment(detail.startTime).add(durationOfBreak, 'minutes');
    detail.endTime = moment(detail.endTime).add(durationOfBreak, 'minutes');
  });
  return { details };
}