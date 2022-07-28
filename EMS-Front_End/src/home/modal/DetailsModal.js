import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import DetailsComponent  from './detailsModalComponent';


const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

}));

export default function DetailsModal(props) {
    
    const { setStudentModal, studentModal } = props.state;
    const classes = useStyles(); 
   
    return (
        <div>
            <Modal
                className={classes.modal}
                open={studentModal.open}
                onClose={() => setStudentModal({ open: false })}
            >
            <DetailsComponent state={{studentModal:studentModal,setStudentModal:setStudentModal}}/>
            </Modal>
        </div>
    )

}