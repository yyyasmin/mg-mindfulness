import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NikeCard from "./NikeCard";
import Players from "./Players";
import WaitingMsg from "./WaitingMsg";

import MatchedCards from "./MatchedCards";
import TougleMatchedCardButton from "./TougleMatchedCardButton";
import { useLocation } from "react-router-dom";
import {
  updateCurentRoomAndActiveRooms,
  removeUpdatedRoomDataListener,
  emitAddMemberToRoom,  // IN RoomsList
  emitRemoveMemberFromRoom,
  emitCurentRoomChanged,
  updateMatchedCards,
  removeUpdatedMatchedCards,
} from "../clientSocketServices";

const GameContainer = styled.div`
  background-color: #fdf2e9;
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
  background-color: #fad5a5;
  border-radius: 25px;
`;

function Game() {
  const location = useLocation();
  const { userName, currentRoom } = location.state;

  const [cr, setCurrentRoom] = useState({});
  const [updatedActiveRooms, setUpdatedActiveRooms] = useState([]);
  const [isMatched, setIsMatched] = useState(false);
  const [allFlippedCards, setAllFlippedCards] = useState([]);
  const [lastFlippedCards, setLastFlippedCards] = useState([]);
  const [clearFlippedCards, setClearFlippedCards] = useState(false);

  useEffect(() => {
    setCurrentRoom(currentRoom);
  }, [currentRoom]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Required for Chrome
      // Notify the server that the player is leaving
      console.log("PLAYER IS LEAVING ROOM ")
      handlePlayerLeaveRoom(cr);
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  

  useEffect(() => {
    if (clearFlippedCards) {
      setLastFlippedCards([]);
      emitCurentRoomChanged(cr);
      setClearFlippedCards(false);
    }
  }, [clearFlippedCards, cr]);
  
  const handlePlayerLeaveRoom = async (chosenRoom) => {
    console.log("GAME -- handlePlayerLeaveRoom -- chosenRoom", chosenRoom)
    console.log("GAME -- handlePlayerLeaveRoom -- userName", userName)
    emitRemoveMemberFromRoom({
      playerName: userName,
      chosenRoom: chosenRoom,
    });  
  }

  useEffect(() => {
    updateCurentRoomAndActiveRooms(setUpdatedActiveRooms, setCurrentRoom);
    updateMatchedCards(setIsMatched);

    return () => {
      removeUpdatedRoomDataListener();
      removeUpdatedMatchedCards();
    };
  }, []);


  const handleFlippedCard = async (cardIndex) => {
    const updatedCard = { ...cr.cardsData[cardIndex] };
    updatedCard.isFlipped = !updatedCard.isFlipped;
    const updatedRoom = { ...cr };
    updatedRoom.cardsData[cardIndex] = updatedCard;
    await emitCurentRoomChanged(updatedRoom);
    return updatedCard;
  };

  const checkForMatch = async (updatedCard) => {
    // Update allFlippedCards by appending the updated card
    const newAllFlippedCards = [...allFlippedCards, updatedCard];
    setAllFlippedCards(newAllFlippedCards);
  
    console.log("Game -- checkForMatch -- allFlippedCards: ", allFlippedCards);
    console.log("Game -- checkForMatch -- newAllFlippedCards: ", newAllFlippedCards);
  
    // If 2 cards have been flipped, check for a match directly from newAllFlippedCards
    if (newAllFlippedCards.length % 2 === 0) {
      const lastTwoFlippedCards = newAllFlippedCards.slice(-2);

      console.log("Game -- checkForMatch -- lastTwoFlippedCards: ", lastTwoFlippedCards);

      // Check for a match here...
      if (lastTwoFlippedCards[0].imageImportName === lastTwoFlippedCards[1].imageImportName) {
        // Successful match
        setIsMatched(true);
      } else {
        console.log("HERE SHOULD COME AOUTO FLIP CARDS BACK")
        // No match, initiate delayed flip-back
        // setTimeout(() => {
        //   // Add code to flip back non-matching cards here...
        // }, 1000); // Delayed flip-back after 1 second
      }
    }
  };
          
  const toggleCardFlip = async (cardId) => {
    const cardIndex = cr.cardsData.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
      let updatedCard = await handleFlippedCard(cardId, cardIndex);
      checkForMatch(updatedCard);
    }
  };

	return (
	  <GameContainer>
	  
		<Wellcome>
		  <div>Wellcome to room: {cr.name}</div>
		</Wellcome>

		{cr !== undefined && cr.id >= 0 && <Players players={cr.currentPlayers} />}

		{cr !== undefined && cr.id >= 0 && (
		  <TougleMatchedCardButton
			isMatched={isMatched}
			setIsMatched={(isMatched) => setIsMatched(isMatched)}
			setClearFlippedCards={setClearFlippedCards}
		  />
		)}

    <CardGallery>
      {isMatched && allFlippedCards.length > 0 ? (
        allFlippedCards.slice(-2).map((card, index) => (
          <MatchedCards
            key={index}
            playerName={userName}
            players={currentRoom.currentPlayers}
            card={card}
          />
        ))
      ) : (
        <>
          { !cr.startGame ? (
            <WaitingMsg />
          ) : (
            cr.cardsData?.map((card, index) => (
              <NikeCard
                key={index}
                playerName={userName}
                card={card}
                isFlipped={card.isFlipped}
                toggleCardFlip={
                  cr.startGame
                    ? (cardId) => toggleCardFlip(cardId)
                    : null // Disable flipping when not enough players
                }
              />
            ))
          )}
        </>
      )}
    </CardGallery>

		
		{cr !== undefined && cr.id >= 0 && (
			<button onClick={() => handlePlayerLeaveRoom(cr)}>Leave Room</button>
		)}

	  </GameContainer>
	);

}

export default Game;
