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
  updateCr,
  removeUpdatedRoomDataListener,
  emitAddMemberToRoom,  // IN RoomsList
  emitRemoveMemberFromRoom,
  emitCurentRoomChanged,
  updatePlayerLeft,
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

  console.log("GAme -- location.state: ", location.state)

  const [cr, setCr] = useState({});
  const [isMatched, setIsMatched] = useState(false);
  const [allFlippedCards, setAllFlippedCards] = useState([]);
  const [lastFlippedCards, setLastFlippedCards] = useState([]);
  const [clearFlippedCards, setClearFlippedCards] = useState(false);
  const [playerLeft, setPlayerLeft] = useState(null);

  
  useEffect(() => {
    console.log("Game -- useEffect[currentRoom] -- currentRoom: ", currentRoom)
    console.log("Game -- useEffect[currentRoom] -- userName: ", userName)
    setCr(currentRoom);
  }, [currentRoom]);

 
  useEffect(() => {
    if (clearFlippedCards) {
      setLastFlippedCards([]);
      emitCurentRoomChanged(cr);
      setClearFlippedCards(false);
      setIsMatched(false)
    }
  }, [clearFlippedCards]);


  window.onbeforeunload = async function (e) {
    await updatePlayerLeft(setPlayerLeft);
    await updateCr(setCr);
    if ( !isEmpty(userName) && !isEmpty(cr) )   {
      await emitRemoveMemberFromRoom({
        playerName: userName,
        chosenRoom: cr,
      });
   }
    var dialogText = 'Are you really sure you want to leave?';
    console.log("Game -- handleBeforeUnload -- dialogText: ", dialogText);
    e.returnValue = dialogText;
    return dialogText;
  };
  

  useEffect(() => {
    console.log("Game -- useEffect[] -- cr: ", cr)
    console.log("Game -- useEffect[] -- userName: ", userName)

    updateCr(setCr);
    updateMatchedCards(setIsMatched);
    
    return () => {
      // removeUpdatedRoomDataListener();
      removeUpdatedMatchedCards();
    };
  }, []);

  
  // const handleFlippedCard = async (cardIndex) => {  // Fliip specific card
  //   const updatedCard = { ...cr.cardsData[cardIndex] };
  //   updatedCard.isFlipped = !updatedCard.isFlipped;
  //   const updatedRoom = { ...cr };
  //   updatedRoom.cardsData[cardIndex] = updatedCard;
    
  //   const activePlayerIndex = updatedRoom.currentPlayers.findIndex((player) => player.name === userName);

  //   if (activePlayerIndex !== -1 && cr.currentPlayers[activePlayerIndex].isActive) {
  //     await toggleCardFlip(cardId);
  //     // Increment the flippCount for the active player
  //     const updatedRoom = { ...cr };
  //     updatedRoom.currentPlayers[activePlayerIndex].flippCount++;
  //     await emitCurentRoomChanged(updatedRoom);
  //   }

  //   await emitCurentRoomChanged(updatedRoom);
  //   return updatedCard;

  // };

  const togglePlayerTurn = async () => {
    console.log("Game -- togglePlayerTurn -- cr: ", cr)

    let updatedCurrentPlayers = [...cr.currentPlayers]
    let updatedRoom

    if (cr.currentPlayers !== undefined && cr.currentPlayers.length > 1) { 

      updatedCurrentPlayers = cr.currentPlayers.map((player) => ({
        ...player,
        isActive: !player.isActive,
      } ))
    }
    console.log("Game -- 1111 - updatedRoom -- updatedCurrentPlayers , ", updatedCurrentPlayers)
    updatedRoom = { ...cr, currentPlayers: updatedCurrentPlayers };
    await emitCurentRoomChanged(updatedRoom);
    return updatedRoom;
  };
    

  const checkForMatch = async (updatedCard) => {

    console.log("Game -- checkForMatch -- updatedCard: ", updatedCard)

    // Update allFlippedCards by appending the updated card
    const newAllFlippedCards = [...allFlippedCards, updatedCard];
    setAllFlippedCards(newAllFlippedCards);

    console.log("Game -- checkForMatch -- newAllFlippedCards: ", newAllFlippedCards)
    console.log("Game -- checkForMatch -- allFlippedCards: ", allFlippedCards)


    // If 2 cards have been flipped, check for a match directly from newAllFlippedCards
    if (newAllFlippedCards.length % 2 === 0) {
      const lastTwoFlippedCards = newAllFlippedCards.slice(-2);
      // Check for a match here...
      if (lastTwoFlippedCards[0].name === lastTwoFlippedCards[1].name) {

        // Found a match
        await setIsMatched(true);
      } else {
        await setIsMatched(false);
        console.log("HERE SHOULD COME AOUTO FLIP CARDS BACK")
        // No match, initiate delayed flip-back
        // setTimeout(() => {
        //   // Add code to flip back non-matching cards here...
        // }, 1000); // Delayed flip-back after 1 second
      }
    }  // END 2 CARDS FLIPPED

    return isMatched
  };


	const getActivePlayer = () => {
		const activePlayer = cr.currentPlayers.find((player) => player.isActive);
		console.log("getActivePlayer -- activePlayer: ", activePlayer)
		return activePlayer
	};

    
  const handleFlippCount = async () => {
    let activePlayer = await getActivePlayer();
    let updatedPlayers;
    if (!isEmpty(activePlayer)) {
      if (activePlayer.flippCount < 4) {
        activePlayer.flippCount++;
      }
      if (isMatched) {
        activePlayer.flippCount = 0;
      }  
      // Now, you need to emit the updated player's information along with the room  
      updatedPlayers = await cr.currentPlayers.map((player) => {
        if (player.name === activePlayer.name) {
          return { ...activePlayer };
        } else {
          return { ...player };
        }
      });
      const updatedRoom = await { ...cr, currentPlayers: updatedPlayers }; // Declare updatedRoom here
      // Emit the updated room with the modified player's information
      await emitCurentRoomChanged(updatedRoom);
    }
  };
  

  
  const updateCardsArrWithFlippedCard = async (cardIndex) => {  // Fliip specific card
    const updatedCard = { ...cr.cardsData[cardIndex] };
    updatedCard.isFlipped = !updatedCard.isFlipped;
    let updatedRoom = { ...cr };
    updatedRoom.cardsData[cardIndex] = updatedCard;
    await emitCurentRoomChanged(updatedRoom);
    return updatedCard;
  };

  const toggleCardFlip = async (cardId) => {
    const cardIndex = cr.cardsData.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
      let updatedCard = await updateCardsArrWithFlippedCard(cardIndex);     
      await checkForMatch(updatedCard)
      await handleFlippCount()
      console.log("Game -- toggleCardFlip -- cr: ", cr)
      if ( cr.currentPlayers!==undefined && cr.currentPlayers.length>1 && getActivePlayer().flippCount >= 4 )  {
		    await togglePlayerTurn()
      }
    }
  }

	const handleCardFlip = (cardId) => {
	  const currentUserIndex = cr.currentPlayers.findIndex((player) => player.name === userName);

	  if (currentUserIndex !== -1 && cr.currentPlayers[currentUserIndex].isActive) {
		toggleCardFlip(cardId);
	  }
	};

	return (
	  <GameContainer>

    {playerLeft && <div>{playerLeft} has left the room.</div>}

	  
		<Wellcome>
		  <div>Wellcome to room: {cr.name}</div>
		</Wellcome>

		{cr!==undefined && parseInt(cr.id)>=0 && cr.currentPlayers!==undefined && cr.currentPlayers.length>0 && 
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
        cr.currentPlayers.length > 0 ? (

        allFlippedCards.slice(-2).map((card, index) => (
          <MatchedCards
            key={index}
            index={index}
            playerName={userName}
            players={cr.currentPlayers}
            card={card}
          />
        ))
      ) :  (
        <>
          { cr !== undefined && parseInt(cr.id) >= 0 && cr.currentPlayer!== undefined && cr.currentPlayer.length > 0 ? (
            <WaitingMsg />
          ) : (
            cr.cardsData?.map((card, index) => (

			<NikeCard
			  key={index}
			  playerName={userName}
			  card={card}
			  isFlipped={card.isFlipped}
        toggleCardFlip={() => handleCardFlip(card.id)} // Pass card.id as the parameter
        />

            ))
          )}
        </>
      )}
    </CardGallery>

{/* 		
		{cr !== undefined && parseInt(cr.id) >= 0 && (
			<button onClick={() => handlePlayerLeaveRoom(cr)}>Leave Room</button>
		)} */}

	  </GameContainer>
	);

}

export default Game;
