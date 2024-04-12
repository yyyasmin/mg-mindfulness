import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  width: ${(props) => props.cardWidth}px;
  height: ${(props) => props.cardHeight}px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2vw;
  background-color: snow; /* Set the background color here */
  border-radius: 25px;
  border: 1vw solid brown;
`;

const CardFrame = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 70%;
  border-radius: 25px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TextContainer = styled.div`
  width: 100%;
  height: 30%;
  padding: 2%; /* Add padding relative to the container's width */
  box-sizing: border-box;
  /* border-radius: 25px; */
  border: 1vw solid #fad5a5; /* Border for text */
  color: black; /* Set the text color here */
  text-align: center; /* Center the text horizontally */
`;

const PlayerName = styled.div`
  font-weight: bold;
`;

const CardText = styled.div`
  font-size: 2vw;
`;

const MatchedCards = (props) => {
  const { cardWidth, cardHeight, card, players, index } = props;
  const currentPlayer = players.find((player) => player.isActive);
  const opponentPlayer = players.find((player) => !player.isActive);

  const currentText = index === 0 ? card.text1 : card.text2;

  return (
    <CardContainer cardWidth={cardWidth} cardHeight={cardHeight}>
      <CardFrame>
        <ImageWrapper>
          <Image src={card.imageImportName} alt={card.imageImportName} />
        </ImageWrapper>
        <TextContainer>
          <PlayerName>{currentPlayer.name}</PlayerName>
          <CardText>{currentText}</CardText>
        </TextContainer>
      </CardFrame>
    </CardContainer>
  );
};

export default MatchedCards;
