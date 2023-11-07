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
  updateIsMatched,
  updatePlayerLeft,
  removeUpdatedRoomDataListener,
  emitAddMemberToRoom,
  emitRemoveMemberFromRoom,
  emitCurentRoomChanged,
  emitCurentMatchedCards,
  
  emitCurentIsMatched,
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


  const broadcastChangeCr = async (updatedCr) => {
    await console.log("broadcastChangeCr -- 1111 - updatedCr: ", updatedCr)
    if ( !isEmpty(updatedCr) )  {
      if ( !isEmpty(updatedCr.currentPlayer) && !isEmpty(updatedCr.currentPlayer[0]) )  {
          await console.log("broadcastChangeCr -- 2222 - flippCount-aaa: ", updatedCr.currentPlayer[0].flippCount)
        }
        if ( !isEmpty(updatedCr.currentPlayer) && !isEmpty(updatedCr.currentPlayer[0]) )  {
          await console.log("broadcastChangeCr -- 2222 - flippCount-bbb: ", updatedCr.currentPlayer[1].flippCount)
        }
        await emitCurentRoomChanged({ ...updatedCr });
      }
    }


  const broadcastChangeIsMatched = async (isMatched) => {
    await emitCurentIsMatched(isMatched);
  }

  
  const resetPlayersFlippCount = async () => {
    let updatedCurrentPlayers = {... cr.currentPlayers}
    updatedCurrentPlayers[0].flippCount = 0
    updatedCurrentPlayers[1].flippCount = 0
    const updatedCr = {...cr, currentPlayer: updatedCurrentPlayers}
    await emitCurentRoomChanged({ ...updatedCr });
  }


   useEffect(() => {
    updateCr(setCr)
    updateIsMatched(setIsMatched)
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

  // useEffect(() => {
  //   if (clearFlippedCards) {
  //     setAllFlippedCards([]);
  //     broadcastChangeIsMatched(false);
  //     resetPlayersFlippCount()
  //     setClearFlippedCards(false);
  //   }
  // }, [clearFlippedCards]);
  
  useEffect( () => {
    const asyncClear = async() =>  {
      if (clearFlippedCards) {
        await setAllFlippedCards([]);
        await broadcastChangeIsMatched(false)
        await resetPlayersFlippCount()
        await setClearFlippedCards(false);
        console.log( "useEffect[clearFlippedCards] -- isMatched, cr.currentPlayers: ",
                                                      isMatched, cr.currentPlayers )
      }
    }
    asyncClear()
  }, [clearFlippedCards] );


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
        broadcastChangeIsMatched(true);
      } else {
        broadcastChangeIsMatched(false);
        // Handle non-matching cards here...
      }
    }
  };

  
	const getActivePlayer = () => {
		const activePlayer = cr.currentPlayers.find((player) => player.isActive);
		return {...activePlayer}
	};  

  const handleFlippCount = () =>  {
    let activePlayer = getActivePlayer();
    if (!isEmpty(activePlayer) && cr.currentPlayers.length > 1) {
      const updatedPlayers = cr.currentPlayers.map((player) => {
        if (player.name === activePlayer.name) {
          return { ...activePlayer, flippCount: (isMatched || activePlayer.flippCount>=3) ? 0 : activePlayer.flippCount + 1 };
        } else {
          return { ...player };
        }
      });
      const updatedRoom = { ...cr, currentPlayers: updatedPlayers };
      console.log("handleFlippCount -- FFFFFFF - currentPlayers: isMatched, updatedPlayers", isMatched, updatedPlayers)
      broadcastChangeCr(updatedRoom);
    }
  };


  const updateCardSide = (cardId) =>  {
    const cardIndex = cr.cardsData.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
      const updatedCard = { ...cr.cardsData[cardIndex] };
      updatedCard.isFlipped = !updatedCard.isFlipped;
      const updatedRoom = { ...cr };
      updatedRoom.cardsData[cardIndex] = updatedCard;
      broadcastChangeCr(updatedRoom);
      return updatedCard;
    }
  }


  const toggleCardFlip = async(cardId) => {
      const  updatedCard = await updateCardSide(cardId)
      await checkForMatch(updatedCard);
      await handleFlippCount();
      let activePlayer = getActivePlayer();

      console.log("toggleCardFlip - 3333 - isMatched, CONDITION: ",
                    isMatched,
                    !isEmpty(cr) && !isEmpty(cr.currentPlayers) && 
                    cr.currentPlayers.length > 1 && activePlayer.flippCount >= 3,
                    activePlayer.flippCount
      )

      if (!isEmpty(cr) && !isEmpty(cr.currentPlayers) && cr.currentPlayers.length > 1 && activePlayer.flippCount >= 3) {
        await togglePlayerTurn();
      }
    }


  const handleCardFlip = (cardId) => {
    const currentUserIndex = cr.currentPlayers.findIndex((player) => player.name === userName);
    if (currentUserIndex !== -1 && cr.currentPlayers[currentUserIndex].isActive) {
      toggleCardFlip(cardId);
    }
  };

console.log("BEFORE RENDER -- cr: ", cr)

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
          broadcastChangeIsMatched={(isMatched) => broadcastChangeIsMatched(isMatched)}
          setClearFlippedCards={setClearFlippedCards}
        />
      )}

<CardGallery>
  {isMatched && allFlippedCards && allFlippedCards.length > 0 && cr && cr.currentPlayers && cr.currentPlayers.length > 0 ? (
    allFlippedCards.slice(-2).map((card, index) => (
      <MatchedCards key={index} index={index} playerName={userName} players={cr.currentPlayers} card={card} />
    ))
  )  : (
    <>
      { !isEmpty(cr) && !isEmpty(cr.currentPlayers) &&  cr.currentPlayers.length<2 ? (
        <WaitingMsg />
      ) : (
        cr.cardsData &&
        cr.cardsData.map((card, index) => (
          <NikeCard
            key={index}
            playerName={userName}
            card={card}
            isFlipped={card.isFlipped}
            toggleCardFlip={() => {
              handleCardFlip(card.id);
            }}
          />
        ))
      ) }
    </>
  )}
</CardGallery>


    </GameContainer>
  );
}

export default Game;
