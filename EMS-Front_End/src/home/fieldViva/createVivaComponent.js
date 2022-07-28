
import React, { useState } from 'react';
import { Button, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NameTitle from './pairTextField'
import DatePicker from './datePicker';
import TextField from '@material-ui/core/TextField';
import RegPicker from './regPicker';

const useStyles = makeStyles((theme) => ({

    root: {
        // backgroundColor: 'red',
        backgroundColor: '#edfff8',
        border: '0.5px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        width: 600,
        height: 500,
    },
    title: {
        // alignItems: 'center',
        // flex:'center',
        display: 'flex',
        justifyContent: 'center',
        padding: theme.spacing(2),
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Times'
    },
    buttonDiv: {
        // background:'red',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

}));

const initialVivaInfo = {
    courseCode: null,
    courseTitle: null,
    startingRegNo: null,
    endingRegNo: null,
    date: null,
    startTime: null,
    examDuration: null,
}



function validateForm(vivaInfo, setVivaInfo) {
    let tempInfo = { ...vivaInfo };
    let isOk = true;
    console.log(tempInfo)
    for (const item in vivaInfo) {
        if (tempInfo[item] === null || tempInfo[item] === '') {
            tempInfo[item] = '';
            isOk = false;
        }
    }
    console.log(tempInfo)
    setVivaInfo(tempInfo)
    return isOk;
}


export default function CreateVivaComponent(props) {

    const classes = useStyles();
    const [vivaInfo, setVivaInfo] = useState(initialVivaInfo);
    const [step, setStep] = useState(0);
    const { setVivaModal } = props.state;

    function handleChange(event) {
        const { name, value } = event.currentTarget
        setVivaInfo({ ...vivaInfo, [name]: value })
    }


    const state = {
        vivaInfo: vivaInfo,
        setVivaInfo: setVivaInfo,
        setVivaInfo: setVivaInfo,
        handleChange: handleChange,
        step: step,
        setStep: setStep,
        setVivaModal: setVivaModal,
    };


    function submitAction() {
        if (validateForm(vivaInfo, setVivaInfo)) {
            setStep(1);
        }
    }
    const body = ( step===0  ? <div className={classes.root}>
        <div className={classes.title}>
            <Typography className={classes.title}>Create New Viva</Typography>
        </div>
        <div>
            <NameTitle state={{ ...state, name1: 'courseCode', name2: 'courseTitle' }} myLabel={{ label1: 'Course Code', label2: 'Title' }} />
            <br />
            <NameTitle state={{ ...state, name1: 'startingRegNo', name2: 'endingRegNo' }} myLabel={{ label1: 'Starting Registration No.', label2: 'Ending Registration No.' }} />
            <DatePicker state={{ ...state, name1: 'date', name2: 'startTime' }} />
            <br />
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField error={vivaInfo.examDuration === '' ? true : false}
                            variant="outlined" name='examDuration' onChange={handleChange}
                            required fullWidth label='Viva Duration(in minute)' autoFocus
                            value={vivaInfo.examDuration === null ? '' : vivaInfo.examDuration}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <br />
            <br />
        </div>
        <div className={classes.buttonDiv}>
            <Button color="primary" variant="contained" onClick={() => submitAction()} >Create Viva</Button>
            <Button color="secondary" onClick={() => setVivaModal(false)} className={classes.cancelButton} variant="contained" >Cancel</Button>
        </div>

    </div>  : <RegPicker state={state}/> )
    return (
        <div>
            {body}
        </div>
    )
}