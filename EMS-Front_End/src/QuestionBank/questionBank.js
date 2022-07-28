import React, { useState, useEffect } from 'react';
import MyAppBar from '../home/appBar'
import CreateViva from '../home/createViva';
import _ from 'underscore';
import styled from 'styled-components';
import { connect } from 'react-redux';
import getData from '../methods/getMethod';
import { useParams } from 'react-router';
import { Center, Row } from '../utils/styles';
import Loading from '../common/Loading';
import postData from '../methods/postMethod';

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

const Card = ({ isEnded, isRunningNow, question }) => {
    return (
        <div>
            <StyledRow columns="1fr" >
                <Wrapper>{question}</Wrapper>
            </StyledRow>
        </div>
    )
}
function QuestionBank({ dispatch, user }) {

    const [vivaModal, setVivaModal] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [exam, setExam] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => loadQuestion(), [user.email])
    async function loadQuestion() {
        setIsLoading(true);
        const response = await postData(`/question/getBank`, { email: user.email })
        if (response.status === 200) {
            console.log('exam --------------', response.body);
            setQuestions(response.body)
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
                    <StyledRow columns="1fr">
                        <h3>Questions</h3>
                    </StyledRow>
                    {isLoading && <Loading />}
                    {!isLoading && _.map(questions, q =>
                        <Card key={Math.random()} question={q} />
                    )} 
                </TableWrapper>
            </Center>
            
            
        </div>
    )
}
const mapStateToProps = state => ({
    user: state.app.user,
  })
  const mapDispatchToProps = dispatch => ({
    dispatch,
  })
  
  export default connect(mapStateToProps, mapDispatchToProps) (QuestionBank);
  
  