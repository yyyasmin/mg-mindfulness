import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NikeCard from "./NikeCard";
import Players from "./Players";
import MatchedCards from "./MatchedCards";
import TougleMatchedCardButton from "./TougleMatchedCardButton";

// import { useParams, useLocation } from "react-router-dom";
import { useLocation } from "react-router-dom";

import {
  updateCurentRoomAndActiveRooms,
  removeUpdatedRoomDataListener,
  emitCurentRoomChanged,
  updateMatchedCards,
  removeUpdatedMatchedCards,
  emitCurentMatchedCards
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
  // const { roomId } = useParams();
  const location = useLocation();
  const { userName, currentRoom } = location.state;

  const [cr, setCurrentRoom] = useState({});
  const [updatedActiveRooms, setUpdatedActiveRooms] = useState([]);
  const [matchedCards, setMatchedCards] = useState(true);

  useEffect( () => {
    setCurrentRoom(currentRoom);
    setUpdatedActiveRooms(updatedActiveRooms);
  }, []);

  useEffect(() => {
    updateCurentRoomAndActiveRooms(setUpdatedActiveRooms, setCurrentRoom);
    return () => {
      removeUpdatedRoomDataListener();
    };
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts
  
  useEffect(() => {
    updateMatchedCards(setMatchedCards);
    return () => {
      removeUpdatedMatchedCards();
    };
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  const toggleCardFlip = (cardId) => {
    const cardIndex = cr.cardsData.findIndex((card) => card.id === cardId);

    if (cardIndex !== -1) {
      const updatedCard = { ...cr.cardsData[cardIndex] };
      updatedCard.isFlipped = !updatedCard.isFlipped;
      const updatedRoom = { ...cr };
      updatedRoom.cardsData[cardIndex] = updatedCard;
      console.log("IN GAME -- toggleCardFlip -- cardId: ", cardId)
      console.log("IN GAME -- toggleCardFlip -- updatedRoom: ", updatedRoom)
      emitCurentRoomChanged(updatedRoom); // The setting happens after the value received from the server
    }
  };

  
  useEffect(() => {
    if ( cr !== undefined && cr.id >= 0 )  {
      console.log("in Game useEffect[cr] -- cr: ", cr)
      cr.cardsData.map( (card, index) => (
        console.log("in Game useEffect[cr] -- ", "cr.cardsMap-", {index}, "- isFliped: ", card.isFlipped)
      ) )
    }
  }, [cr]);
  
  useEffect(() => {
    if ( matchedCards !== undefined )  {
      console.log("in Game useEffect[matchedCards] -- matchedCards: ", matchedCards)
      emitCurentMatchedCards(matchedCards);
    }
  }, [matchedCards]);


  console.log("in Game BEFORE RENDER -- matchedCards: ", matchedCards)
  console.log("in Game BEFORE RENDER -- userName: ", userName)

  return (
    <GameContainer>

      <Wellcome>
        <div>Wellcome to room: {cr.name}</div>
      </Wellcome>

  
      {cr !== undefined && cr.id >= 0 && (
        <Players players={cr.currentPlayers} />
      )}

      
      {cr !== undefined && cr.id >= 0 && (
        <TougleMatchedCardButton
          matchedCards = {matchedCards}
          setMatchedCards={(matchedCards) => setMatchedCards(matchedCards)}
        />
      )}
        
      { (cr.cardsData !== undefined &&  cr.cardsData.length > 0 && matchedCards !== undefined )? (
        matchedCards ? (

          <CardGallery>
            {cr.cardsData.map((card, index) => (
              <MatchedCards
                key={index}
                playerName={userName}
                players={currentRoom.currentPlayers}
                card={card}
                // toggleMatchedCards={() => toggleMatchedCards()}
                matchedCards = {matchedCards}
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
        // Handle the case when cr.cardsData is undefined or null
        <div>Loading...</div>
      )}
    </GameContainer>
  );
}

export default Game;
