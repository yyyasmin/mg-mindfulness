import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NikeCard from "./NikeCard";
import Players from "./Players";
import WaitingMsg from "./WaitingMsg";
import isEmpty from "../helpers/isEmpty";

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
    
    if ( !isEmpty(chosenRoom) ) {
      console.log("GAME -- 2222-handlePlayerLeaveRoom -- isEmpty(chosenRoom)", isEmpty(chosenRoom))
      console.log("GAME -- 2222-handlePlayerLeaveRoom -- cr", cr)
      console.log("GAME -- handlePlayerLeaveRoom -- userName", userName)
      emitRemoveMemberFromRoom({
        playerName: userName,
        chosenRoom: cr,
      });
      await updateCurentRoom(setCurrentRoom);
    }  
  }

  useEffect( () => {
    console.log("Game -- 0000 - useEffect[cr] -- cr: ", cr)

    const handleBeforeUnload = (event) => {
      console.log("Game -- useEffect[] -- handleBeforeUnload -- event: ", event)
      console.log("Game -- 1111 - useEffect[] -- handleBeforeUnload -- cr: ", cr)
      if ( !isEmpty(cr) )  {
        event.preventDefault();
        event.returnValue = ""; // Required for Chrome
        // Notify the server that the player is leaving
        console.log("PLAYER ", userName, " IS LEAVING ROOM ", cr)
        handlePlayerLeaveRoom(cr);
      }
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [cr]);
  

  useEffect(() => {
    if (clearFlippedCards) {
      setLastFlippedCards([]);
      emitCurentRoomChanged(cr);
      setClearFlippedCards(false);
      setIsMatched(false)
    }
  // }, [clearFlippedCards, cr]);
  }, [clearFlippedCards]);

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
    await emitCurentRoomChanged(updatedRoom);
    return updatedCard;
  };

              
  const togglePlayerTurn = async () => {
    const updatedCurrentPlayers = [...cr.currentPlayers];
    updatedCurrentPlayers.forEach((player) => {
      player.isActive = !player.isActive;
    });
    const updatedRoom = { ...cr, currentPlayers: updatedCurrentPlayers };
    await emitCurentRoomChanged(updatedRoom);
    return updatedRoom;
  };
  

  const checkForMatch = async (updatedCard) => {
    // Update allFlippedCards by appending the updated card
    const newAllFlippedCards = [...allFlippedCards, updatedCard];
    let localIsMatched = false

    setAllFlippedCards(newAllFlippedCards);
    
    // If 2 cards have been flipped, check for a match directly from newAllFlippedCards
    if (newAllFlippedCards.length % 2 === 0) {
      const lastTwoFlippedCards = newAllFlippedCards.slice(-2);

      console.log("Game -- checkForMatch -- lastTwoFlippedCards: ", lastTwoFlippedCards);

      // Check for a match here...
      if (lastTwoFlippedCards[0].imageImportName === lastTwoFlippedCards[1].imageImportName) {
        // Found a match
        setIsMatched(true);
        localIsMatched = true
      } else {
        console.log("HERE SHOULD COME AOUTO FLIP CARDS BACK")
        // No match, initiate delayed flip-back
        // setTimeout(() => {
        //   // Add code to flip back non-matching cards here...
        // }, 1000); // Delayed flip-back after 1 second
      }
    }  // END 2 CARDS FLIPPED
    return localIsMatched
  };

            
  const toggleCardFlip = async (cardId) => {
    let localIsMatched = false
    const cardIndex = cr.cardsData.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
      let updatedCard = await handleFlippedCard(cardId, cardIndex);
      localIsMatched = await checkForMatch(updatedCard)
      // if ( localIsMatched )  {  // IF THERE IS A MATCH
      if ( isMatched )  {
        setFlippedCardCount(0);
      }
      else  {
        // HANFLE PLAYER TURN
        if (flippedCardCount === 3) {  // 3 is the prevous => next is 4
          // Toggle the turn after flipping two pairs of cards
          await togglePlayerTurn();
          // Reset the flipped card count
          setFlippedCardCount(0);  // it will be 4 so turned should be switched
        }     
        // else {
        //   setFlippedCardCount(flippedCardCount+1)
        // }
      }
    }
  }
 

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
        cr.currentPlayers !== undefined &&
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
