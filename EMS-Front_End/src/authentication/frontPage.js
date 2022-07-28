import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import FormPage from './formPage';
import styled from 'styled-components';
import { Row } from '../utils/styles';

const ExtraLarge = styled.div`
  font-size: 48px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-top: -120px;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 45px;
`;

const Container = styled.div`
  /* background-image: linear-gradient(to right, #f4baff, #f1d7ff); */
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledButton = styled.div`
  width: fit-content;
  padding: 20px 30px;;
  background: rgb(88 127 241);
  border-radius: 5px;
  color: white;
  cursor: pointer;
`;

const ImgStyled = styled.img`
  position: relative;
  top: -150px;
`;

function FrontPage(props) {
  const [mode, setMode] = useState('');

  function btnClicked(event) {
    const { value } = event.currentTarget;
    setMode(value);
  }

  let Component = (
    <Container>
      <div>
        <div style={{ textAlign: 'center' }}>
          <ImgStyled src="https://www.sust.edu/images/logo.png" height={"140px"}/>
        </div>
        <ExtraLarge>SUST Viva Management System</ExtraLarge>
        <Center>
          <Row columns="1fr 1fr" gridGap="10px">
            <StyledButton onClick={() => setMode("signIn")} > Log In </StyledButton>
            <StyledButton name="button" onClick={() => setMode("signUp")} > Sign Up </StyledButton>
          </Row>
        </Center>
      </div>
      
    </Container>
  );
  const state = { formMode: mode, setFormMode: setMode }
  return (
    <div>
      {mode === "" ? Component : <FormPage {...state} />}
    </div>
  )
}


export default FrontPage;