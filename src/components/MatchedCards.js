import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  width: 300px; /* Increase the width as needed */
  display: flex;
  flex-direction: column;
  cursor: grab;
  overflow: hidden;
  position: relative;
  margin: 10px;
  border-radius: 25px;
  border: 10px solid brown; /* Border around the entire card */
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 25px;
  background-color: brown;
`;

const ImageWrapper = styled.div`
  object-fit: cover;
  justify-content: center;
  border-radius: 25px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 25px;
`;

const TextContainer = styled.div`
  background-color: white;
  padding: 10px;
  border-radius: 25px;
  dir: rtl;
  text-align: right;
  border-radius: 25px;
`;

const PlayerName = styled.div`
  font-weight: bold;
`;

const CardText = styled.div`
  font-size: 1em;
`;

const MatchedCards = (props) => {
  const { playerName, players, card } = props;

  return (
    <CardContainer>
      <ContentWrapper>
        <ImageWrapper>
          <Image src={card.imageImportName} alt={card.imageImportName} />
        </ImageWrapper>
        <TextContainer>
          <PlayerName>{playerName}</PlayerName>
          <PlayerName>{players[0].name}</PlayerName>
          <CardText>MatchedCards: {card.matchedCards}</CardText>
          <CardText>TEXT-1: {card.text1}</CardText>
          <CardText>TEXT-2: {card.text2}</CardText>
        </TextContainer>
      </ContentWrapper>
    </CardContainer>
  );
};

export default MatchedCards;
