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

const getRoomFromActiveRooms = (room) =>  {
  const existingRoomIndex = activeRooms.findIndex((r) => r.id === room.id);
  if (existingRoomIndex !== -1) {
    return activeRooms[existingRoomIndex]
  }
  else  {
    activeRooms.push(room)
    return room
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

setRoomToAddPlayer = (chosenRoom) => {
  let updatedRoom; 

  updatedRoom = getRoomFromActiveRooms(chosenRoom)

  if ( updatedRoom.currentPlayers===undefined || updatedRoom.currentPlayers.length===0)  {
    updatedRoom = createNewRoom(updatedRoom, updatedRoom.id)
  }
  else {if ( updatedRoom.currentPlayers.length < updatedRoom.maxMembers)  {
    updatedRoom = {...updatedRoom}
  }}
  if (updatedRoom.currentPlayers.length >= updatedRoom.maxMembers)  {  // ROOM FULL - OPEN NEW ONE WITH NEW ID
    console.log("CREATING NEW ROOM WITH NEW ID: ", updatedRoom.id+updatedRoom.id)
    updatedRoom = createNewRoom(updatedRoom, updatedRoom.id+updatedRoom.id)
  }
  
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
    // console.log("Player ", playerName , " already present in room ", room,  "- MOVING HIM TO BE LAST IN PLAYERS ARRAY ")
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
}

// SOCKET SERVICES

console.log("IN serverSocketServices.js");
const serverSocketServices = (io) => {
  io.on("connection", (socket) => {
    
    socket.on("CREATE_ROOM_AND_ADD_PLAYER", ({ playerName, chosenRoom }) => {
      let updatedRoom = {...chosenRoom};
      console.log("ON-CREATE_ROOM_AND_ADD_PLAYER -- playerName: ", playerName)
    
      if (playerName != undefined)  {
        updatedRoom = setRoomToAddPlayer(chosenRoom, playerName)
        updatedRoom = addPlayerToRoom(updatedRoom, playerName, socket.id)
        updateActiveRoomsWithUpdatedRoom(updatedRoom)
      }
      console.log("CCCCCCCCCCCCCCCCCCCCCCREATE_ROOM_AND_ADD_PLAYER -- updatedRoom.playerName: ", updatedRoom.playerName)
      console.log("CCCCCCCCCCCCCCCCCCCCCCREATE_ROOM_AND_ADD_PLAYER -- updatedRoom.currentPlayers: ", updatedRoom.currentPlayers)
      console.log("CCCCCCCCCCCCCCCCCCCCCCREATE_ROOM_AND_ADD_PLAYER -- playerNames: ", playerName)

      io.emit("UPDATED_CURRENT_ROOM", updatedRoom);
    });

    
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
    // Notify other players about the departure
    socket.broadcast.emit("PLAYER_LEFT_ROOM", playerName);
    // io.emit("UPDATED_CURRENT_ROOM", updatedRoom);
    socket.broadcast.emit("UPDATED_CURRENT_ROOM", updatedRoom);

  });
    

    socket.on("CURENT_ROOM_CHANGED", (updatedRoom) => {
      updateActiveRoomsWithUpdatedRoom(updatedRoom) 
      io.emit("UPDATED_CURRENT_ROOM", updatedRoom);
    });

    socket.on("MATCHED_CARDS_CHANGED", (matchedCards) => {
      io.emit("UPDATED_MATCHED_CARDS", matchedCards);
    });

    socket.on("FLIPP_COUNT_CHANGED", (flippCount) => {
      io.emit("UPDATED_FLIPP_COUNT", flippCount);
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
