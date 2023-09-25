import React from "react";
import styled from "styled-components";
import ReactCardFlip from "react-card-flip";

// const catImage = require("../assets/textures/catImage.png");
const yasminLogo = require("../assets/textures/yasminLogo.PNG");

const CardContainer = styled.div`
  width: 200px;
  height: 250px;
  display: flex;
  justify-content: center;
  background-color: brown;
  border-radius: 25px;
  cursor: grab;
  overflow: hidden;
  position: relative;

  transition: transform 0.2s ease; /* Add a smooth transition for the 3D effect */
  transform-style: preserve-3d; /* Enable 3D transforms */
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3); /* Add a box shadow for the 3D effect */
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border: 10px solid brown;
  border-radius: 25px;
  transform: translateZ(10px); /* Add a z-translation for the 3D effect */
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
    // console.log("IN NUKECARD -- toggleCardFlip: ", toggleCardFlip)
    // console.log("IN NUKECARD -- card: ", card)
    // console.log("IN NUKECARD -- playerName: ", playerName)
    // console.log("IN NUKECARD -- isFlipped: ", isFlipped)

    toggleCardFlip(card.id);
  };

  return (
    <ReactCardFlip isFlipped={isFlipped}>

      <CardContainer onClick={handleCardClick}>
        <ImageWrapper>
          <CardImage src={card.imageImportName} alt={card.name} />
        </ImageWrapper>
      </CardContainer>

      <CardContainer onClick={handleCardClick}>
        <ImageWrapper>
          <CardImage src={yasminLogo} alt={card.name} />
        </ImageWrapper>
      </CardContainer>

    </ReactCardFlip>
  );
};

export default NikeCard;
