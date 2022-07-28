import produce from 'immer';
import { SET_CURRENT_EXAM, SET_CURRENT_VIVA, SET_TEACHER_MODE, SET_USER, UPDATE_DASHBOARD } from './constants'

const INITIAL_STATE = { user: {}, exam: {}, viva: {} };

const reducer = produce((draft, action) => {
  switch (action.type) {
    case SET_USER:
      draft.user = action.user
      break;
    case SET_TEACHER_MODE:
      draft.teacherMode = action.teacherMode;
      break;
    case SET_CURRENT_EXAM:
      draft.exam = action.exam;
      break;
    case SET_CURRENT_VIVA:
      draft.viva = action.viva;
      break;
    case UPDATE_DASHBOARD:
      draft.updateDashBoard = action.updateDashBoard;
      break;
    default:
      break;
  }
}, INITIAL_STATE)
export default reducer
