import React, { useState, useEffect } from 'react';
import './styles.css'
import MyAppBar from '../home/appBar'
import CreateViva from '../home/createViva';
import _ from 'underscore';
import styled from 'styled-components';
import { connect } from 'react-redux';
import getData from '../methods/getMethod';
import { useLocation, useParams } from 'react-router';
import { Center, Row } from '../utils/styles';
import { CircularProgress } from '@material-ui/core';
import Loading from '../common/Loading';

const StyledRow = styled(Row)`
    height: 40px;
    padding: 10px 20px;
    box-shadow: 1px 1px 3px #bbbbbb;
    border-radius: 5px;
    margin-bottom: 10px;
    ${props => props.cardColor && `background: ${props.cardColor};`}
`;

const TableWrapper = styled.div`
    padding: 20px;
    width: 650px;
`;

const RightWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
`;

const Card = ({ isEndDetails, isEnded, isRunningNow, value, reg }) => {
    let status = '';
    let cardColor = '';
    if (isRunningNow) {
        status = 'Running';
        cardColor = '#ff8282';
    } else if (isEnded) {
        status = 'Ended';
        cardColor = '#efa5ff';
    } else {
        status = isEndDetails ? 'Absent' : 'Scheduled';
        cardColor = '#bfefca';
    }
    return (
        <div>
            <StyledRow columns="1fr 1fr 1fr" cardColor={cardColor}>
                <Wrapper>{reg}</Wrapper>
                <Wrapper>{status}</Wrapper>
                <Center>
                    <Wrapper >{value}</Wrapper>
                </Center>
            </StyledRow>
        </div>
    )
}
function ExamDetails({ dispatch, teacherMode }) {

    const [vivaModal, setVivaModal] = useState(false);
    const { id } = useParams();
    const { pathname } = useLocation();
    const isEndDetails = pathname.includes('ended');
    const [ptList, setPtList] = useState([]);
    const [exam, setExam] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => loadQuestion(), [])
    async function loadQuestion() {
        setIsLoading(true);
        const response = await getData(`/exam/details/${id}`)
        if (response.status === 200) {
            console.log('exam --------------', response.body);
            setPtList(response.body)
        }
        setIsLoading(false);

        // const res = await postData(`/viva/getVivaHistory`, { id: id })
        // if (res.status === 200) {
        //     const { questions } = res.body;
        //     const newState = questions.map(element => {
        //         element.inputComment = "";
        //         return element;
        //     })
        //     setQuestions(newState);
        // }
    }

    const state = {
        vivaModal: vivaModal,
        setVivaModal: setVivaModal
    };

    return (
        <div>
            <MyAppBar state={state} />
            <CreateViva state={state} />
            <Center>
                <TableWrapper>
                    <StyledRow columns="1fr 1fr 1fr">
                        <h3>Registration No</h3>
                        <h3>Status</h3>
                        <Center>
                            <h3>Exam Time</h3>
                        </Center>

                    </StyledRow>
                    {isLoading && <Loading />}
                    {!isLoading && _.map(ptList, pt =>
                        <Card isEndDetails={isEndDetails} key={Math.random()} {...pt} />
                    )} 
                </TableWrapper>
            </Center>
            
            
        </div>
    )
}

export default connect(state => ({ teacherMode: state.app.teacherMode }), dispatch => ({ dispatch })) (ExamDetails);
