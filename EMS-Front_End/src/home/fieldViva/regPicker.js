import { Button, Typography, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { useState,useEffect } from 'react';
import postData from '../../methods/postMethod';
import { connect } from 'react-redux';
import { onUpdateDashBoard } from '../../reducers/actions';

const useStyles = makeStyles((theme) => ({

    root: {
        backgroundColor: '#edfff8',
        border: '0.5px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        width: 350,
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
    button: {
        display: 'flex',
        justifyContent: 'center'
    },
    container: {
        overflowY: 'auto',
        height: 330,
    },
    box: {
        boxShadow: theme.shadows[4],
        justifyContent: 'space-around',
        display: 'flex',
        width: 200,
        paddingLeft: 15,
        paddingRight: 15,
    },
    roll: {
        paddingLeft: 15,
        paddingTop: 13,
        borderBottom: 2,
        borderTop: 2,
    },
    text: {
        paddingBottom: 10,
        paddingTop: 15,
    },
    submitButton:{
        display: 'flex',
        justifyContent: 'space-around',
        paddingTop: 25,
    }

}));

function RegPicker(props) {
    const { setStep, vivaInfo,setVivaModal} = props.state;
    const { user } = props;
    let { startingRegNo, endingRegNo, } = vivaInfo;
    
    startingRegNo = parseInt(startingRegNo);
    endingRegNo = parseInt(endingRegNo);

    const [regList,setRegList] = useState([]);
    const [regNo,setRegNo] = useState(null);

    const classes = useStyles();    
    useEffect( () => {
        let reg = [];
        for(let r=startingRegNo; r<=endingRegNo;r++)
            reg.push(r);
        setRegList(reg);
        console.log(reg);
    } , [] )
    
    function removeRoll(roll){
        let reg = [];
        for(let r of regList)
            if(r!=roll)
                reg.push(r)
        setRegList(reg);
        console.log(reg);
    }
    function addRoll(){
        if(regNo==='' || regNo===null)
            return;
        const result = regList.find((e)=>(e==parseInt(regNo)));
        if(result!=undefined)
            return;
        const reg = [...regList];
        reg.push(parseInt(regNo)) ;
        reg.sort(function(a, b){return a - b});
        setRegList(reg);
    }
    async function getName(){
        console.log(user);
        return `${user.firstName} ${user.lastName}`
    }

    async function createViva(){
        let info = {...vivaInfo};
        let date = info.date.getTime()-(info.date.getTime()%86400000)
        date+=info.startTime%86400000;
        info.startTime = new Date(date);
        delete info.date;
        const packet = {...info, email: localStorage.getItem('email'), regList : regList};

        packet.courseTeacher = await getName();
        const res = await postData(`/exam/create`,packet)
        // eslint-disable-next-line no-restricted-globals
        props.dispatch(onUpdateDashBoard({}))
        if(res.status===200)
            setVivaModal(false);
    }


    const component = regList.map((roll) =>
    (<div className={classes.box}>
        <Typography className={classes.roll}>{roll}</Typography>
        <IconButton aria-label="delete" className={classes.margin} onClick={()=>removeRoll(roll)}>
            <DeleteIcon />
        </IconButton>
        <br />
    </div>))
    return (
        <div className={classes.root}>
            <div className={classes.title}>
                <Typography className={classes.title}>Create New Viva</Typography>
            </div>
            <div className={classes.title}>
                <div className={classes.container}>
                    {component}
                </div>
            </div>
            <div className={classes.text}>
                <Typography>Add a student via Registration No.</Typography>
            </div>
            <div className={classes.button}>
                <TextField
                    required fullWidth label='Registration No.' autoFocus
                    onChange={(event)=> setRegNo(event.currentTarget.value) }
                />
                <Button variant="contained" color="primary" onClick={addRoll}>Add</Button>
            </div>
            <div className={classes.submitButton}>
                <Button  variant="contained" color="primary" onClick={createViva}>Create Viva</Button>
                <Button  variant="contained" color="secondary" onClick={()=> setStep(0)}>Back</Button>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.app.user,
        exam: state.app.exam,
        viva: state.app.viva,
    }
}
export default connect(mapStateToProps, dispatch => ({ dispatch }))(RegPicker)