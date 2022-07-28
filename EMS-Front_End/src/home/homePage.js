
import React, { useState} from 'react';
import AppBar from './appBar';
import Home from './fieldHome/body';
import Profile from './profile';
import './style.css'
import CreateViva from './createViva';
import DetailsModal from './modal/DetailsModal';
export default function HomePage(props) {
    
    const [vivaModal, setVivaModal] = useState(false);
    const [studentModal,setStudentModal] = useState({open: false});

    const [page, setPage] = useState('home');
    const state = {
        ...props.state,
        page: page,
        setPage: setPage,
        vivaModal: vivaModal,
        setVivaModal: setVivaModal,

        studentModal: studentModal,
        setStudentModal: setStudentModal,
    };
    let body;
    
    if(page==='home')
    {
        body = <Home state={state}/>;
    }
    else if(page==='profile')
    {
        body = <Profile className ='body' state={state}/>;
    }

    return (
        <div>
            <AppBar state={state}
              width={0} />
            <CreateViva state={state}/>
            <DetailsModal state={state}/>
            {body}
        </div>
    )
}
