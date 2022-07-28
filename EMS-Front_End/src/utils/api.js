import getData from "../methods/getMethod";

export const getExamByID = (id) => getData('/exam/'+id);
export const getViva = (examId, registrationNumber) => getData(`/viva?examId=${examId}&registrationNumber=${registrationNumber}`);
