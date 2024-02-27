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
  height: calc(100vh - 100px);
  justify-content: space-between;
`;

function Game() {
  const location = useLocation();
  const { userName, currentRoom } = location.state

  ////////console.log("IN GAME -- currentRoom: ", currentRoom)

  const [cr, setCr] = useState({});

  const [isMatched, setIsMatched] = useState(false);
  const [last2FlippedCards, setLast2FlippedCards] = useState([]);

  const [allFlippedCards, setAllFlippedCards] = useState([]);
  const [clearFlippedCards, setClearFlippedCards] = useState(false);
  const [playerLeft, setPlayerLeft] = useState(null);
  
  // FORCE PAIR FLIIPPING FLOW
  const [firstCardId, setFirstCardId] = useState(0);
  const [firstCardFlipped, setFirstCardFlipped] = useState(false);
  const [firstCardFlippedBack, setFirstCardFlippedBack] = useState(false);

  const [secondCardId, setSecondCardId] = useState(0);
  const [secondCardFlipped, setSecondCardFlipped] = useState(false);
  const [secondCardFlippedBack, setSecondCardFlippedBack] = useState(false);

  const [toggleFlag, setToggleFlag] = useState(false);

  const broadcastChangeCr = async (updatedCr) => {
    if ( !isEmpty(updatedCr) )  {
        await emitCurentRoomChanged({ ...updatedCr });
    }
  }


  const broadcastChangeIsMatched = async (isMatched, last2FlippedCards) => {
    //////console.log("IN broadcastChangeIsMatched -- last2FlippedCards: ", last2FlippedCards)
    if ( !isEmpty(cr) && !isEmpty(cr.currentPlayers) )
    await emitCurentIsMatched(isMatched, last2FlippedCards);
  }

  const broadcastChangeCardSize = async (cr) => {
    let updateCrWithNewCardSize
    if ( !isEmpty(cr) ) {
      ////////console.log("IN broadcastChangeCardSize -- cr.cardsData: ", cr.cardsData)
      if ( !isEmpty(cr.cardsData) ) {
        let cardSize = calculateCardSize(cr.cardsData.length)
        updateCrWithNewCardSize = {...cr, cardSize: cardSize}
      }
		  broadcastChangeCr(updateCrWithNewCardSize)
    }
  };


  const resetPlayersFlippCount = () => {
    ////////console.log("IN resetPlayersFlippCount -- cr: ", cr)
    let updatedCurrentPlayers
    if  ( !isEmpty(cr.currentPlayers) )  {
      updatedCurrentPlayers = cr.currentPlayers.map((player) => ({
        ...player,
        flippCount: 0,
      }));
    }
    const updatedCr = {...cr, currentPlayers: updatedCurrentPlayers}
    broadcastChangeCr(updatedCr);
  }


  const handleResize = () => {
		broadcastChangeCardSize(cr);
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  useEffect(() => {
    updateCr(setCr)
	broadcastChangeCr(currentRoom);
    updateIsMatched(setIsMatched, setLast2FlippedCards)
    if (!isEmpty(currentRoom) && !isEmpty(userName)) {
      broadcastChangeCardSize(currentRoom);  // Update Cr is in broadcastChangeCardSize
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
      if ( !isEmpty(cr) && cr.currentPlayers==[] ) {
        emitRemoveRoomFromActiveRooms(cr.id)
      }
    }
    var dialogText = 'Are you really sure you want to leave?';
    ////////console.log("Game -- handleBeforeUnload -- dialogText: ", dialogText);
    e.returnValue = dialogText;
    return dialogText;
  };
  
   
  useEffect( () => {
    ////console.log("CR - BEFORE -- cr:", cr)
    const asyncClear = async() =>  {
      if (clearFlippedCards) {
        await setAllFlippedCards([]);
        await broadcastChangeIsMatched(false, [], 0)
        await resetPlayersFlippCount()
        await setClearFlippedCards(false);
      }
    }
    asyncClear()
    ////console.log("CR - AFTER -- cr:", cr)

  }, [clearFlippedCards] );


  const togglePlayerTurn = () => {
    if ( !isEmpty(cr) && !isEmpty(cr.currentPlayers) && cr.currentPlayers.length>1 )  {
      console.log("IN togglePlayerTurn")
      const updatedCurrentPlayers = cr.currentPlayers.map((player) => ({
        ...player,
        isActive: !player.isActive,
        flippCount: 0
      }));
      const updatedRoom = { ...cr, currentPlayers: updatedCurrentPlayers };
      console.log("IN togglePlayerTurn -- updatedRoom: ", updatedRoom)
  
      broadcastChangeCr(updatedRoom);

    }

  };


  const updateMatchingCards = (cardsData, cardsToUpdate) => {
    return cardsData.map(card => {
      if (cardsToUpdate.some(flipCard => flipCard.id === card.id)) {
        return cardsToUpdate.find(updatedCard => updatedCard.id === card.id);
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
      ////////console.log("IN checkForMatch -- last2FlippedCards: ", last2FlippedCards)
      if (last2FlippedCards[0].name === last2FlippedCards[1].name) {
        tmpIsMatched = true;
      }
      if (tmpIsMatched) {
        // Set faceType to matched for both cards
        updatedLast2FlippedCards = last2FlippedCards.map(card => ({
          ...card,
          faceType: "matched"
        }));
        // Update the matching cards in cardsData
        broadcastChangeIsMatched(true, updatedLast2FlippedCards);
        cr.cardsData = updateMatchingCards(cr.cardsData, updatedLast2FlippedCards);
      } else {  // NO MATCH
        broadcastChangeIsMatched(false, last2FlippedCards);
        cr.cardsData = updateMatchingCards(cr.cardsData, last2FlippedCards);
        // Handle non-matching cards here...
      }
      broadcastChangeCr(cr);

    }
    ////console.log("IN END OF checkForMatch -- last2FlippedCards: ", last2FlippedCards);
    ////console.log("IN END OF checkForMatch -- updatedLast2FlippedCards: ", updatedLast2FlippedCards);
    ////console.log("IN END OF checkForMatch -- cr: ", cr);
  }
  
  
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
      ////////console.log("handleFlippCount -- FFFFFFF - currentPlayers: isMatched, updatedPlayers", isMatched, updatedPlayers)
      broadcastChangeCr(updatedRoom);
    }
  };

  const getCardIndexByCardId = (cardId) =>  {
    return cr.cardsData.findIndex((card) => card.id === cardId);
  }

  const updateCardSide = async (cardId, cardIdx) =>  {
      const updatedCard = { ...cr.cardsData[cardIdx] };
      ////console.log("IN updateCardSide -- AAA -- updatedCard.faceType: ", updatedCard.faceType, updatedCard)
      await updatedCard.faceType === "back" ?  updatedCard.faceType = "front" : updatedCard.faceType = "back"
      ////console.log("IN updateCardSide -- BBB -- updatedCard.faceType: ", updatedCard.faceType, updatedCard)

      const updatedRoom = { ...cr };
      updatedRoom.cardsData[cardIdx] = updatedCard;
      broadcastChangeCr(updatedRoom);
      return updatedCard
  }

  const toggleCardFlip = async(cardId, cardIdx) => {
    const  updatedCard = await updateCardSide(cardId, cardIdx)
    await checkForMatch(updatedCard);
    ////console.log("IN updateCardSide -- CCCC checkForMatch -- updatedCard.faceType: ", updatedCard.faceType, updatedCard)
    ////console.log("IN updateCardSide -- DDDD checkForMatch -- cr: ", cr)

    // await handleFlippCount();
    // let activePlayer = getActivePlayer();
    // if ( !isEmpty(cr) &&
    //     !isEmpty(cr.currentPlayers) &&
    //     cr.currentPlayers.length > 1 &&
    //     activePlayer.flippCount >= 3 ) {
    //   await togglePlayerTurn();
    // }
  }

  const cardInLast2FlippedCards = (cardId) => {
    return last2FlippedCards.some(card => card.id === cardId);
  };
  
  useEffect( () => {  // RESET FORCE FLIIPING CORRECT FLOW RESET VARS
    if ( (firstCardFlippedBack && secondCardFlippedBack) || isMatched ) {
      console.log("6666 -- RESET VARS");
      setFirstCardFlippedBack(false);
      setSecondCardFlippedBack(false);
      setFirstCardFlipped(false);
      setSecondCardFlipped(false);
      setToggleFlag(true);
    } }, [firstCardFlippedBack, secondCardFlippedBack, isMatched] );

    useEffect(() => {
      if (toggleFlag && !isMatched) {
        togglePlayerTurn();
        setToggleFlag(false);
      }
    }, [toggleFlag, isMatched]);

    
  const handleCardFlip = async(cardId) => {
    const currentUserIndex = cr.currentPlayers.findIndex((player) => player.name === userName);
    const cardIdx = getCardIndexByCardId(cardId);

    console.log("IN handleCardFlip -- cardIdx: ", cardIdx)
    console.log("IN handleCardFlip -- cardId: ", cardId)
    console.log("IN handleCardFlip -- firstCardId: ", firstCardId, firstCardFlipped)
    console.log("IN handleCardFlip -- secondCardId: ", secondCardId, secondCardFlipped)
    console.log("IN handleCardFlip -- cardId === secondCardId: ", cardId === secondCardId, cardId, secondCardId)
    console.log("IN handleCardFlip -- firstCardFlipped && secondCardFlipped: ", firstCardFlipped && secondCardFlipped, firstCardFlipped, secondCardFlipped)


    if ( currentUserIndex !== -1 &&
         cr.currentPlayers[currentUserIndex].isActive &&
         cr.cardsData[cardIdx].faceType !== "matched"  ) {

          console.log("0000 -- cr.cardsData[cardIdx].faceType: ", cr.cardsData[cardIdx].faceType)

        if (!firstCardFlipped && !secondCardFlipped) {
          // Flip the first card
          console.log("1111 -- !firstCardFlipped && !secondCardFlipped")
          await setFirstCardFlippedBack(false);
          await setSecondCardFlippedBack(false);

          await setFirstCardId(cardId);
          await setFirstCardFlipped(true);
          await toggleCardFlip(cardId, cardIdx);

        } else if (!secondCardFlipped && cardId !== firstCardId) {
           console.log("2222 -- !secondCardFlipped && cardId !== firstCardId")
          // Flip the second card
          await setSecondCardId(cardId);
          await setSecondCardFlipped(true);
          await toggleCardFlip(cardId, cardIdx);

        // FLIPP BACK IF THERE IS NO MATCH
        } else if (firstCardFlipped && secondCardFlipped) {
           console.log("3333 -- firstCardFlipped && secondCardFlipped")

          // Flip back the first or second card
          if ( cardId === firstCardId && !firstCardFlippedBack ) {
            console.log("4444 -- cardId === firstCardId")
            await setFirstCardFlippedBack(true);
            // Flip back the first card
            console.log("IN handleCardFlip -- BEFORE tougle- cr: ", cr)
            await toggleCardFlip(cardId, cardIdx);                       
            console.log("IN handleCardFlip -- AFTER tougle- cr: ", cr)

          } else if (cardId === secondCardId && !secondCardFlippedBack ) {
            console.log("5555 -- cardId === secondCardId")
            // Flip back the second card
            await setSecondCardFlippedBack(true);
            await toggleCardFlip(cardId, cardIdx);
          }
        }
    }
  };
  

////////console.log("BEFORE RENDER -- isMatched: ", isMatched)
////////console.log("BEFORE RENDER -- last2FlippedCards: ", last2FlippedCards)

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
  { isMatched &&
    last2FlippedCards &&
    last2FlippedCards.length > 0 &&
    cr && cr.currentPlayers && 
    cr.currentPlayers.length > 0 ? (
    last2FlippedCards.map((card, index) => (

      <MatchedCards
          key={index} 
          index={index}
          playerName={userName} 
          players={cr.currentPlayers} 
          card={card} />
    ))
  )  : (
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
