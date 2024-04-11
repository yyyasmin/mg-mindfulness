// HELPERS
let activeRooms = []; // KEEP TRACK OF PLAYERS

// Function to update activeRooms with an updated room
const updateActiveRoomsWithUpdatedRoom = (updatedRoom) => {
  const existingRoomIndex = activeRooms.findIndex((room) => room.id === updatedRoom.id);
  if (existingRoomIndex !== -1) {
    activeRooms[existingRoomIndex] = updatedRoom;
  } else {
    activeRooms.push(updatedRoom);
  }
}

// Function to create a new room
const createNewRoom = (chosenRoom, roomId) => {
  let newRoom = {
    ...chosenRoom,
    currentPlayers: [],
    id: roomId,
  };
  return newRoom;
}

// Function to get a room from activeRooms
const getRoomFromActiveRooms = (room) => {
  let newRoomId = room.id;
  while (activeRooms.some((r) => r.id === newRoomId && r.currentPlayers.length >= r.maxMembers)) {
    newRoomId += "0";
  }

  const existingRoomIndex = activeRooms.findIndex((r) => r.id === newRoomId);

  if (existingRoomIndex !== -1) {
    return activeRooms[existingRoomIndex];
  } else {
    let newRoom = createNewRoom(room, newRoomId);
    return newRoom;
  }
};

// Function to set room to add a player
const setRoomToAddPlayer = (chosenRoom) => {
  let updatedRoom;
  updatedRoom = getRoomFromActiveRooms(chosenRoom);
  updatedRoom.cardsData.map((card, index) => {
    // Reset all game cards to be on their back side when a new player joins to start the game from the beginning
    card.faceType = "back";
  });
  return updatedRoom;
}

// Function to move player to the end
const movePlayerToEnd = (currentPlayers, playerName) => {
  const playerIndex = currentPlayers.findIndex((player) => player.name === playerName);
  if (playerIndex !== -1) {
    const playerToMove = currentPlayers.splice(playerIndex, 1)[0];
    currentPlayers.push(playerToMove);
    currentPlayers.forEach((player) => {
      player.isActive = false;
    });
    currentPlayers[0].isActive = true; // The first player to join goes first
  }
  return currentPlayers;
}

// Function to add player to room
const addPlayerToRoom = (room, playerName, socketId) => {
  let updatedRoom;
  let startGame = room.startGame;
  let updatedPlayers;
  const existingPlayer = room.currentPlayers && room.currentPlayers.find((player) => player.name === playerName);
  if (existingPlayer) {
    updatedPlayers = movePlayerToEnd(room.currentPlayers, playerName);
    updatedRoom = { ...room, currentPlayers: updatedPlayers };
    return updatedRoom;
  } else {
    newPlayer = {
      socketId: socketId,
      name: playerName,
      email: "",
      isWinner: false,
      isActive: false,
      flippCount: 0,
    };
    room.currentPlayers.push(newPlayer);
    if (room.currentPlayers.length === room.maxMembers) {
      startGame = true;
    }
    room.currentPlayers.forEach((player) => {
      player.isActive = false;
    });
    room.currentPlayers[0].isActive = true;
    updatedRoom = {
      ...room,
      startGame: startGame,
    };
    return updatedRoom;
  }
};

// Function to remove a room from activeRooms
const removeRoomFromActiveRooms = (roomId) => {
  const roomIndex = activeRooms.findIndex((r) => r.id === roomId);
  if (roomIndex !== -1) {
    activeRooms.splice(roomIndex, 1);
  }
};

// SOCKET SERVICES
const HEARTBEAT_INTERVAL = 60000; // 1 minute
const INACTIVE_TIMEOUT = 3600000; // 1 hour
const playerLastActive = {};

// Function to handle heartbeat signal from client
function handleHeartbeat(playerName) {
  playerLastActive[playerName] = Date.now();
}

// Function to check for inactive players and remove them
function checkInactivePlayers(io) {
  const currentTime = Date.now();
  for (const playerName in playerLastActive) {
    if (currentTime - playerLastActive[playerName] > INACTIVE_TIMEOUT) {
      console.log(`${playerName} has been inactive and will be removed.`);
      delete playerLastActive[playerName];
      io.emit("PLAYER_LEFT_ROOM", playerName);
    }
  }
}

// Start a timer to check for inactive players periodically
setInterval(() => {
  checkInactivePlayers(io);
}, HEARTBEAT_INTERVAL);

// Socket.io event handling
const serverSocketServices = (io) => {
  io.on("connection", (socket) => {
    // Listen for heartbeat signal from client
    socket.on("heartbeat", (playerName) => {
      handleHeartbeat(playerName);
    });

    // Other socket event handlers...
    socket.on("CREATE_ROOM_AND_ADD_PLAYER", ({ playerName, chosenRoom }) => {
      let updatedRoom = { ...chosenRoom };
      if (playerName != undefined) {
        updatedRoom = setRoomToAddPlayer(chosenRoom, playerName);
        updatedRoom = addPlayerToRoom(updatedRoom, playerName, socket.id);
        updateActiveRoomsWithUpdatedRoom(updatedRoom);
      }
      io.emit("UPDATED_CURRENT_ROOM", updatedRoom);
    });

    socket.on("REMOVE_PLAYER_FROM_ROOM", ({ playerName, chosenRoom }) => {
      let existingRoom, updatedRoom;
      let existingPlayer = {};
      existingRoom = getRoomFromActiveRooms(chosenRoom);
      if (!existingRoom) {
        return { playerName, chosenRoom };
      } else {
        updatedRoom = existingRoom;
      }
      existingPlayer = updatedRoom.currentPlayers && updatedRoom.currentPlayers.find((player) => player.name === playerName);
      if (existingPlayer) {
        let updatedPlayers = [...updatedRoom.currentPlayers.filter((player) => player.name !== playerName)];
        if (updatedPlayers.length === 1) {
          updatedPlayers[0].isActive = true;
        }
        updatedRoom = {
          ...updatedRoom,
          currentPlayers: updatedPlayers,
        };
        if (updatedPlayers.length == 0) {
          updatedRoom = {
            ...updatedRoom,
            currentPlayers: updatedPlayers,
            startGame: false,
            endGame: false,
          };
        }
      }
      updateActiveRoomsWithUpdatedRoom(updatedRoom);
      const currentSocketID = socket.id;
      updatedRoom.currentPlayers.forEach((player) => {
        const playerSocketID = player.socketId;
        if (playerSocketID !== currentSocketID) {
          io.emit("PLAYER_LEFT_ROOM", playerName);
          io.emit("UPDATED_CURRENT_ROOM", updatedRoom);
        }
      });
    });

    socket.on("REMOVE_ROOM_FROM_ACTIVE_ROOMS", (roomId) => {
      removeRoomFromActiveRooms(roomId);
    });

    socket.on("CURENT_ROOM_CHANGED", (updatedRoom) => {
      updateActiveRoomsWithUpdatedRoom(updatedRoom);
      io.emit("UPDATED_CURRENT_ROOM", updatedRoom);
    });

    socket.on("MATCHED_CARDS_CHANGED", (updatedRoom, matchedCards) => {
      io.emit("UPDATED_MATCHED_CARDS", matchedCards);
    });

    socket.on("IS_MATCHED_CHANGED", (isMatched, last2FlippedCards, have_has_word_idx) => {
      io.emit("UPDATED_IS_MATCHED", isMatched, last2FlippedCards);
    });

    socket.on("CARD_SIZE_CHANGED", (updatedRoom, cardSize) => {
      io.emit("UPDATED_CARD_SIZE", cardSize);
    });

    socket.on("START_GAME", () => {
      io.emit("UPDATED_START_GAME");
    });

    socket.on("END_GAME", () => {
      io.emit("UPDATED_END_GAME");
    });
  });
};

module.exports = serverSocketServices;
