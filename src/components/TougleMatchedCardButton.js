import React from "react";
import styled from "styled-components";


const ReturnButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: #fdf2e9;
  color: #fad5a5;
  padding: 1vw; /* Used vw for padding to make it responsive */
  /* background-color: green; */

`;

const MsgAndButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5vw; /* Reduce the vertical gap */
`;

const ReturnButton = styled.button`
  background-color: #fad5a5;
  color: #808000;
  border: none;
  border-radius: 1vw; /* Used vw for border-radius to make it responsive */
  cursor: pointer;
  box-shadow: 0.5vw 0.5vw 0 0 rgba(0, 0, 0, 0.5); /* Used vw for box-shadow to make it responsive */
  transition: transform 0.2s;
  font-size: 2vw; /* Used vw for font-size to make it responsive */
  font-weight: bold;
  padding: 1.5vw 3vw; /* Used vw for padding to make it responsive */
  margin-bottom: 0; /* Remove margin-bottom */
`;

const TougleMatchedCardButton = (props) => {
  let { isMatched, setIsMatched, setClearFlippedCards } = props;

  return (
      <ReturnButtonContainer>
        {!isMatched && (
          <MsgAndButtonContainer>
            <ReturnButton
              onClick={() => {
                setIsMatched(!isMatched);
                setClearFlippedCards(true);
              }}
            >
              Keep going!
            </ReturnButton>
          </MsgAndButtonContainer>
        )}
        {isMatched && (
          <MsgAndButtonContainer>
            <ReturnButton
              onClick={() => {
                setClearFlippedCards(true);
              }}
            >
              Back to game board
            </ReturnButton>
          </MsgAndButtonContainer>
        )}
      </ReturnButtonContainer>
  );
};

export default TougleMatchedCardButton;
