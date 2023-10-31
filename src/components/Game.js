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
  emitAddMemberToRoom,
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

  const [cr, setCr] = useState({});
  const [isMatched, setIsMatched] = useState(false);
  const [allFlippedCards, setAllFlippedCards] = useState([]);
  const [clearFlippedCards, setClearFlippedCards] = useState(false);
  const [playerLeft, setPlayerLeft] = useState(null);


  const broadcastChangeCr = (updatedCr) => {
    console.log("broadcastChangeCr -- updatedCr: ", updatedCr)
      emitCurentRoomChanged({ ...updatedCr });
  }


  useEffect(() => {
    updateCr(setCr)
    updateMatchedCards(setIsMatched)
    if (!isEmpty(currentRoom) && !isEmpty(userName)) {
      broadcastChangeCr(currentRoom);
    }
  }, [currentRoom]);


  window.onbeforeunload = async function (e) {
    await updatePlayerLeft(setPlayerLeft);
    await updateCr(setCr);
    if (!isEmpty(userName) && !isEmpty(cr)) {
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
    if (clearFlippedCards) {
      setAllFlippedCards([]);
      setIsMatched(false);
      setClearFlippedCards(false);
    }
  }, [clearFlippedCards]);


  const togglePlayerTurn = () => {
    const updatedCurrentPlayers = cr.currentPlayers.map((player) => ({
      ...player,
      isActive: !player.isActive,
      flippCount: 0
    }));
    const updatedRoom = { ...cr, currentPlayers: updatedCurrentPlayers };
    broadcastChangeCr(updatedRoom);
  };


  const checkForMatch = (updatedCard) => {
    const newAllFlippedCards = [...allFlippedCards, updatedCard];
    setAllFlippedCards(newAllFlippedCards);
    if (newAllFlippedCards.length % 2 === 0) {
      const lastTwoFlippedCards = newAllFlippedCards.slice(-2);

      if (lastTwoFlippedCards[0].name === lastTwoFlippedCards[1].name) {
        setIsMatched(true);
      } else {
        setIsMatched(false);
        // Handle non-matching cards here...
      }
    }
  };

  
	const getActivePlayer = () => {
		const activePlayer = cr.currentPlayers.find((player) => player.isActive);
		return {...activePlayer}
	};  

  const handleFlippCount = () => {
    let activePlayer = getActivePlayer();
    console.log("handleFlippCount -- cr.currentPlayers: ", cr.currentPlayers)
    if (!isEmpty(activePlayer) && cr.currentPlayers.length > 1) {
      const updatedPlayers = cr.currentPlayers.map((player) => {
        if (player.name === activePlayer.name) {
          return { ...activePlayer, flippCount: isMatched ? 0 : activePlayer.flippCount + 1 };
        } else {
          return { ...player };
        }
      });
      console.log("handleFlippCount -- updatedPlayers: ", updatedPlayers)
      const updatedRoom = { ...cr, currentPlayers: updatedPlayers };
      broadcastChangeCr(updatedRoom);
    }
  };


  const updateCardsArrWithFlippedCard = (cardIndex) => {
    const updatedCard = { ...cr.cardsData[cardIndex] };
    updatedCard.isFlipped = !updatedCard.isFlipped;
    const updatedRoom = { ...cr };
    updatedRoom.cardsData[cardIndex] = updatedCard;
    broadcastChangeCr(updatedRoom);
    return updatedCard;
  };


  const toggleCardFlip = (cardId) => {
    const cardIndex = cr.cardsData.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
      const updatedCard = updateCardsArrWithFlippedCard(cardIndex);
      checkForMatch(updatedCard);
      handleFlippCount();
      let activePlayer = getActivePlayer();

      console.log("Game -- toggleCardFlip -- activePlayer: ", activePlayer);
      console.log ("CONDITION: ", !isEmpty(cr) && !isEmpty(cr.currentPlayers) && cr.currentPlayers.length > 1 && activePlayer.flippCount >= 4) 

      if (!isEmpty(cr) && !isEmpty(cr.currentPlayers) && cr.currentPlayers.length > 1 && activePlayer.flippCount >= 3) {
        togglePlayerTurn();
      }
    }
  };


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

      {cr && parseInt(cr.id) >= 0 && cr.currentPlayers && cr.currentPlayers.length > 0 && (
        <Players players={cr.currentPlayers} playerName={userName} />
      )}

      {cr && parseInt(cr.id) >= 0 && (
        <TougleMatchedCardButton
          isMatched={isMatched}
          setIsMatched={(isMatched) => setIsMatched(isMatched)}
          setClearFlippedCards={setClearFlippedCards}
        />
      )}

      <CardGallery>
        {isMatched && allFlippedCards && allFlippedCards.length > 0 && cr && cr.currentPlayers && cr.currentPlayers.length > 0 ? (
          allFlippedCards.slice(-2).map((card, index) => (
            <MatchedCards key={index} index={index} playerName={userName} players={cr.currentPlayers} card={card} />
          ))
        ) : (
          <>
            {cr && !isEmpty(cr) && cr.currentPlayer && !isEmpty(cr.currentPlayer) ? (
              <WaitingMsg />
            ) : (
              cr.cardsData &&
              cr.cardsData.map((card, index) => (
                <NikeCard
                  key={index}
                  playerName={userName}
                  card={card}
                  isFlipped={card.isFlipped}
                  toggleCardFlip={() => handleCardFlip(card.id)}
                />
              ))
            )}
          </>
        )}
      </CardGallery>
    </GameContainer>
  );
}

export default Game;
