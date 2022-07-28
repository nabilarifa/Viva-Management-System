import React, { useState, useEffect } from 'react';
import './styles.css'
import MyAppBar from '../home/appBar'
import CreateViva from '../home/createViva';
import TeacherView from './teacherView';
import StudentView from './studentView'
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import { getExamByID } from '../utils/api';
import { setCurrentExam } from '../reducers/actions';

function EnterExam({ dispatch, teacherMode }) {

    const [vivaModal, setVivaModal] = useState(false);
    const { id } = useParams();

    const [stopWatchTime, setStopWatchTime] = useState(0);

    const state = {
        vivaModal: vivaModal,
        setVivaModal: setVivaModal
    };
    useEffect(() => {
        getExamByID(id).then(data => dispatch(setCurrentExam(data.body)));
    }, []);
    console.log('hi----------');
    // if (page === 'profile') {
    //     body = <Profile className='body' state={state} />;
    // }
    let viewComponent;
    
    if (teacherMode)
        viewComponent = <TeacherView setStopWatchTime={setStopWatchTime} stopWatchTime={stopWatchTime} />
    else
        viewComponent = <StudentView setStopWatchTime={setStopWatchTime} stopWatchTime={stopWatchTime}/>

    return (
        <div>
            <MyAppBar state={state} />
            <CreateViva state={state} />
            {viewComponent}
        </div>
    )
}

export default connect(state => ({ teacherMode: state.app.teacherMode }), dispatch => ({ dispatch })) (EnterExam);
