import io from "socket.io-client";

// const PROXY_URL = 'http://localhost:5000'; // local server port
const RENDER_PROXY_URL = 'https://spotty-join-production.up.railway.app/'; // RENDER server port

export const socket = io(RENDER_PROXY_URL);

console.log("IN clientSocketServices -- socket: ", socket)

// Broadcast player actions to all playerS in the room

export const emitAddMemberToRoom = ({ playerName, chosenRoom }) => {
  socket.emit('CREATE_ROOM_AND_ADD_PLAYER', { playerName, chosenRoom });
};

// Function to broadcast the current room data
export const emitCurentRoomChanged = (curentRoom) => {
  // Emit the updated room data to the server
  socket.emit("CURENT_ROOM_CHANGED", curentRoom);
};

// Function to broadcast the current room data
export const emitCurentMatchedCards = (matchedCards) => {
  // Emit the updated room data to the server
  socket.emit("MATCHED_CARDS_CHANGED", matchedCards);
};

// Function to listen for updated room data from the server
export const updateCurentRoomAndActiveRooms = (setUpdatedActiveRooms, setCurentRoom) => {
  socket.on("UPDATED_ROOMS_AND_ROOM_DATA", (serverUpdatedActiveRooms, serverUpdatedCurentRoom) => {
    // Update the state with the received data
    setCurentRoom(serverUpdatedCurentRoom);
    setUpdatedActiveRooms(serverUpdatedActiveRooms);
  });
};

// Function to listen for updated room data from the server
export const updateMatchedCards = (setMatchedCards) => {
  socket.on("UPDATED_MATCHED_CARDS", (matchedCards) => {
    // Update the state with the received data
    setMatchedCards(matchedCards);
  });
};

// Clean up the event listener when needed
export const removeUpdatedRoomDataListener = () => {
  socket.off("UPDATED_ROOMS_AND_ROOM_DATA");
};

// Clean up the event listener when needed
export const removeUpdatedMatchedCards = () => {
  socket.off("UPDATED_MATCHED_CARDS");
};
