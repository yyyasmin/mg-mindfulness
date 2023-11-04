import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PlayersContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: #fdf2e9;
  color: #fad5a5;
  margin-bottom: 50px;
  padding: 0;
`;

const MsgAndButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MsgContainer = styled.div`
  background-color: #fdf2e9;
  color: #fad5a5;
  margin-bottom: 10px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  position: relative;
  border-radius: 25px;

  background-color: #808000;
  color: #fad5a5;

  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0px 5px 0px 0px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s;
  font-size: 2.3rem;
  font-weight: bold;
  display: flex;
  flex-direction: row-reverse;
  &:active {
    transform: translateY(5px);
    box-shadow: none;
  }
`;

const ReturnButton = styled.button`
  text-align: center;
  cursor: pointer;
  position: relative;
  border-radius: 25px;
  
  background-color: #fad5a5;
  color: #808000;

  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0px 5px 0px 0px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s;
  font-size: 2.3rem;
  font-weight: bold;
  display: flex;
  flex-direction: row-reverse;
  &:active {
    transform: translateY(5px);
    box-shadow: none;
  }
`;


const TougleMatchedCardButton = (props) => {
  let { isMatched, setIsMatched, setClearFlippedCards } = props;

  return (
    <Container>
      <PlayersContainer>
        {isMatched && (
          <MsgAndButtonContainer>
            <MsgContainer>"You've got a match!"</MsgContainer>
            <ReturnButton
              onClick={() => {
                setClearFlippedCards(true);
              }}
            >
              Back to game board
            </ReturnButton>
          </MsgAndButtonContainer>
        )}
        {!isMatched && (
          <ReturnButton
            onClick={() => {
              setIsMatched(!isMatched);
              setClearFlippedCards(true);
            }}
          >
            Keep going!
          </ReturnButton>
        )}
      </PlayersContainer>
    </Container>
  );
};

export default TougleMatchedCardButton;
