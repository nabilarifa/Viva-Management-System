

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography, Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({

    root: {
        backgroundColor: '#edfff8',
        border: '0.5px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        width: 500,
        height: 550,
    },
    title: {
        display: 'flex',
        justifyContent: 'center',
        padding: theme.spacing(0.5),
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Times'
    },
    container: {
        overflowY: 'scroll',
        height: 400,
    },
    box: {
        boxShadow: theme.shadows[4],
        justifyContent: 'space-around',
        display: 'flex',
        width: 450,
        height: 45,
        paddingLeft: 15,
        // paddingRight: ,
    },
    roll: {
        color: '#06046b',
        paddingLeft: 40,
        paddingTop: 13,
        borderBottom: 2,
        borderTop: 2,
    },
    value: {
        color: '#046b26',
        paddingLeft: 40,
        paddingTop: 13,
        borderBottom: 2,
        borderTop: 2,
    },
    header: {
        display: 'flex',
        justifyContent: 'space-around',
        // padding: theme.spacing(0.5),
        fontSize: 19,
        fontWeight: 'bold',
        fontFamily: 'Times',
        paddingTop: 6,
        borderBottom: 2,
    },
    headerContainer: {
        height: 50,
    },
    lastSection: {
        marginTop: 10,
        display: 'flex',
        justifyContent: 'center',
    }

}));




export default function DetailsComponent(props) {
    const classes = useStyles();
    const { header, body, valueType } = props.state.studentModal;
    const { setStudentModal } = props.state;

    console.log(props.state);
    return (
        <div className={classes.root}>
            <div className={classes.title}>
                <Typography className={classes.title}>{header}</Typography>
            </div>
            <div >
                <div className={classes.headerContainer}>
                    <div className={classes.box}>
                        <Typography className={classes.header}>{'Registration Number'}</Typography>
                        <Typography className={classes.header}>{valueType}</Typography>
                        <br />
                    </div>
                </div>
                <div className={classes.container}>
                    {body.map((element) =>
                    (<div className={classes.box}>
                        <Typography className={classes.roll}>{element.reg}</Typography>
                        <Typography className={classes.value}>{element.value}</Typography>
                        <br />
                    </div>))
                    }
                </div>
            </div>
            <div className={classes.lastSection}>
                <Button variant="contained" color="primary" onClick={() => setStudentModal({ open: false })}>Back</Button>
            </div>
        </div>


    )
}