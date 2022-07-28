



import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { IconButton, Typography, Button, Divider } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';
import DeleteIcon from '@material-ui/icons/Delete';

import { useParams } from 'react-router-dom';
import postData from '../../methods/postMethod';
import { connect } from 'react-redux';
import moment from 'moment';
import { Center } from '../../utils/styles';
import { FormatListNumbered } from '@material-ui/icons';
import { formatTimeFromSeconds } from '../../utils/comon.functions';
import styled from 'styled-components';


const StyledListItem = styled(ListItem)`
    box-shadow: 1px 1px 3px #bcbcbc;
    margin-bottom: 10px;
`;



const useStyles = makeStyles((theme) => ({
    top: {
        height: '30%',
        // backgroundColor: 'green',
    },
    root: {

        height: '100%',
        width: '100%'
    },
    stopwatch: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Times',
    },
    title: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 12,
        paddingBottom: 12,
        fontSize: 19,
        fontWeight: 'bold',
        fontFamily: 'Times',
    },
    container: {
        // justifyContent: 'flex-start',
        display: "flex"
    },
    outline: {
        height: '70vh',
        boxShadow: theme.shadows[3],
    },

    bank: {
        overflowY: 'scroll',
        height: '62%',
    },
    question: {
        fontFamily: 'Times',
        fontSize: 15,
        justifyContent: 'flex-start',
        display: "flex"
    },
    icon: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        display: "flex",
    }


}));



const LeftNavBar = ({ exam, viva, user, state, stopWatchTime, setStopWatchTime }) => {
    const classes = useStyles();
    const [bank, setBank] = useState([]);
    const [alive, setAlive] = useState(0);
    const { render, setRender } = state;
    useEffect(() => {
        loadBank();
    }, [render]);
    let { id } = useParams();
    async function loadBank() {
        const res = await postData(`/question/getBank`, { email: localStorage.getItem('email') });
        console.log('helo', res);
        if (res.status === 200) {
            setBank(res.body);
        }
    }

    // useEffect(() => {
    //     if (viva) {
    //         const seconds = moment().diff(viva.startTime, 'seconds');
    //         console.log('---viva', viva, seconds);
    //         setStopWatchTime(seconds)
    //     }
    // }, [viva])

    useEffect(() => {
        setTimeout(() => {
            // if (exam.currentReg && exam.currentReg !== 'None')
            const seconds = moment().diff(viva.startTime, 'seconds');
            setStopWatchTime(seconds)
            setAlive(alive+1);
        }, 1000)
    }, [alive, viva.startTime])

    useEffect(() => {
        // const id = setInterval(loadBank,1000);
        loadBank();
        return () => {
            clearInterval(id);
        }
    }, []);

    return (
        <div className={classes.root} >
            <div className={classes.top}>

                <div className={classes.stopwatch}>
                    <Typography className={classes.stopwatch}> {(exam.courseCode || '') + ' ' + (exam.courseTitle || '')} </Typography>
                </div>
                <Divider /><Divider /><Divider />
                <div className={classes.title}>
                    <Typography className={classes.title}> Question Bank </Typography>
                </div>
            </div>
            {/* <Divider /><Divider /><Divider /> */}
            <List className={classes.bank}>
                {
                    bank.map(question => (
                        // <div >
                        <StyledListItem className={classes.container}>
                            <Divider className={classes.divide} />
                            <div className={classes.question}>
                                <Typography className={classes.question}> {question} </Typography>
                            </div>
                            <div className={classes.icon}>
                                <IconButton onClick={async () => {
                                    await postData(`/viva/postQuestion`, {
                                        question: question, 
                                        authorEmail: user.email,
                                        authorName: user.firstName + ' ' + user.lastName,
                                        id: id
                                    });
                                    setRender((render + 1) % 100000);
                                }}>
                                    <ArrowForwardRoundedIcon color="primary" />
                                </IconButton>
                                <IconButton onClick={async () => {
                                    await postData('/question/deleteQuestion', { question: question, email: localStorage.getItem('email') })
                                    setRender((render + 1) % 100000);
                                }}>
                                    <DeleteIcon color="secondary" />
                                </IconButton>
                            </div>
                        </StyledListItem>
                    ))
                }
            </List>
        </div>)
}


const mapStateToProps = (state) => {
    return {
        user: state.app.user,
        exam: state.app.exam,
        viva: state.app.viva,
    }
}
export default connect(mapStateToProps, null)(LeftNavBar)