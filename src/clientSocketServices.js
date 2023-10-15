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

export const emitCurentMatchedCards = (matchedCards) => {
  socket.emit("MATCHED_CARDS_CHANGED", matchedCards);
};

export const emitCurentFlippCount = (matchedCards) => {
  socket.emit("FLIPP_COUNT_CHANGED", matchedCards);
};

export const updateCr = (setCr) => {
  socket.on("UPDATED_CURRENT_ROOM", (serverUpdatedCurentRoom) => {
    setCr(serverUpdatedCurentRoom);
  });
};

export const updatePlayerLeft = (setPlayerLeft) => {
  socket.on("PLAYER_LEFT_ROOM", (playerName) => {
    console.log("clientSocketServices -- updatePlayerLeft -- ON-PLAYER_LEFT_ROOM -- playerName: ", playerName)
    setPlayerLeft(playerName);
  });
};

export const updateMatchedCards = (setMatchedCards) => {
  socket.on("UPDATED_MATCHED_CARDS", (matchedCards) => {
    setMatchedCards(matchedCards);
  });
};

export const updateFlippCount = (setFlippCount) => {
  socket.on("UPDATED_FLIPP_COUNT", (flippCount) => {
    setFlippCount(flippCount);
  });
};

export const removeUpdatedRoomDataListener = () => {
  console.log("removeUpdatedRoomDataListener -- REMOVING SOCKER from UPDATED_CURRENT_ROOM")
  socket.off("UPDATED_CURRENT_ROOM");
};

export const removeUpdatedMatchedCards = () => {
  socket.off("UPDATED_MATCHED_CARDS");
};


export const removeUpdatedFlippCount = () => {
  socket.off("UPDATED_FLIPP_COUNT");
};