
import 'date-fns';
import React from 'react';
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';



function DateComponent(props) {
   
    const { vivaInfo, setVivaInfo } = props.state;
    return (

        <KeyboardDatePicker
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-dialog"
            label="Date"
            value={vivaInfo.date}
            onChange={(value)=>setVivaInfo({...vivaInfo, date: value})}
            KeyboardButtonProps={{
                'aria-label': 'change date',
            }} />
    )
}

function TimeComponent(props) {
    const { vivaInfo, setVivaInfo } = props.state;
    
    return (

        <KeyboardTimePicker
            margin="normal"
            id="time-picker"
            label="Time"
            name='startTime'
            value={vivaInfo.startTime}
            onChange={(value)=>setVivaInfo({...vivaInfo,startTime:value})}
            KeyboardButtonProps={{
                'aria-label': 'change time',
            }} />
    )
}
export default function DatePicker(props) {
    // The first commit of Material-UI

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>

            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <DateComponent state={props.state} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TimeComponent state={props.state}/>
                    </Grid>
                </Grid>
            </Grid>
        </MuiPickersUtilsProvider>



    );
}