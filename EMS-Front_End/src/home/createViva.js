import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import CreateVivaComponent from './fieldViva/createVivaComponent';


const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    
}));

export default function ExamModal(props) {
    const classes = useStyles();
    const { vivaModal, setVivaModal } = props.state;
    return (
        <div>
            <Modal
                className={classes.modal}
                open={vivaModal}
                onClose={() => setVivaModal(false)}>
                <CreateVivaComponent state={props.state}/>
            </Modal>
        </div>
    );
}
