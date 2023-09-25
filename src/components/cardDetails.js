import React from "react";
import styled from "styled-components";
import { Marginer } from "../marginer";

import yasminLogo from "../../assets/images/yasminLogo.PNG";

const DetailsContainer = styled.div`
  height: auto;
  background-color: yellow;
  border-radius: 25px;
  flex-direction: column;
`;

const MediumText = styled.span`
  font-size: 2em;
  color: #fff;
  font-weight: 800;
  text-transform: uppercase;

  justify-content: center;
  align-items: center;
  flex-direction: column;

  text-align: right;
  dir: rtl;
  background-color: orange;

  `;

const SpacedHorizontalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  dir: rtl;
  text-align: right;
  border-radius: 25px;
  background-color: purple;
  height: 3rem; /* Increase the height */
  margin: 8px; /* Add margin around each purple box */
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    object-fit: cover;
    max-width: 100%;
    max-height: 100%;
  }
`;

const BuyButton = styled.button`
  padding: 10px 16px;
  background-color: #fbbe01;
  color: #000;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 700;
  border: 3px solid transparent;
  outline: none;
  cursor: pointer;
  transition: all 290ms ease-in-out;
  border-radius: 8px;

  &:hover {
    background-color: transparent;
    color: #fff;
    border: 3px solid #fbbe01;
  }
`;

export function ShoesDetails(props) {
  const { playerName, text } = props;
  console.log("ShoesDetails playersName, cards: ", playerName, text);
  return (
    <DetailsContainer>
      <SpacedHorizontalContainer>
        <MediumText>{playerName}</MediumText>
      </SpacedHorizontalContainer>
      <SpacedHorizontalContainer>
        <MediumText>{text}</MediumText>
      </SpacedHorizontalContainer>
      <SpacedHorizontalContainer>
        <ImageWrapper>
          <img src={yasminLogo} alt="Logo" />
        </ImageWrapper>
      </SpacedHorizontalContainer>
    </DetailsContainer>
  );
}
