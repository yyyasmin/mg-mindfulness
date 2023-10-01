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


// export const emitStartGame = () => {
//   socket.emit("START_GAME");
// };

// export const emitEndGame = () => {
//   socket.emit("END_GAME");
// };

// export const updateStartGame = (setStartGame) => {
//   socket.on("UPDATED_START_GAME", () => {
//     setStartGame(true);
//   });
// };

// export const updateEndGame = (setEndGame, setStartGame) => {
//   socket.on("UPDATED_END_GAME", () => {
//     setEndGame(true);
//     setStartGame(false);
//   });
// };

export const updateCurentRoomAndActiveRooms = (setUpdatedActiveRooms, setCurentRoom) => {
  socket.on("UPDATED_ROOMS_AND_ROOM_DATA", (serverUpdatedActiveRooms, serverUpdatedCurentRoom) => {
    console.log("CLIENT -- on-UPDATED_ROOMS_AND_ROOM_DATA -- serverUpdatedCurentRoom: ", serverUpdatedCurentRoom);
    setCurentRoom(serverUpdatedCurentRoom);
    setUpdatedActiveRooms(serverUpdatedActiveRooms);
  });
};

export const updateMatchedCards = (setMatchedCards) => {
  socket.on("UPDATED_MATCHED_CARDS", (matchedCards) => {
    setMatchedCards(matchedCards);
  });
};

export const removeUpdatedRoomDataListener = () => {
  socket.off("UPDATED_ROOMS_AND_ROOM_DATA");
};

export const removeUpdatedMatchedCards = () => {
  socket.off("UPDATED_MATCHED_CARDS");
};