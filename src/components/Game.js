import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NikeCard from "./NikeCard";
import Players from "./Players";
import WaitingMsg from "./WaitingMsg";

import MatchedCards from "./MatchedCards";
import TougleMatchedCardButton from "./TougleMatchedCardButton";
import { useLocation } from "react-router-dom";
import {
  updateCurentRoom,
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
  const [isMatched, setIsMatched] = useState(false);
  const [allFlippedCards, setAllFlippedCards] = useState([]);
  const [lastFlippedCards, setLastFlippedCards] = useState([]);
  const [clearFlippedCards, setClearFlippedCards] = useState(false);
  const [flippedCardCount, setFlippedCardCount] = useState(0);

  console.log("Game -- 6666-useEffect[currentRoom] -- currentRoom: ", currentRoom)

  useEffect(() => {
    console.log("Game -- 7777-useEffect[currentRoom] -- currentRoom: ", currentRoom)
    setCurrentRoom(currentRoom);
  }, [currentRoom]);

  const handlePlayerLeaveRoom = async (chosenRoom) => {
    console.log("GAME -- handlePlayerLeaveRoom -- chosenRoom", chosenRoom)
    console.log("GAME -- handlePlayerLeaveRoom -- userName", userName)
    emitRemoveMemberFromRoom({
      playerName: userName,
      chosenRoom: chosenRoom,
    });  
  }

  useEffect( () => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Required for Chrome
      // Notify the server that the player is leaving
      console.log("PLAYER IS LEAVING ROOM ")
      handlePlayerLeaveRoom(cr);
      setTimeout(() => {
        console.log("Game -- useEffect[]  -- handleBeforeUnload -- TRYING TO SLOW DOWN - REMOVING PLAYER ", userName, "FROM ROOM ", cr)
      }, 5000);
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
    

  useEffect(() => {
    updateCurentRoom(setCurrentRoom);
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
    console.log("Game -- handleFlippedCard -- emit - updatedRoom: ", updatedRoom)
    await emitCurentRoomChanged(updatedRoom);
    return updatedCard;
  };

              
  const togglePlayerTurn = async () => {
    const updatedCurrentPlayers = [...cr.currentPlayers];
    console.log("Game -- togglePlayerTurn -- updatedCurrentPlayers: ", updatedCurrentPlayers);
    updatedCurrentPlayers.forEach((player) => {
      player.isActive = !player.isActive;
    });
    const updatedRoom = { ...cr, currentPlayers: updatedCurrentPlayers };
    console.log("Game -- togglePlayerTurn -- emit - updatedRoom: ", updatedRoom); 
    await emitCurentRoomChanged(updatedRoom);
    return updatedRoom;
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
        // Found a match
        setIsMatched(true);
        setFlippedCardCount(0);
      } else {
        console.log("HERE SHOULD COME AOUTO FLIP CARDS BACK")
        // No match, initiate delayed flip-back
        // setTimeout(() => {
        //   // Add code to flip back non-matching cards here...
        // }, 1000); // Delayed flip-back after 1 second
      }
    }  // END 2 CARDS FLIPPED
  };

            
  const toggleCardFlip = async (cardId) => {
    console.log("Game -- toggleCardFlip -- cardId: ", cardId)
    const cardIndex = cr.cardsData.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
      let updatedCard = await handleFlippedCard(cardId, cardIndex);
      checkForMatch(updatedCard);

      // HANFLE PLAYER TURN
      setFlippedCardCount(flippedCardCount + 1);
      if (flippedCardCount === 3) {
        // Toggle the turn after flipping two pairs of cards
        togglePlayerTurn();
        // Reset the flipped card count
        setFlippedCardCount(0);
      }
    }
  };


  console.log("GAME -- BEFORE RENDER return -- cr:", cr)

  // console.log("GAME -- BEFORE RENDER return -- !cr.startGame: ", !cr.startGame)
  // console.log("GAME -- BEFORE RENDER return -- cr[0]: ", cr[0])
  // console.log("GAME -- BEFORE RENDER return -- MATCHED CONDITION -- : isMatched", isMatched)
  // console.log("GAME -- BEFORE RENDER return -- MATCHED CONDITION -- : allFlippedCards.length>0", allFlippedCards, allFlippedCards.length>0) 
  // console.log("GAME -- BEFORE RENDER return -- MATCHED CONDITION -- : cr", cr)
  // console.log("GAME -- BEFORE RENDER return -- MATCHED CONDITION -- : cr!==undefined", cr!==undefined)
  // console.log("GAME -- BEFORE RENDER return -- MATCHED CONDITION -- : cr.currentPlayers!=undefined", cr.currentPlayers!=undefined)

	return (
	  <GameContainer>
	  
		<Wellcome>
		  <div>Wellcome to room: {cr.name}</div>
		</Wellcome>

		{cr !== undefined && parseInt(cr.id) >= 0 && 
    <Players 
      players={cr.currentPlayers}
      playerName={userName}
    />}

		{cr !== undefined && parseInt(cr.id) >= 0 && (
		  <TougleMatchedCardButton
			isMatched={isMatched}
			setIsMatched={(isMatched) => setIsMatched(isMatched)}
			setClearFlippedCards={setClearFlippedCards}
		  />
		)}

    <CardGallery>
      {
        isMatched &&
        allFlippedCards !== undefined &&
        allFlippedCards.length > 0 &&
        cr !== undefined && 
        cr.currentPlayers != undefined &&
        cr.currentPlayers.length === 2 ? (

        allFlippedCards.slice(-2).map((card, index) => (
          <MatchedCards
            key={index}
            index={index}
            playerName={userName}
            players={currentRoom.currentPlayers}
            card={card}
          />
        ))
      ) :  (
        <>
          { cr !== undefined && parseInt(cr.id) >= 0 && cr.currentPlayer!== undefined && cr.currentPlayer.length !== 2 ? (
            <WaitingMsg />
          ) : (
            cr.cardsData?.map((card, index) => (
              <NikeCard
                key={index}
                playerName={userName}
                card={card}
                isFlipped={card.isFlipped}
                toggleCardFlip={
                  (cardId) => toggleCardFlip(cardId)
                }
              />
            ))
          )}
        </>
      )}
    </CardGallery>

		
		{cr !== undefined && parseInt(cr.id) >= 0 && (
			<button onClick={() => handlePlayerLeaveRoom(cr)}>Leave Room</button>
		)}

	  </GameContainer>
	);

}

export default Game;
