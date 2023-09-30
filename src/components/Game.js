import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NikeCard from "./NikeCard";
import Players from "./Players";
import MatchedCards from "./MatchedCards";
import TougleMatchedCardButton from "./TougleMatchedCardButton";
import { useLocation } from "react-router-dom";
import {
  updateCurentRoomAndActiveRooms,
  removeUpdatedRoomDataListener,
  emitCurentRoomChanged,
  updateMatchedCards,
  removeUpdatedMatchedCards,
  emitCurentMatchedCards,
} from "../clientSocketServices";

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

function Game() {
  const location = useLocation();
  const { userName, currentRoom } = location.state;

  const [cr, setCurrentRoom] = useState({});
  const [updatedActiveRooms, setUpdatedActiveRooms] = useState([]);
  const [matchedCards, setMatchedCards] = useState(false);

  useEffect(() => {
    setCurrentRoom(currentRoom);
    setUpdatedActiveRooms(updatedActiveRooms);
  }, []);

  
  useEffect(() => {
    console.log("DEBUG -- useEffect[currentRoom] -- currentRoom: ", currentRoom)
  }, [currentRoom]);

  useEffect(() => {
    updateCurentRoomAndActiveRooms(setUpdatedActiveRooms, setCurrentRoom);
    return () => {
      removeUpdatedRoomDataListener();
    };
  }, []);

  useEffect(() => {
    updateMatchedCards(setMatchedCards);
    return () => {
      removeUpdatedMatchedCards();
    };
  }, []);

  const toggleCardFlip = (cardId) => {
    const cardIndex = cr.cardsData.findIndex((card) => card.id === cardId);

    if (cardIndex !== -1) {
      const updatedCard = { ...cr.cardsData[cardIndex] };
      updatedCard.isFlipped = !updatedCard.isFlipped;
      const updatedRoom = { ...cr };
      updatedRoom.cardsData[cardIndex] = updatedCard;
      emitCurentRoomChanged(updatedRoom);
    }
  };

  useEffect(() => {
    if (cr !== undefined && cr.id >= 0) {
      console.log(" IN useEffect[cr] -- cr: ", cr)
      cr.cardsData.map((card, index) => (
        console.log("in Game useEffect[cr] -- ", "cr.cardsMap-", { index }, "- isFlipped: ", card.isFlipped)
      ));
    }
  }, [cr]);

  useEffect(() => {
    if ( matchedCards == true ) {
      console.log("in USEeFFECT[matchedCards] -- matchedCards: ", matchedCards)
      emitCurentMatchedCards(matchedCards);
    }
  }, [matchedCards]);

  return (
    <GameContainer>
      <Wellcome>
        <div>Wellcome to room: {cr.name}</div>
      </Wellcome>

      {cr !== undefined && cr.id >= 0 && <Players players={cr.currentPlayers} />}

      {cr !== undefined && cr.id >= 0 && (
        <TougleMatchedCardButton
          matchedCards={matchedCards}
          setMatchedCards={(matchedCards) => setMatchedCards(matchedCards)}
        />
      )}

      {cr?.cardsData?.length > 0 && matchedCards !== undefined ? (
        matchedCards ? (
          <CardGallery>
            {cr.cardsData.map((card, index) => (
              <MatchedCards
                key={index}
                playerName={userName}
                players={currentRoom.currentPlayers}
                card={card}
                matchedCards={matchedCards}
              />
            ))}
          </CardGallery>
        ) : (
          <CardGallery>
            {cr.cardsData.map((card, index) => (
              <NikeCard
                key={index}
                playerName={userName}
                card={card}
                isFlipped={card.isFlipped}
                toggleCardFlip={(cardId) => toggleCardFlip(cardId)}
              />
            ))}
          </CardGallery>
        )
      ) : (
        <div>Loading...</div>
      )}
    </GameContainer>
  );
}

export default Game;
