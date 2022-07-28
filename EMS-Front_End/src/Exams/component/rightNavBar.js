/* eslint-disable react-hooks/exhaustive-deps */


import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Typography, Button } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useParams } from 'react-router-dom';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import postData from '../../methods/postMethod';
import putData from '../../methods/putMethod';
import getData from '../../methods/getMethod';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import { Center } from '../../utils/styles';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { getViva } from '../../utils/api';
import { setCurrentExam, setCurrentViva } from '../../reducers/actions';
import examDetails from '../examDetails';

const useStyles = makeStyles((theme) => ({
    root: {
        // flexGrow: 1,
        height: '100%',
        // display: 'flex',
        // justifyContent: 'center',
        // minWidth: 200,
    },
    title: {
        // backgroundColor: 'yellow',
        display: 'flex',
        justifyContent: 'center',
        // paddingTop: 15,
        // paddingBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Times',
    },
    container: {
        overflowY: 'scroll',
        height: '62vh',
    },
    box: {
        boxShadow: theme.shadows[2],
        justifyContent: 'space-around',
        display: 'flex',
        width: 200,
        paddingLeft: 15,
        paddingRight: 15,
    },
    roll: {
        paddingLeft: 13,
        paddingTop: 13,
        borderBottom: 2,
        borderTop: 2,
    },
    outline: {
        // backgroundColor: 'green',
        height: '71vh',
        boxShadow: theme.shadows[3],
    },
    current: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Times',
    }
}));


const RightNavBar = (props) => {
    const { dispatch, exam } = props;
    const {setQuestions} = props.state;
    const [waitingList, setWaitingList] = useState([]);
    const [currentReg, setCurrentReg] = useState('None');
    const classes = useStyles();
    let { id } = useParams();
    
    useEffect(async () => {
        if (currentReg !== 'None') {
            const viva = await getViva(id, currentReg);
            console.log('-----viva', viva.body)
            dispatch(setCurrentViva(viva.body || {}));
        }
    }, [currentReg]);
    async function loadData(){
        const res = await getData(`/viva/waitingList/${id}`);
        if (res.status === 200)
        setWaitingList(res.body);
        const response = await postData('/exam/getCurrentReg',{id:id});
        if(response.status === 200)
        setCurrentReg(response.body.currentReg);
    }

    const { render, setRender } = props.state;
    const [showEndModal, setShowEndModal] = useState(false);
    const [showNeedABreakModal, setShowNeedABreakModal] = useState(false);
    const [breakDuration, setBreakDuration] = useState(5);
    useEffect(() => {
        loadData();
    }, [render]);
    
    useEffect(() => {
        const id = setInterval(loadData,3000);
        loadData();
        return () => {
            clearInterval(id);
        }
    }, []);

    async function handleClicked(roll) {
        const res = await postData(`/exam/approveStudent`, { id: id, registrationNo: roll })
        setRender((render + 1) % 100000);
    }

    async function removeStudent(){
        const res = await postData('/exam/endExamForStudent', {id:id});
        setQuestions([]);
        setCurrentViva({})
        setRender((render + 1) % 100000);
    }

    async function rejectStudent(roll){
        const res = await postData('/exam/rejectStudent', {id: id, registrationNo: roll});
        setRender((render + 1) % 100000);
    }
    const endExamHandler = async () => {
        const res = await putData(`/exam/${id}`, { isEnded: true });
        dispatch(push('/'));
        setShowEndModal(false)
    }

    const takeABreakHandler = async () => {
        await postData('/exam/vivaBreak', { id:id, breakDuration });
        setShowNeedABreakModal(false);
    }
    
    return (
        <div className={classes.root} >
            <div className={classes.current}>
                {currentReg !== 'None' && (
                    <>
                        <Typography className={classes.current}> Current Participant : {currentReg} </Typography>
                        <IconButton >
                            <ExitToAppRoundedIcon color="primary" onClick={()=>removeStudent()} />
                        </IconButton>
                    </>
                )}
                {currentReg === 'None' && (
                    <Typography className={classes.current}>
                        <Button onClick={() => setShowNeedABreakModal(true)} variant="contained" color="primary" >Need a break</Button>
                    </Typography>
                )}
            </div>
            <div className={classes.title}>
                <Typography className={classes.title}> Waiting Room </Typography>
            </div>
            <Divider />
            <div className={classes.outline} >
                <div className={classes.title}>
                    <div className={classes.container}>
                        {waitingList.map((roll) =>
                        (<div className={classes.box}>
                            <Typography className={classes.roll}>{roll}</Typography>
                            <IconButton onClick={() => handleClicked(roll)}>
                                <AddCircleIcon color="primary" />
                            </IconButton>
                            <IconButton onClick={() => rejectStudent(roll)}>
                                <CancelRoundedIcon color="secondary" />
                            </IconButton>
                            <br />
                        </div>))}
                    </div>
                </div>
            </div>

            <Center style={{ marginTop: '10px' }}>
                <Button color="secondary" onClick={() => setShowEndModal(true)} className={classes.cancelButton} variant="contained" >End Exam</Button>
            </Center>

            <Dialog
                open={showEndModal}
                onClose={() => setShowEndModal(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure, you want to end this exam?"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setShowEndModal(false)} color="primary">
                    No
                </Button>
                <Button onClick={() => endExamHandler()} color="primary" autoFocus>
                    Yes
                </Button>
                </DialogActions>
            </Dialog>


            <Dialog
                open={showNeedABreakModal}
                onClose={() => setShowNeedABreakModal(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"How long (minutes)?"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <TextField value={breakDuration} type="number" onChange={(e) => setBreakDuration(e.target.value)}></TextField>
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setShowNeedABreakModal(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => takeABreakHandler()} color="primary" autoFocus>
                    Confrim
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default connect(state => ({
    exam: state.app.exam,
}), dispatch => ({ dispatch })) (RightNavBar);