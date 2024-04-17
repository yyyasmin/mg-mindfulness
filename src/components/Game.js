import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NikeCard from "./NikeCard";
import Players from "./Players";
import isEmpty from "../helpers/isEmpty";
import MatchedCards from "./MatchedCards";
import TougleMatchedCardButton from "./TougleMatchedCardButton";
import { useLocation } from "react-router-dom";
import { calculateCardSize } from "../helpers/init";
import {
  updateCr,
  updateIsMatched,
  updatePlayerLeft,
  emitRemoveMemberFromRoom,
  emitRemoveRoomFromActiveRooms,
  emitCurentRoomChanged,
  emitCurentIsMatched,
} from "../clientSocketServices";

const GameContainer = styled.div`
  background-color: #fdf2e9;
  color: brown;
  border-radius: 25px;
  padding: 20px;
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
  background-color: #fad5a5;
  border-radius: 25px;
  min-height: 80vh; /* Changed height to min-height */
  padding: 20px;
`;

function Game() {
  const location = useLocation();
  const { userName, currentRoom } = location.state;
  const [cr, setCr] = useState({});
  const [isMatched, setIsMatched] = useState(false);
  const [last2FlippedCards, setLast2FlippedCards] = useState([]);
  const [allFlippedCards, setAllFlippedCards] = useState([]);
  const [clearFlippedCards, setClearFlippedCards] = useState(false);
  const [playerLeft, setPlayerLeft] = useState(null);
  const [firstCardId, setFirstCardId] = useState(0);
  const [firstCardFlipped, setFirstCardFlipped] = useState(false);
  const [firstCardFlippedBack, setFirstCardFlippedBack] = useState(false);
  const [secondCardId, setSecondCardId] = useState(0);
  const [secondCardFlipped, setSecondCardFlipped] = useState(false);
  const [secondCardFlippedBack, setSecondCardFlippedBack] = useState(false);
  const [toggleFlag, setToggleFlag] = useState(false);

  const broadcastChangeCr = async (updatedCr) => {
    //console.log("ÏN broadcastChangeCr -- updatedCr:", updatedCr)
    if (!isEmpty(updatedCr)) {
      await emitCurentRoomChanged({ ...updatedCr });
    }
  };

  const broadcastChangeIsMatched = async (isMatched, last2FlippedCards) => {
    if (!isEmpty(cr) && !isEmpty(cr.currentPlayers)) {
      await emitCurentIsMatched(cr, isMatched, last2FlippedCards);
    }
  };

  const broadcastChangeCardSize = async (cr) => {
    let updateCrWithNewCardSize;
    if (!isEmpty(cr)) {
      if (!isEmpty(cr.cardsData)) {
        let cardSize = calculateCardSize(cr.cardsData.length);
        let MatchedCardSize = calculateCardSize(2);
        updateCrWithNewCardSize = {
          ...cr,
          cardSize: cardSize,
          MatchedCardSize: MatchedCardSize,
        };
      }
      broadcastChangeCr(updateCrWithNewCardSize);
    }
  };

  const resetPlayersFlippCount = () => {
    let updatedCurrentPlayers;
    if (!isEmpty(cr.currentPlayers)) {
      updatedCurrentPlayers = cr.currentPlayers.map((player) => ({
        ...player,
        flippCount: 0,
      }));
    }
    const updatedCr = { ...cr, currentPlayers: updatedCurrentPlayers };
    broadcastChangeCr(updatedCr);
  };

  const handleResize = () => {
    broadcastChangeCardSize(cr);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    updateCr(setCr);
    broadcastChangeCr(currentRoom);
    updateIsMatched(setIsMatched, setLast2FlippedCards);
    if (!isEmpty(currentRoom) && !isEmpty(userName)) {
      broadcastChangeCardSize(currentRoom);
    }
  }, [currentRoom]);

  useEffect(() => {
    console.log(
      "DEBUG useEffect -- isMatched, cr.MatchedCardSize: ",
      isMatched,
      cr.MatchedCardSize
    );
  }, [cr.MatchedCardSize]);

  window.onbeforeunload = async function (e) {
    await updatePlayerLeft(setPlayerLeft);
    await updateCr(setCr);
    if (!isEmpty(userName) && !isEmpty(cr)) {
      await emitRemoveMemberFromRoom({
        chosenRoom: cr,
        playerName: userName,
      });
    }
    var dialogText = "Are you really sure you want to leave?";
    e.returnValue = dialogText;
    return dialogText;
  };

  useEffect(() => {
    const asyncClear = async () => {
      if (clearFlippedCards) {
        await setAllFlippedCards([]);
        await broadcastChangeIsMatched(false, [], 0);
        await resetPlayersFlippCount();
        await setClearFlippedCards(false);
      }
    };
    asyncClear();
  }, [clearFlippedCards]);

  const togglePlayerTurn = () => {
    console.log("33333333333333333333333333333")
    console.log("cr.currentPlayers.length > 1", cr.currentPlayers.length > 1, cr.currentPlayers.length)

    //console.log("IN togglePlayerTurn");
    if (
      !isEmpty(cr) &&
      !isEmpty(cr.currentPlayers) &&
      cr.currentPlayers.length > 1
    ) {
      console.log("444444444444444444444444444444")

      const updatedCurrentPlayers = cr.currentPlayers.map((player) => ({
        ...player,
        isActive: !player.isActive,
      }));
      const updatedRoom = { ...cr, currentPlayers: updatedCurrentPlayers };
      broadcastChangeCr(updatedRoom);
    }
  };

  const updateMatchingCards = (cardsData, cardsToUpdate) => {
    return cardsData.map((card) => {
      if (cardsToUpdate.some((flipCard) => flipCard.id === card.id)) {
        return cardsToUpdate.find(
          (updatedCard) => updatedCard.id === card.id
        );
      }
      return card;
    });
  };

  const checkForMatch = (updatedCard) => {
    const newAllFlippedCards = [...allFlippedCards, updatedCard];
    let tmpIsMatched = false;
    let updatedLast2FlippedCards = [];

    setAllFlippedCards(newAllFlippedCards);
    if (newAllFlippedCards.length % 2 === 0) {
      const last2FlippedCards = newAllFlippedCards.slice(-2);
      if (last2FlippedCards[0].name === last2FlippedCards[1].name) {
        tmpIsMatched = true;
      }
      if (tmpIsMatched) {
        updatedLast2FlippedCards = last2FlippedCards.map((card) => ({
          ...card,
          faceType: "matched",
        }));
        broadcastChangeIsMatched(true, updatedLast2FlippedCards);
        cr.cardsData = updateMatchingCards(cr.cardsData, updatedLast2FlippedCards);
      } else {
        broadcastChangeIsMatched(false, last2FlippedCards);
        cr.cardsData = updateMatchingCards(cr.cardsData, last2FlippedCards);
      }
      broadcastChangeCr(cr);
    }
  };

  const getActivePlayer = () => {
    const activePlayer = cr.currentPlayers.find((player) => player.isActive);
    return { ...activePlayer };
  };

  const getCardIndexByCardId = (cardId) => {
    return cr.cardsData.findIndex((card) => card.id === cardId);
  };

  const updateCardSide = async (cardId, cardIdx) => {
    //console.log("IN updateCardSide cardId:", cardId,  " cardIdx:", cardIdx)

    const updatedCard = { ...cr.cardsData[cardIdx] };
    await updatedCard.faceType === "back"
      ? (updatedCard.faceType = "front")
      : (updatedCard.faceType = "back");
    const updatedRoom = { ...cr };
    updatedRoom.cardsData[cardIdx] = updatedCard;
    //console.log("IN updateCardSide AFTER FLIPING CARD -- CARD IN IDX:", cardIdx, "IS:", updatedCard)
    //console.log("IN updateCardSide EMITING ROOM:", updatedRoom)

    broadcastChangeCr(updatedRoom);
    return updatedCard;
  };

  const toggleCardFlip = async (cardId, cardIdx) => {
    //console.log("IN toggleCardFlip cardId:", cardId,  " cardIdx:", cardIdx)
    const updatedCard = await updateCardSide(cardId, cardIdx);
    await checkForMatch(updatedCard);
  };

  const cardInLast2FlippedCards = (cardId) => {
    return last2FlippedCards.some((card) => card.id === cardId);
  };

  useEffect(() => {
    console.log("66666666666666666666666666666", cr.currentPlayers)
    console.log("IN useEffect[firstCardFlippedBack, secondCardFlippedBack, isMatched]:", firstCardFlippedBack, secondCardFlippedBack)
    console.log("isMatched:", isMatched)

    if ((firstCardFlippedBack && secondCardFlippedBack) || isMatched) {
      console.log("777777777777777777777777", cr.currentPlayers)
      setFirstCardFlippedBack(false);
      setSecondCardFlippedBack(false);
      setFirstCardFlipped(false);
      setSecondCardFlipped(false);
      setToggleFlag(true);
    }
  }, [firstCardFlippedBack, secondCardFlippedBack, isMatched]);

  useEffect(() => {
    console.group("555555555555555555555555")

    console.group("IN useEffect[toggleFlag] -- toggleFlag: ", toggleFlag)
    console.group("IN useEffect[toggleFlag] -- cr=P: ", cr.currentPlayers)

    if (toggleFlag) {
      togglePlayerTurn();
      setToggleFlag(false);
    }
  }, [toggleFlag]);


  const handleCardFlip = async (cardId) => {

    console.log("IN GAME -- handleCardFlip -- cr.currentPlayers: ", cr.currentPlayers)

    const currentUserIndex = cr.currentPlayers.findIndex(
      (player) => player.name === userName
    );
    const cardIdx = getCardIndexByCardId(cardId);
    console.log("11111111111111111111")
    console.log("currentUserIndex !== -1", currentUserIndex !== -1, currentUserIndex)
    console.log("cr.currentPlayers[currentUserIndex].isActive ", cr.currentPlayers[currentUserIndex].isActive , cr.currentPlayers[currentUserIndex])
    console.log("cr.cardsData[cardIdx].faceType !== matched", cr.cardsData[cardIdx].faceType)

    if (
      currentUserIndex !== -1 &&
      cr.currentPlayers[currentUserIndex].isActive &&
      cr.cardsData[cardIdx].faceType !== "matched"
    ) {
      console.log("22222222222222222222222")

      if (!firstCardFlipped && !secondCardFlipped) {
        await setFirstCardFlippedBack(false);
        await setSecondCardFlippedBack(false);
        await setFirstCardId(cardId);
        await setFirstCardFlipped(true);
        await toggleCardFlip(cardId, cardIdx);
      } else if (!secondCardFlipped && cardId !== firstCardId) {
        await setSecondCardId(cardId);
        await setSecondCardFlipped(true);
        await toggleCardFlip(cardId, cardIdx);
      } else if (firstCardFlipped && secondCardFlipped) {
        if (cardId === firstCardId && !firstCardFlippedBack) {
          await setFirstCardFlippedBack(true);
          await toggleCardFlip(cardId, cardIdx);
        } else if (cardId === secondCardId && !secondCardFlippedBack) {
          await setSecondCardFlippedBack(true);
          await toggleCardFlip(cardId, cardIdx);
        }
      }
    }
  };


  console.log("IN GAME - before return cr: ", cr);
  console.log("IN GAME - before return CONDITION--!isEmpty(cr.cardSize): ", !isEmpty(cr.cardSize), cr.cardSize);

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
          broadcastChangeIsMatched={(isMatched, last2FlippedCards) => broadcastChangeIsMatched(isMatched, last2FlippedCards)}
          setClearFlippedCards={setClearFlippedCards}
        />
      )}

      <CardGallery>
        {isMatched &&
          last2FlippedCards &&
          last2FlippedCards.length > 0 &&
          !isEmpty(cr) && !isEmpty(cr.currentPlayers) && !isEmpty(cr.MatchedCardSize) && 
          cr.currentPlayers.length > 0 ? (
            last2FlippedCards.map((card, index) => (
              <MatchedCards
                key={index} 
                index={index}
                playerName={userName} 
                players={cr.currentPlayers} 
                cardSize={cr.MatchedCardSize} 
                card={card} />
            ))
          ) : (
            <>
              {  
                cr.cardsData &&
                !isEmpty(cr.cardSize) &&
                cr.cardsData.map((card, index) => (
                  <NikeCard
                    key={index}
                    playerName={userName}
                    card={card}
                    faceType={card.faceType}
                    cardSize={cr.cardSize}
                    frameColor={cr.frameColor}

                    toggleCardFlip={() => {
                      handleCardFlip(card.id);
                    }}
                  />
                ))
              }
            </>
          )}
      </CardGallery>
    </GameContainer>
  );
}

export default Game;
