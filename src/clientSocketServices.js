import io from "socket.io-client";
import { CHOSEN_PROXY_URL } from "./helpers/ServerRoutes.js";

export const socket = io(CHOSEN_PROXY_URL);

export const emitAddMemberToRoom = ({ playerName, chosenRoom }) => {
  socket.emit('CREATE_ROOM_AND_ADD_PLAYER', { playerName, chosenRoom });
};

export const emitRemoveMemberFromRoom = ({ playerName, chosenRoom }) => {
  socket.emit('REMOVE_PLAYER_FROM_ROOM', { playerName, chosenRoom });
};

export const emitCurentRoomChanged = (curentRoom) => {
  socket.emit("CURENT_ROOM_CHANGED", curentRoom);
};

export const emitCurentIsMatched = (isMatched, lastTwoFlippedCards) => {
  socket.emit("IS_MATCHED_CHANGED", isMatched, lastTwoFlippedCards );
};

export const emitAllFlippedCards = (allFlippedCards) => {
  socket.emit("ALL_FLIPPRD_CARDS_CHANGED", allFlippedCards );
};

export const emitClearFlippedCards = (clearFlippedCards) => {
  socket.emit("CLEAR_FLIPPED_CARDS_CHANGED", clearFlippedCards );
};


export const updateCr = (setCr) => {
  socket.on("UPDATED_CURRENT_ROOM", (serverUpdatedCurentRoom) => {
    console.log("clientSocketServices -- updateCr -- serverUpdatedCurentRoom: ",
                  serverUpdatedCurentRoom)
    setCr(serverUpdatedCurentRoom);
  });
};

export const updatePlayerLeft = (setPlayerLeft) => {
  socket.on("PLAYER_LEFT_ROOM", (playerName) => {
    console.log("clientSocketServices -- updatePlayerLeft -- ON-PLAYER_LEFT_ROOM -- playerName: ", playerName)
    setPlayerLeft(playerName);
  });
};

export const updateIsMatched = (setIsMatched, setLastTwoFlippedCards) => {
  socket.on("UPDATED_IS_MATCHED", (isMatched, lastTwoFlippedCards) => {
    console.log("IN updateIsMatched -- ON-UPDATED_IS_MATCHED -- lastTwoFlippedCards: ", lastTwoFlippedCards)
    setIsMatched(isMatched);
  });
};

export const updateAllFlippedCards = (setAllFlippedCards) => {
  socket.on("UPDATED_ALL_FLIPPED_CARDS", (allFlippedCards) => {
    console.log("IN updateAllFlippedCards -- ON-UPDATED_ALL_FLIPPED_CARDS -- allFlippedCards: ", allFlippedCards)
    setAllFlippedCards(allFlippedCards);
  });
};

export const updateClearFlippedCards = (setClearFlippedCards) => {
  socket.on("UPDATED_CLEAR_FLIPPED_CARDS", (clearFlippedCards) => {
    console.log("IN updateIsMatched -- ON-UPDATED_CLEAR_FLIPPED_CARDS -- clearFlippedCards: ", clearFlippedCards)
    setClearFlippedCards(clearFlippedCards);
  });
};

export const removeUpdatedRoomDataListener = () => {
  console.log("removeUpdatedRoomDataListener -- REMOVING SOCKER from UPDATED_CURRENT_ROOM")
  socket.off("UPDATED_CURRENT_ROOM");
};
