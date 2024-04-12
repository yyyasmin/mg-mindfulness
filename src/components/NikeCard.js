import React from "react";
import styled from "styled-components";
import ReactCardFlip from "react-card-flip";
import yasminLogo from "../assets/textures/yasminLogo.PNG";

const computeCardSize = (cardSize) => {
  let cWidth = cardSize.card.width ? `${cardSize.card.width}px` : "100px";
  let cHeight = cardSize.card.height ? `${cardSize.card.height}px` : "100px";
  let gWidth = cardSize.gap.width ? `${cardSize.gap.width}px` : "100px";
  let gHeight = cardSize.gap.height ? `${cardSize.card.height}px` : "100px";
  let resCardSize = {
    width: cWidth,
    height: cHeight,
    gap: `${gHeight} ${gWidth}`, // Adjusted gap style attribute here
  };
  return resCardSize;
};

const computeBorderColor = (frameColor) => {
  return `border: 10px solid ${frameColor};`;
};

const CardContainer = styled.div`
  ${({ cardSize }) => computeCardSize(cardSize)}
  display: flex;
  flex-direction: column;
  cursor: grab;
  overflow: hidden;
  position: relative;
  border-radius: 25px;
  ${({ frameColor }) => computeBorderColor(frameColor)}
  box-sizing: border-box;
  max-width: 100%;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 25px;
  object-fit: fill;
`;

const NikeCard = (props) => {
  let { playerName, card, cardSize, faceType, frameColor, toggleCardFlip } = props;

  const handleCardClick = () => {
    if (toggleCardFlip != null) {
      toggleCardFlip(card.id);
    }
  };

  return (
    <ReactCardFlip isFlipped={faceType === "back"}>
      <CardContainer cardSize={cardSize} frameColor={frameColor} onClick={handleCardClick}>
        <CardImage src={card.imageImportName} alt={card.name} />
      </CardContainer>

      <CardContainer cardSize={cardSize} frameColor={frameColor} onClick={handleCardClick}>
        <CardImage src={yasminLogo} alt={card.name} />
      </CardContainer>
    </ReactCardFlip>
  );
};

export default NikeCard;
