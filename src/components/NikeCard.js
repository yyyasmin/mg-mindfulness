import React from "react";
import styled from "styled-components";
import ReactCardFlip from "react-card-flip";

// const catImage = require("../assets/textures/catImage.png");
const yasminLogo = require("../assets/textures/yasminLogo.PNG");


const computeCardSize = (cardSize) => {
  
  //////console.log("IN computeCardSize -- Card Size: ", cardSize); // Log the cardSize

  let cWidth = `${cardSize.card.width}px`;
  let cHeight = `${cardSize.card.height}px`;

  let gWidth = `${cardSize.gap.width}px`;
  gWidth = gWidth ? gWidth : "100px";

  let gHeight = `${cardSize.card.height}px`;
  gHeight = gHeight ? gHeight : "100px";

  let resCardSize = {
    width: cWidth,
    height: cHeight,
    gap: `${gHeight} ${gWidth}`, // Adjusted gap style attribute here
  };

  return resCardSize;
};

const computeBorderColor = (frameColor) => {
  // Here you can add any logic needed to determine the border color.
  // For simplicity, we'll just return the frameColor as the border color.
  // Ensure that frameColor is a valid CSS color string.
  ////console.log("IN computeBorderColor -- frameColor:",frameColor )
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
  resizeMode:'contain'
`;

const NikeCard =  ( props ) =>  {
  
  let { key, playerName, card, cardSize, faceType, frameColor, toggleCardFlip } = props;

  ////console.log("FRAME-COLR: ", frameColor)
  
  let cardW = cardSize.width ? cardSize.width.toString()+"px" : null;
  let cardH = cardSize.height ? cardSize.height.toString()+"px" : null;
  
  ////console.log("IN NikeCard -- faceType: ", faceType, faceType==="front")
  ////console.log("IN NikeCard -- faceType: ", card, card)

  const handleCardClick = () => {
    if ( toggleCardFlip != null )  {
      toggleCardFlip(card.id);
    }
  };

  return (
    <ReactCardFlip isFlipped={faceType==="back"}>

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
