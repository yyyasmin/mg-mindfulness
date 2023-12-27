// HELPERS
let activeRooms = [];  // KEEP TRACK OF PLAYERS
// const isEmpty = obj => !Object.keys(obj).length;

const updateActiveRoomsWithUpdatedRoom = (updatedRoom) =>  {
  const existingRoomIndex = activeRooms.findIndex((room) => room.id === updatedRoom.id);
  if (existingRoomIndex !== -1) {
    activeRooms[existingRoomIndex] = updatedRoom;
  }
  else  {
    activeRooms.push(updatedRoom)
  }
}


createNewRoom = (chosenRoom, roomId) => { 
  let newRoom = {
    ...chosenRoom,
    currentPlayers: [],
    id: roomId,
  }
  return newRoom
}


const getRoomFromActiveRooms = (room) =>  {
	newRoomId = room.id
	while (activeRooms.some((r) => r.id === newRoomId && r.currentPlayers.length >= r.maxMembers)) {
	  newRoomId += "0";
	}
	const existingRoomIndex = activeRooms.findIndex((r) => r.id === newRoomId);
		if (existingRoomIndex !== -1) {
		return activeRooms[existingRoomIndex]
	}
	else  {
    let newRoom = createNewRoom(room, newRoomId)
		activeRooms.push(newRoom)
		return newRoom
	}
}


setRoomToAddPlayer = (chosenRoom) => {
  let updatedRoom; 
  updatedRoom = getRoomFromActiveRooms(chosenRoom)
  console.log("0000 -- updatedRoom.currentPlayers: ", updatedRoom.id, updatedRoom.currentPlayers)
  updatedRoom.cardsData.map( (card, index) =>  {
    // Reset all game cards to be on thier back side - when a new players joins - to start the game from start
    card.isFlipped = true
  } )
  return updatedRoom
}


function movePlayerToEnd(currentPlayers, playerName) {   // FOR A RECONECTED USER
  // Find the index of the player to move
  const playerIndex = currentPlayers.findIndex((player) => player.name === playerName);
  // If the player is found in the array
  if (playerIndex !== -1) {
    // Remove the player from the array
    const playerToMove = currentPlayers.splice(playerIndex, 1)[0];
    // Push the player back to the end of the array
    currentPlayers.push(playerToMove);
    currentPlayers.forEach((player) => {
      player.isActive = false
    });
    currentPlayers[0].isActive = true  // FIRST TO JOIN GOES FIRST - ITS HIS TURN
  }
  return currentPlayers;
}


addPlayerToRoom = (room, playerName, socketId) => {
  // PREPARE THE ROOM TO ADD PLAYER TOO
  let updatedRoom
  let startGame = room.startGame
  let updatedPlayers
  const existingPlayer = room.currentPlayers && room.currentPlayers.find((player) => player.name === playerName);
  if (existingPlayer) {
    updatedPlayers = movePlayerToEnd(room.currentPlayers, playerName)  // MOVE EXISTING PLAYER TO END OF currentPlayers ARR
    updatedRoom = { ...room, currentPlayers: updatedPlayers  }
    return updatedRoom
  } else {
    newPlayer = {
      socketId: socketId,
      name: playerName,
      email: "",
      isWinner: false,
      isActive: false,
      flippCount: 0
    };
    room.currentPlayers.push(newPlayer);
    if ( room.currentPlayers.length === room.maxMembers )  {  // ALL PLAYERS HERE - START GAME
      startGame = true
    }
    room.currentPlayers.forEach((player) => {  // FIRST JOINED GO FIRST
      player.isActive = false 
    });
    room.currentPlayers[0].isActive = true
    updatedRoom = {
      ...room,
      startGame: startGame,
    }
    return updatedRoom
  }
}  // END addPlayerToRoom


// SOCKET SERVICES

console.log("IN serverSocketServices.js");

const serverSocketServices = (io) => {

  io.on("connection", (socket) => {

    socket.on("CREATE_ROOM_AND_ADD_PLAYER", ({ playerName, chosenRoom }) => {
      let updatedRoom = {...chosenRoom};
      console.log("")
      console.log("ON-CREATE_ROOM_AND_ADD_PLAYER -- playerName: ", playerName)
      if (playerName != undefined)  {
        updatedRoom = setRoomToAddPlayer(chosenRoom, playerName)
        updatedRoom = addPlayerToRoom(updatedRoom, playerName, socket.id)
        updateActiveRoomsWithUpdatedRoom(updatedRoom)
        console.log("START 4444 -- activeRooms:  ")
        activeRooms.forEach(room => {
          console.log("Room ID: ", room.id, "Current Players: ", room.currentPlayers, "CP-length: ", room.currentPlayers.length);
        });
        console.log("END 4444 -- activeRooms:  ")
        console.log("")

      }
      // io.emit("UPDATED_CURRENT_ROOM", updatedRoom);
      const playerSocketIDs = updatedRoom.currentPlayers.map(player => player.socketId);
      // Broadcast to specific sockets
      playerSocketIDs.forEach(socketID => {
        io.to(socketID).emit("UPDATED_CURRENT_ROOM", updatedRoom);
      });
    });  // END ON-CREATE_ROOM_AND_ADD_PLAYER

    
	socket.on("REMOVE_PLAYER_FROM_ROOM", ({ playerName, chosenRoom }) => {
    let existingRoom, updatedRoom;
    let existingPlayer = {}
    existingRoom = getRoomFromActiveRooms(chosenRoom) 
    if (!existingRoom) {
      return { playerName, chosenRoom }
    }  else {
      updatedRoom = existingRoom;
    }
    existingPlayer = updatedRoom.currentPlayers && updatedRoom.currentPlayers.find((player) => player.name === playerName);  
    if (existingPlayer) {
      // let updatedPlayers = [...updatedRoom.currentPlayers];
      let updatedPlayers = [...updatedRoom.currentPlayers.filter((player) => player.name !== playerName)]
      if ( updatedPlayers.length === 1 )  {
        updatedPlayers[0].isActive = true
      } 
      updatedRoom = {
        ... updatedRoom,
        currentPlayers: updatedPlayers,
      }
      if ( updatedPlayers.length == 0 )  {  // NO PLAYERS IN THE ROOM
        console.log("ALL PLAYERS LEFT THE ROOM")
        updatedRoom = {
          ... updatedRoom,
          currentPlayers: updatedPlayers,
          startGame: false,
          endGame: false,
        }
      }
    }
    updateActiveRoomsWithUpdatedRoom(updatedRoom)

    // Emit "PLAYER_LEFT_ROOM" to all players in the room except the current user
    const currentSocketID = socket.id;
    updatedRoom.currentPlayers.forEach(player => {
      const playerSocketID = player.socketId;
      if (playerSocketID !== currentSocketID) {
        io.to(playerSocketID).emit("PLAYER_LEFT_ROOM", playerName);
        io.to(playerSocketID).emit("UPDATED_CURRENT_ROOM", updatedRoom);

      }
    });
  });  // END ON-REMOVE_PLAYER_FROM_ROOM
    


    socket.on("CURENT_ROOM_CHANGED", (updatedRoom) => {
      updateActiveRoomsWithUpdatedRoom(updatedRoom) 
      // io.emit("UPDATED_CURRENT_ROOM", updatedRoom);
      const playerSocketIDs = updatedRoom.currentPlayers.map(player => player.socketId);
      // Broadcast to specific sockets
      playerSocketIDs.forEach(socketID => {
        io.to(socketID).emit("UPDATED_CURRENT_ROOM", updatedRoom);
      });
    });


    socket.on("MATCHED_CARDS_CHANGED", (updatedRoom, matchedCards) => {
      // io.emit("UPDATED_MATCHED_CARDS", matchedCards);
      const playerSocketIDs = updatedRoom.currentPlayers.map(player => player.socketId);
      // Broadcast to specific sockets
      playerSocketIDs.forEach(socketID => {
        io.to(socketID).emit("UPDATED_MATCHED_CARDS", matchedCards);
      });

    });


    socket.on("IS_MATCHED_CHANGED", (updatedRoom, isMatched, lastTwoFlippedCards) => {
      // io.emit("UPDATED_IS_MATCHED", isMatched);
      const playerSocketIDs = updatedRoom.currentPlayers.map(player => player.socketId);
      // Broadcast to specific sockets
      playerSocketIDs.forEach(socketID => {
        console.log("IN SERVER - ON-IS_MATCHED_CHANGED -- LLLLLLLLLLLLL  -- lastTwoFlippedCards: ", lastTwoFlippedCards)
        io.to(socketID).emit("UPDATED_IS_MATCHED", isMatched, lastTwoFlippedCards);
      });
    });
    

    socket.on("CARD_SIZE_CHANGED", (updatedRoom, cardSize) => {
      // io.emit("UPDATED_CARD_SIZE", cardSize);
      const playerSocketIDs = updatedRoom.currentPlayers.map(player => player.socketId);
      // Broadcast to specific sockets
      playerSocketIDs.forEach(socketID => {
        console.log("IN SERVER - ON-CARD_SIZE_CHANGED -- SSSSSSSSSSSSSS  -- cardSize: ", cardSize)
        io.to(socketID).emit("UPDATED_CARD_SIZE", cardSize);
      });
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
