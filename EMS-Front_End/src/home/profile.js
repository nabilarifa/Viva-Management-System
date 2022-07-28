import { Card, CardContent } from "@material-ui/core"
import TeacherProfile from './fieldProfile/teacherProfile'
import StudentProfile from "./fieldProfile/studentProfile";

import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { useParams } from "react-router";
import getData from "../methods/getMethod";

const useStyles = makeStyles((theme) => ({
    root: {
        height: '90vh',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
    },
    card: {
        // minWidth: 300,
        margin: theme.spacing(2),
        padding: theme.spacing(1),
        display: 'flex',
        justifyContent: 'space-around',
        // justifyContent: 'space-between',
    },

}));

function Profile(props) {
    const { id } = useParams();
    const classes = useStyles();
    const [profileInfo, setProfileInfo] = useState({});
    useEffect(() => {
        getData(`/profile/getProfile/${id}`)
            .then(data => {
                console.log('profile ', data.body);
            })
        console.log('hii');
    }, []);
    let component;
    if (props.teacherMode) {
        component = <TeacherProfile />
    }
    else {
        component = <StudentProfile/>
    }
    return (
        <div className={classes.root}>
            <Card className={classes.card}>
                <CardContent>
                    {component}
                </CardContent>
            </Card>
        </div>
    )
}

const mapStateToProps = state => ({
    user: state.app.user,
    teacherMode: state.app.teacherMode,
  })
  const mapDispatchToProps = dispatch => ({
    dispatch,
  })
  
  export default connect(mapStateToProps, mapDispatchToProps) (Profile);
  
  