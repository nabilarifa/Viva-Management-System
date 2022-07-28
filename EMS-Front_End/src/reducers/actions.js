import { SET_CURRENT_EXAM, SET_CURRENT_VIVA, SET_TEACHER_MODE, SET_USER, UPDATE_DASHBOARD } from './constants'

export const setUserAction = (user) => ({
  type: SET_USER,
  user
})

export const setTeacherMode = (teacherMode) => ({
  type: SET_TEACHER_MODE,
  teacherMode,
})

export const setCurrentExam = (exam) => ({
  type: SET_CURRENT_EXAM,
  exam,
})

export const setCurrentViva = (viva) => ({
  type: SET_CURRENT_VIVA,
  viva,
})

export const onUpdateDashBoard = (updateDashBoard) => {
  return {
    type: UPDATE_DASHBOARD,
    updateDashBoard,
  }
}
