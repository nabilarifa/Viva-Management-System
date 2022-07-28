


import { connect } from 'react-redux'
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import LeftNavBar from './component/leftNavBar';
import RightNavBar from './component/rightNavBar'
import BottomNavbar from './component/bottomNavbar';
import Questions from './component/questions';




const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        // backgroundColor: 'red',
        flexGrow: 1,
        height: '90vh',
    },
    leftBar: {
        // backgroundColor: 'green',
        boxShadow: theme.shadows[5],
        // flexGrow: 1,
        width: '22vw',
        height: '100%',
    },
    mid: {
        // backgroundColor: 'purple',
        flexGrow: 1,
    },
    rightBar: {
        // backgroundColor: 'green',
        boxShadow: theme.shadows[5],
        // flexGrow: 1,
        height: '100%',
        width: '20vw',
    },


}));

const  TeacherView = (props) => {
    let { id } = useParams();
    const [questions, setQuestions] = useState([]);

    const [render,setRender] = useState(0);

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.leftBar}>
                <LeftNavBar {...props} state={{render:render,setRender:setRender}}/>
            </div>
            <div className={classes.mid}>
                <Questions state={{ id: id, questions: questions,setQuestions: setQuestions,render:render,setRender:setRender }} />
                <BottomNavbar state={{render:render,setRender:setRender}}/>
            </div>
            <div className={classes.rightBar}>
                <RightNavBar {...props} state={{setQuestions:setQuestions,render:render,setRender:setRender}}/>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    user: state.app.user
})
  
const mapDispatchToProps = dispatch => ({
    dispatch
})
  
export default connect(mapStateToProps, mapDispatchToProps)(TeacherView);
  