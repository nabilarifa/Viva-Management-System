
import React, { useState } from 'react';
import { connect } from 'react-redux'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Container from '@material-ui/core/Container';
import useStyles from './formStyle';

import Name from './field/name';
import Email from './field/email';
import Password from './field/password';
import RegistrationNo from './field/registrationNo';
import TeacherMode from './field/teacherMode';
import Copyright from './field/copyright';
import postData from '../methods/postMethod'
import getData from '../methods/getMethod';

import AlertDialog from '../alertBox';
import { setTeacherMode, setUserAction } from '../reducers/actions';


const initialInfo = {
  firstName: null,
  lastName: null,
  email: null,
  password: null,
  teacherMode: false,
  teacherPass: null,
  registrationNo: null,
}

const signInMode = ['email', 'password'];
const signUpMode = ['firstName', 'lastName', 'teacherMode', 'teacherPass','registrationNo'];


function validateForm(formMode, info, setInfo) {
  let result = true;
  const tmpData = { ...info }
  for (let item of signInMode) {
    if (tmpData[item] === null || tmpData[item] === '') {
      tmpData[item] = '';
      result = false;
    }
  }
  if (formMode === 'signUp') {
    for (let item of signUpMode) {
      if (item === 'teacherPass') {
        if (tmpData.teacherMode && (tmpData.teacherPass === null || tmpData.teacherPass === '')) {
          tmpData[item] = '';
          result = false;
        }
      } else if (item === 'registrationNo') {
        if (!tmpData.teacherMode && (tmpData.registrationNo === null || tmpData.registrationNo === '')) {
          tmpData[item] = '';
          result = false;
        }
      }
      else if ((tmpData[item] === null || tmpData[item] === '')) {
        tmpData[item] = '';
        result = false;
      }
    }
  }
  setInfo(tmpData);
  return result;
}



const FormPage = ({ formMode, setFormMode, dispatch, teacherMode  }) => {
  const classes = useStyles();
  const [alertBox, setAlertBox] = useState(false);
  const [errorMsg, setErrorMsg] = useState('Nothing!');

  const [info, setInfo] = useState(initialInfo);

  function handleChange(event) {
    const { name, value, type, checked } = event.currentTarget
    type === "checkbox" ? setInfo({ ...info, [name]: checked }) : setInfo({ ...info, [name]: value })
  }

  async function submitAction(event) {

    console.log('hi', formMode, info);
    if (validateForm(formMode, info, setInfo)) {
      // FETCH DATA
      if (formMode === 'signIn') {
        const res = await postData('/logIn', info);
        if (res.status===200) {
          localStorage.setItem('token', res.body.token);
          localStorage.setItem('email', res.body.email);
          localStorage.setItem('teacherMode',res.body.teacherMode);
          dispatch(setUserAction(res.body));
          console.log('here also', res.body);
          dispatch(setTeacherMode(res.body.teacherMode));
          setFormMode('');
        }
        else {
          setErrorMsg(res.body);
          setAlertBox(true);
        }
      }
      else {
        const res = await postData('/signUp', info);
        if (res.status === 200)
          setFormMode('');
        else {
          setErrorMsg(res.body);
          setAlertBox(true);
        }
      }
    }
  }

  return (
    <div>
      <AlertDialog state={{ open: alertBox, setOpen: setAlertBox, description: errorMsg }} />
      {/* <ArrowBackIcon margin={2} onClick={(event) => setFormMode('')}></ArrowBackIcon> */}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}><LockOutlinedIcon /></Avatar>
          <Typography component="h1" variant="h5">{formMode === 'signIn' ? 'Log In' : 'Sign Up'}</Typography>

          <form className={classes.form} noValidate>
            <Grid container spacing={2}>

              {formMode === "signUp" && <Name handleChange={handleChange} info={info} />}
              <Email handleChange={handleChange} info={info} />
              <Password handleChange={handleChange} info={info} name='password' label='Password' />
              {formMode === 'signUp' && <TeacherMode info={info} handleChange={handleChange} />}
              {formMode === 'signUp' && info.teacherMode && <Password handleChange={handleChange} info={info} name='teacherPass' label="Teacher's Private Password" />}
              {formMode === 'signUp' && !info.teacherMode && <RegistrationNo handleChange={handleChange} info={info} />}
            </Grid>
            <Button
              // type="submit"
              onClick={(event) => submitAction(event)} fullWidth variant="contained" color="primary" className={classes.submit}>
              {formMode === 'signIn' ? 'Log In' : 'Sign Up'}
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link style={{ cursor: 'pointer' }} onClick={(event) => setFormMode(formMode === 'signIn' ? 'signUp' : 'signIn')} variant="body2">
                  {formMode === 'signIn' ? `Don't have an account? Sign Up` : 'Already have an account? Sign in'}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Copyright />
      </Container>
    </div>
  );
}

const mapStateToProps = state => ({})
  
const mapDispatchToProps = dispatch => ({
    dispatch
})
  
export default connect(mapStateToProps, mapDispatchToProps)(FormPage);
  