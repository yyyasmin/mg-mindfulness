import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NikeCard from "./NikeCard"; // Assuming this is your card component
import { setFlipped, getFlipped } from "../socket/socket"; // Adjust imports as needed

const GameContainer = styled.div`
  background-color: #FDF2E9;
  color: brown;
  border-radius: 25px;
`;

const Wellcome = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 5px;
  border-radius: 25px;
`;

const CardGallery = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 35px;
  background-color: #FAD5A5;
  border-radius: 25px;
`;

function GameLogic(props) {
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [flippedKeys, setFlippedKeys] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);

  useEffect(() => {
    const handleCardFlip = (index, key) => {
      if (
        flippedKeys.length < 2 &&
        flippedIndexes.indexOf(index) === -1
      ) {
        setFlippedIndexes([...flippedIndexes, index]);
        setFlippedKeys([...flippedKeys, key]);
        setFlipped(props.currentRoom.id, [...flippedIndexes, index], [...flippedKeys, key]);
      }
    };

    if (flippedKeys.length === 2) {
      // Check if flipped cards match
      const [key1, key2] = flippedKeys;
      if (key1 === key2) {
        // Cards match
        setMatchedPairs([...matchedPairs, key1]);
      } else {
        // Cards don't match, reset after a delay
        setTimeout(() => {
          setFlippedIndexes([]);
          setFlippedKeys([]);
        }, 1000);
      }
    }
  }, [props.currentRoom, flippedIndexes, flippedKeys, matchedPairs]);

  return (
    <CardGallery>
      {props.currentRoom.cardsData.map((card, index) => (
        <NikeCard
          key={index}
          playerName={props.userName}
          card={card}
          isFlipped={flippedIndexes.includes(index)}
          toggleCardFlip={() => handleCardFlip(index, card.id)}
        />
      ))}
    </CardGallery>
  );
}

function Game() {
  const location = useLocation();
  const { userName, currentRoom } = location.state;

  // ... Other state and useEffects

  return (
    <GameContainer>
      <Wellcome>
        <div>Welcome to room: {cr.name}</div>
      </Wellcome>

      {cr !== undefined && cr.id >= 0 && (
        <GameLogic currentRoom={cr} userName={userName} />
      )}

      {/* ... Other components ... */}
    </GameContainer>
  );
}

export default Game;
