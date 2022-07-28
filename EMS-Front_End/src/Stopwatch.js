import React, { useState } from 'react';
import ReactTimerStopwatch from 'react-stopwatch-timer';
import './App.css'
import getData from './methods/getMethod';


const Stopwatch = (props) => {
    const [time, setTime] = useState(0);
    const [isOn, setIsOn] = useState(false);
    React.useEffect(async () => {
        const url = "/exam/details/" + props.id.toString();
        const res = await getData(url)
        // console.log(res.body[0])
        const startTime = new Date(res.body[0].startTime).getTime();
        const endTime = new Date(res.body[0].endTime).getTime();
        console.log(startTime, endTime)
        const _time = (parseInt(endTime) - parseInt(startTime)) / 60000;
        setTime(_time);

    }, []);
    console.log(time)
    const fromTime = new Date(0, 0, 0, 0, time, 0, 0);
    return (
        <h1 className="h1_">
            <ReactTimerStopwatch isOn={isOn} className="react-stopwatch-timer__table react-stopwatch-timer__element " watchType="timer" color="gray" hintColor="red" fromTime={fromTime} displayHours={false}>
                <button className="btn btn-dark" onClick={() => setIsOn(true)}>START</button>
            </ReactTimerStopwatch>
        </h1>
    );
};

export default Stopwatch