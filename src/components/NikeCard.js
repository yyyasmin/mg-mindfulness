import React from "react";
import styled from "styled-components";
import ReactCardFlip from "react-card-flip";

// const catImage = require("../assets/textures/catImage.png");
const yasminLogo = require("../assets/textures/yasminLogo.PNG");

const CardContainer = styled.div`
  width: 250px;
  height: 350px;
  display: flex;
  flex-direction: column;
  cursor: grab;
  overflow: hidden;
  position: relative;
  margin: 10px;

  border-radius: 25px;
  border: 10px solid brown; /* Border around the entire card */
  /*
  transition: transform 0.2s ease;
  transform-style: preserve-3d;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  */
`;

const CardImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 25px;
  object-fit: cover; /* Ensure the image fills the entire container */
`;

const NikeCard =  ( props ) =>  {
  
  let { card, isFlipped, toggleCardFlip } = props

  const handleCardClick = () => {
    if ( toggleCardFlip != null )  {
      toggleCardFlip(card.id);
    }
  };

  return (
    <ReactCardFlip isFlipped={isFlipped}>

      <CardContainer onClick={handleCardClick}>
          <CardImage src={card.imageImportName} alt={card.name} />
      </CardContainer>

      <CardContainer onClick={handleCardClick}>
          <CardImage src={yasminLogo} alt={card.name} />
      </CardContainer>

    </ReactCardFlip>
  );
};

export default NikeCard;
