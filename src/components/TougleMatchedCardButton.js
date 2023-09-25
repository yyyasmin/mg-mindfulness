import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ReactCardFlip from "react-card-flip";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wellcome = styled.h1`
  font-size: 2.5rem;
  margin: 10px 0 5px 0; /* Adjust top and bottom margin */
`;

const PlayersContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: #FDF2E9;
  color: #FAD5A5;
  margin-bottom: 50px;
  padding: 0;

`;


const ReturnButton = styled.button`

  text-align: center;
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
  border-radius: 25px;

  background-color: #808000;
  color: #FAD5A5;

  border: none;
  border-radius: 10px;
  cursor: pointer;

  box-shadow: 0px 5px 0px 0px rgba(0, 0, 0, 0.5); /* Add a box shadow for the 3D effect */
  transition: transform 0.2s; /* Add a transition for a smoother effect */
  font-size: 1.5rem; /* Increase font size for larger text */
  font-weight: bold; /* Add bold text */

  font-size: 2.3rem;

  display: flex;
  flex-direction: row-reverse;
  
  &:active {
    transform: translateY(5px); /* Add a slight translateY transformation when the button is pressed */
    box-shadow: none; /* Remove the box shadow when the button is pressed */
  }
`;

const TougleMatchedCardButton = (props) => {

  let { matchedCards, setMatchedCards } = props

  return (
    <Container>
      <PlayersContainer>
        <ReturnButton onClick={() => setMatchedCards(!matchedCards)}>
           {matchedCards ? "You've got a match!" : "Keep going!"}
        </ReturnButton>
      </PlayersContainer>

    </Container>
  );
};

export default TougleMatchedCardButton;
