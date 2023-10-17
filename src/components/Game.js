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
  updateFlippCount,
  removeUpdatedFlippCount,
  emitCurentFlippCount
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

  const [cr, setCr] = useState({});
  const [isMatched, setIsMatched] = useState(false);
  const [allFlippedCards, setAllFlippedCards] = useState([]);
  const [lastFlippedCards, setLastFlippedCards] = useState([]);
  const [clearFlippedCards, setClearFlippedCards] = useState(false);
  const [flippCount, setFlippCount] = useState(0);
  const [playerLeft, setPlayerLeft] = useState(null);


  
  useEffect(() => {
    setCr(currentRoom);
  }, [currentRoom]);

  useEffect(() => {
    console.log("Game -- useEffect[] -- flippCount: ", flippCount);
    if ( flippCount === 0)  {
      emitCurentFlippCount(flippCount); // Emit the initial flippCount value when the component mounts
    }
  }, []);

  
  useEffect(() => {
    if (clearFlippedCards) {
      setLastFlippedCards([]);
      emitCurentRoomChanged(cr);
      setClearFlippedCards(false);
      setIsMatched(false)
	    setFlippCount(0)
    }
  }, [clearFlippedCards]);



  window.onbeforeunload = async function (e) {

    await console.log("onbeforeunload is firing");
  
    await updatePlayerLeft(setPlayerLeft);
    await updateCr(setCr);
    await emitRemoveMemberFromRoom({
      playerName: userName,
      chosenRoom: cr,
    });
    var dialogText = 'Are you really sure you want to leave?';
    console.log("Game -- handleBeforeUnload -- dialogText: ", dialogText);
    e.returnValue = dialogText;
    return dialogText;
  };
  


  useEffect(() => {
    updateCr(setCr);
    updateMatchedCards(setIsMatched);
    updateFlippCount(setFlippCount);
    
    return () => {
      // removeUpdatedRoomDataListener();
      removeUpdatedMatchedCards();
      removeUpdatedFlippCount();
    };
  }, []);



  useEffect(() => {
	if ( !isEmpty(cr) )  {
		handleFlippCount()
	}
  }, [flippCount, isMatched]);

  const handleFlippCount = async () => {
    if (flippCount === 4)  {  // ITS IN HERE TO PREVENT INFINITE USEEFFECT LOOP
        await setFlippCount(0)
		await togglePlayerTurn()
    } 
  };

  
  const handleFlippedCard = async (cardIndex) => {
    const updatedCard = { ...cr.cardsData[cardIndex] };
    updatedCard.isFlipped = !updatedCard.isFlipped;
    const updatedRoom = { ...cr };
    updatedRoom.cardsData[cardIndex] = updatedCard;
    await emitCurentRoomChanged(updatedRoom);
    return updatedCard;
  };

  const togglePlayerTurn = async () => {
    const updatedCurrentPlayers = cr.currentPlayers.map((player) => ({
      ...player,
      isActive: cr.currentPlayers.length > 1 ? !player.isActive : true,
    }));
  
    const updatedRoom = { ...cr, currentPlayers: updatedCurrentPlayers };
    await emitCurentRoomChanged(updatedRoom);
    return updatedRoom;
  };
    

  const checkForMatch = async (updatedCard) => {
    // Update allFlippedCards by appending the updated card
    const newAllFlippedCards = [...allFlippedCards, updatedCard];
    setAllFlippedCards(newAllFlippedCards);
    // If 2 cards have been flipped, check for a match directly from newAllFlippedCards
    if (newAllFlippedCards.length % 2 === 0) {
      const lastTwoFlippedCards = newAllFlippedCards.slice(-2);
      // Check for a match here...
      // if (lastTwoFlippedCards[0].imageImportName === lastTwoFlippedCards[1].imageImportName) {
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
  
  const toggleCardFlip = async (cardId) => {
    await setFlippCount(flippCount+1)
    const cardIndex = cr.cardsData.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
      let updatedCard = await handleFlippedCard(cardId, cardIndex);     
      await checkForMatch(updatedCard)
      await handleFlippCount()
      }
  }

  console.log("GAME - before render -- playerLeft: ", playerLeft, playerLeft===true)

	return (
	  <GameContainer>

    {playerLeft && <div>{playerLeft} has left the room.</div>}

	  
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
            players={cr.currentPlayers}
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
                
                toggleCardFlip={(cardId) => {
                  const activePlayerIndex = cr.currentPlayers.findIndex(player => player.name === userName);
                  if (activePlayerIndex !== -1 && cr.currentPlayers[activePlayerIndex].isActive) {
                    toggleCardFlip(cardId);
                  }
                }}


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
