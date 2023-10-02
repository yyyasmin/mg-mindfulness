import io from "socket.io-client";
import { CHOSEN_PROXY_URL } from "./helpers/ServerRoutes.js";

export const socket = io(CHOSEN_PROXY_URL);

export const emitAddMemberToRoom = ({ playerName, chosenRoom }) => {
  console.log("clientSocketServices.js -- emitAddMemberToRoom -- emit-CREATE_ROOM_AND_ADD_PLAYER -- chosenRoom ", chosenRoom);
  socket.emit('CREATE_ROOM_AND_ADD_PLAYER', { playerName, chosenRoom });
};

export const emitRemoveMemberFromRoom = ({ playerName, chosenRoom }) => {
  console.log("clientSocketServices.js -- emitRemoveMemberFromRoom -- emit-REMOVE_PLAYER_FROM_ROOM -- chosenRoom ", chosenRoom);
  console.log("clientSocketServices.js -- emitRemoveMemberFromRoom -- emit-REMOVE_PLAYER_FROM_ROOM -- playerName ", playerName);
  socket.emit('REMOVE_PLAYER_FROM_ROOM', { playerName, chosenRoom });
};

export const emitCurentRoomChanged = (curentRoom) => {
  socket.emit("CURENT_ROOM_CHANGED", curentRoom);
};

export const emitCurentMatchedCards = (matchedCards) => {
  socket.emit("MATCHED_CARDS_CHANGED", matchedCards);
};

export const updateCurentRoom = (setCurentRoom) => {
  socket.on("UPDATED_CURRENT_ROOM", (serverUpdatedCurentRoom) => {
    console.log("CLIENT -- on-UPDATED_CURRENT_ROOM -- serverUpdatedCurentRoom: ", serverUpdatedCurentRoom);
    setCurentRoom(serverUpdatedCurentRoom);
  });
};

export const updateMatchedCards = (setMatchedCards) => {
  socket.on("UPDATED_MATCHED_CARDS", (matchedCards) => {
    setMatchedCards(matchedCards);
  });
};

export const removeUpdatedRoomDataListener = () => {
  socket.off("UPDATED_CURRENT_ROOM");
};

export const removeUpdatedMatchedCards = () => {
  socket.off("UPDATED_MATCHED_CARDS");
};