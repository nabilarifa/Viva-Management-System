import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { setUserAction } from '../reducers/actions';
import { push } from 'connected-react-router';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import getData from '../methods/getMethod';
import { Row } from '../utils/styles';
const useStyles = makeStyles((theme) => ({
    root: {
        display:"flex",
        height: '10vh',
        flexGrow: 1,
    },
    toolbar: {
        marginRight: theme.spacing(2),
        justifyContent: 'flex-end',
        display: 'flex',
    }
}));
const StyledButton = styled.div`
    margin-left: 10px;
    padding: 10px 10px;
    cursor: pointer;
    :hover {
        background: #5268e0;
    }
    display: inline;
`;

const MyAppBar = ({ user, dispatch, teacherMode, state }) => {
    console.log('appbar', user);
    const classes = useStyles();
    const { setVivaModal } = state;
    const [profileLink, setProfileLink] = useState('/profile');
    const [userName, setUserName] = useState('Loading...');
    function logOut(){
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('teacherMode');
        dispatch(setUserAction({}));
        dispatch(push('/'));
    }
    useEffect(() => {
        getData(`/profile/getLink?email=${user.email}`)
            .then(data => {
                setProfileLink(data.body);
                console.log('getlin ', data);
            })
        console.log('hii');
    }, [user.email]);

    useEffect(() => {
        setUserName(user.firstName + " " + user.lastName);
    }, [user.firstName, user.lastName])
    return (
        <div className={classes.root}>
            <AppBar style={{ height: '50px' }} position="fixed">
                
                <Row columns="1fr 350px" style={{ marginTop: '15px'}}>
                    <div>
                        <StyledButton color="inherit" onClick={(event)=> dispatch(push('/'))} >Home</StyledButton>
                        {teacherMode && <StyledButton color="inherit" onClick={(event)=>setVivaModal(true)}> Create a New Viva</StyledButton>}
                        {teacherMode && <StyledButton color="inherit" onClick={(event)=> dispatch(push('/questionBank'))} >Question Bank</StyledButton>}
                    </div>
                    
                    {/* <StyledButton color="inherit" onClick={(event)=> dispatch(push(profileLink))}> Profile</StyledButton> */}
                    <div style={{  }}>
                        <h3 style={{ cursor: 'pointer', display: 'inline' }} className={classes.title} onClick={() => dispatch(push(profileLink))}>
                            {userName}
                        </h3>
                        <StyledButton color="inherit" onClick={(event)=> logOut()}>Log Out</StyledButton>
                    </div>
                    
                </Row>
            </AppBar>
        </div>
    );
}
const mapStateToProps = state => {
    return {
        teacherMode: state.app.teacherMode,
        user: state.app.user,
    }
}
export default connect(mapStateToProps, dispatch => ({ dispatch }))(MyAppBar);