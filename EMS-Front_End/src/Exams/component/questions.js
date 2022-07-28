
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import postData from '../../methods/postMethod';
import styled from 'styled-components';

import { Typography, Button, Divider } from '@material-ui/core';


const StyledTextField = styled(TextField)`
    .makeStyles-root-22 {
        background-color: transparent;
    }
`;
const useStyles = makeStyles((theme) => ({
    root: {
        // backgroundColor: 'green',
        height: '75vh',
        overflowY: 'scroll',
    },
    parent: {
        minWidth: 200,
        margin: "2%",
        boxShadow: theme.shadows[5],
    },
    // bullet: {
    //     display: 'inline-block',
    //     margin: '0 2px',
    //     transform: 'scale(0.8)',
    // },
    question: {
        fontSize: 17,
    },
    comment: {
        // paddingLeft: 20,
        // backgroundColor: 'red',
        // margin: "2%",
        paddingTop: 5,
        fontSize: 12,
    },
    inp: {
        // backgroundColor: 'green',
        minWidth: '85%'
    }

}));


export default function Questions(props) {
    const classes = useStyles();
    const { id, questions, setQuestions } = props.state;
    const { render, setRender } = props.state;

    
    async function loadQuestion() {
        const res = await postData(`/viva/getVivaHistory`, { id: id })
        if (res.status === 200) {
            const { questions } = res.body;
            if(questions === undefined)
            {

            }
            else
            {
                const newState = questions.map(element => {
                    element.inputComment = "";
                    return element;
                })
                console.log(newState === questions);
                setQuestions(newState);
            }
            
        }
    }
    
    useEffect(() => {
        // const id = setInterval(loadQuestion,3000);
        loadQuestion();
        return () => {
            clearInterval(id);
        }
    }, [])
    
    useEffect(()=>{
        loadQuestion();
    },[render]);
    
    // loadQuestion();
    
    
    return (
        <div className={classes.root}>
            {
                questions &&
                questions.map((element, idx) => (
                    <Card className={classes.parent}>
                        <CardContent >
                            <Typography className={classes.question} color="textPrimary" gutterBottom>{element.question}</Typography>
                            <Divider /><Divider />
                            <Typography className={classes.question} color="textPrimary" gutterBottom>Ask By {element.authorName}</Typography>
                            {
                                element.comments.map(reply =>
                                    <Typography className={classes.comment} color="textPrimary" gutterBottom>{reply.comment}</Typography>)
                            }
                        </CardContent>
                        {
                            <CardActions>
                                <StyledTextField style={{ backgroundColor: 'white' }} id="standard-basic" label="Write a comment. . ." value={element.inputComment}
                                    onChange={(event) => {
                                        let newState = [...questions];
                                        newState[idx].inputComment = event.currentTarget.value;
                                        setQuestions(newState);
                                    }} />
                                <Button  variant="contained" color="inherit" size="small" onClick={async () => {
                                    await postData('/viva/postComment', {
                                        id: id, question: element.question,
                                        comment: element.inputComment,
                                        email: localStorage.getItem('email')
                                    })
                                    setRender((render + 1) % 100000);
                                }}>Comment</Button>
                            </CardActions>
                        }
                    </Card>))
            }

        </div>
    )
}
