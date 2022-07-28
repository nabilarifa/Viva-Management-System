/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import postData from '../methods/postMethod';
import { useParams } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import { Typography, Button, Divider } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import { connect } from 'react-redux';
import { setCurrentViva } from '../reducers/actions';
import { getViva } from '../utils/api';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#cff8fc',
        flexGrow: 1,
        height: '90vh',
        // overflowY: 'scroll',
    },
    parent: {
        minWidth: 200,
        margin: "2%",
        boxShadow: theme.shadows[5],
    },
    question: {
        fontSize: 17,
    },
    container: {
        // backgroundColor: 'red',
        width: '65vw',
        overflowY: 'scroll',
    },
    title: {
        fontSize: 26,
        paddingTop: '35vh',
        paddingLeft: '22vw',
    }
}));




function StudentView({ dispatch, user }) {
    const classes = useStyles();
    const [permission, setPermission] = useState(false);
    const [status, setStatus] = useState(false);

    let { id } = useParams();


    const [questions, setQuestions] = useState([]);
    useEffect(async () => {
        const viva = await getViva(id, user.registrationNo);
        dispatch(setCurrentViva(viva.body || {}));
    }, [user]);
    async function loadQuestion() {
        const response = await postData(`/exam/verifyPermission`, { email: localStorage.getItem('email'), id: id })
        if (response.status === 200) {
            const {
                permission,
                status,
            } = response.body;
            setPermission(permission);
            setStatus(status);
        }

        const res = await postData(`/viva/getVivaHistory`, { id: id })
        if (res.status === 200) {
            const { questions } = res.body;
            const newState = questions.map(element => {
                element.inputComment = "";
                return element;
            })
            setQuestions(newState);
        }
    }

    useEffect(() => {


        const id = setInterval(loadQuestion, 800);
        loadQuestion();
        return () => {
            clearInterval(id);
        }
    }, [])


    let msg = '';
    switch (status) {
        case 'noperm':
            msg = "You don't have permission to enter exam";
            break;
        case 'waiting':
            msg = "You are in the waiting list";
            break;
        case 'ended':
            msg = "Your exam has ended";
            break;
        default:
            break;
    }

    let component;
    if (status !== 'running') {
        component = (
            <div className={classes.root}>
                <div className={classes.container}>
                    <Typography className={classes.title} color="textPrimary" gutterBottom>{msg}</Typography>
                </div>
            </div>
        )
    } else {
        component = (
            <div className={classes.root}>
                <div className={classes.container}>
                    {
                        questions &&
                        questions.map((element, idx) => (
                            <Card className={classes.parent}>
                                <CardContent >
                                    <Typography className={classes.question} color="textPrimary" gutterBottom>{element.question}</Typography>
                                    <Divider /><Divider />

                                </CardContent>
                            </Card>))
                    }
                </div>

            </div>)
    }

    return (
        <div>
            {component}
        </div>
    )
}


const mapStateToProps = state => ({
    user: state.app.user
})
  
const mapDispatchToProps = dispatch => ({
    dispatch
})
  
export default connect(mapStateToProps, mapDispatchToProps)(StudentView);
  