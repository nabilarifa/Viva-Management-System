import './App.css';
import jwt from 'jsonwebtoken';
import React, { useState, useEffect } from 'react';
import FrontPage from './authentication/frontPage';
import HomePage from './home/homePage';
import EnterExam from './Exams/enterExam';
import { Switch, Route } from "react-router";
import { connect } from 'react-redux';
import { setTeacherMode, setUserAction } from './reducers/actions';
import ExamDetails from './Exams/examDetails';
import Profile from './home/profile';
import QuestionBank from './QuestionBank/questionBank';
import Loading from './common/Loading';
const App = ({ user, dispatch }) => {
  const isLoggedIn = user.email;
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    if (!user.email && localStorage.token) {
      try {
        console.log('decoded', jwt.decode(localStorage.token))
        const userObj = jwt.decode(localStorage.token);
        dispatch(setUserAction(userObj))
        dispatch(setTeacherMode(userObj.teacherMode))
      } catch (e) {}
      setLoading(false);
    }
  }, [user.email, localStorage.token]);
  
  const [page, setPage] = useState(<div></div>);
  // useEffect(() => {
  //   const url = window.location.pathname;
  //   if (url === '/') setPage(HomePage);
  //   if (url.includes('enter')) setPage(EnterExam);
  // }, [window.location.pathname])
  if (isLoggedIn) {
    // return <Switch><Route path="*" component={page} /></Switch>;
    return (
      <Switch>
        <Route
          path='/enter/:id'
          component={EnterExam}
        />
        <Route
          path='/details/ended/:id'
          component={ExamDetails}
        />
        <Route
          path='/details/:id'
          component={ExamDetails}
        />
        <Route
          path='/profile/:id'
          component={Profile}
        />
        <Route
          path='/questionBank'
          component={QuestionBank}
        />
        <Route
          path='/'
          component={isLoading ? Loading : HomePage}
        />
      </Switch>
    )
  }
  else
  return (
    <Switch>
        <Route
          path='/'
          component={isLoading ? Loading : FrontPage}
        />
      </Switch>
  )

}
const mapStateToProps = state => ({
  user: state.app.user,
})
const mapDispatchToProps = dispatch => ({
  dispatch,
})

export default connect(mapStateToProps, mapDispatchToProps) (App);

