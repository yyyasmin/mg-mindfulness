// HELPERS
generateUniqueRoomId = (room) => {
  console.log("SERVER -- generateUniqueRoomId -- room: ", room)
  if ( room.currentPlayers.length === room.maxMembers )  {  // ROOM IS FULL - OPEN A NBEW ONE
    let newId = room.id + room.id
    console.log("OPEN NEW ROOM FOR WITH ID :", newId)
    return newId
  }  else {
    return room.id
  }
}

let activeRooms = [];

console.log("IN serverSocketServices.js");

const serverSocketServices = (io) => {

  io.on("connection", (socket) => {
    
    socket.on("CREATE_ROOM_AND_ADD_PLAYER", ({ playerName, chosenRoom }) => {
      let existingRoom, newRoom, updatedRoom;
      let existingPlayer = {}, newPlayer = {};
      existingRoom = activeRooms.find((oneOfTheRooms) => oneOfTheRooms.id === chosenRoom.id);
      console.log("0000 -- on-CREATE_ROOM_AND_ADD_PLAYER -- chosenRoom: ", chosenRoom)
      console.log("0000 -- on-CREATE_ROOM_AND_ADD_PLAYER -- existingRoom: ", existingRoom)
      if (!existingRoom) {  // CREAE NEW ROOM
        newRoom = {
          ...chosenRoom,
          currentPlayers: [],
          startGame: false,
          endGame: false
        };
        updatedRoom = newRoom;
      } else {
        console.log("ROOM ", existingRoom.id, "already exists");
        updatedRoom = { ...existingRoom,
                        id: generateUniqueRoomId(existingRoom)
        };
      }
      existingPlayer = updatedRoom.currentPlayers && updatedRoom.currentPlayers.find((player) => player.name === playerName);
      if (existingPlayer) {
        console.log("Player", playerName, "already exists in room", updatedRoom.id);
      } else {
        console.log("Adding player", playerName, "to updatedRoom:", updatedRoom.id);
        newPlayer = {
          socketId: socket.id,
          name: playerName,
          email: "",
          isWinner: false,
          isActive: true,
        };
        updatedRoom.currentPlayers.push(newPlayer);
        if ( updatedRoom.currentPlayers.length === updatedRoom.maxMembers )  {  // ALL PLAYERS HERE - START GAME
          updatedRoom.startGame = true
        }
      }
      const existingRoomIndex = activeRooms.findIndex((room) => room.id === updatedRoom.id);
      if (existingRoomIndex !== -1) {
        activeRooms[existingRoomIndex] = updatedRoom;
      } else {
        activeRooms.push(updatedRoom);
      }
      socket.join(updatedRoom.id);
      console.log("1111 -- on-CREATE_ROOM_AND_ADD_PLAYER -- updatedRoom: ", updatedRoom)
      io.emit("UPDATED_ROOMS_AND_ROOM_DATA", activeRooms, updatedRoom);
    });

    
	socket.on("REMOVE_PLAYER_FROM_ROOM", ({ playerName, chosenRoom }) => {
    let existingRoom, updatedRoom;
    let existingPlayer = {}  
    existingRoom = activeRooms.find((oneOfTheRooms) => oneOfTheRooms.id === chosenRoom.id);  
    console.log("SERVER -- on-REMOVE_PLAYER_FROM_ROOM -- chosenRoom: ", chosenRoom)
    console.log("SERVER -- on-REMOVE_PLAYER_FROM_ROOM -- existingRoom: ", existingRoom)  
    if (!existingRoom) {
      console.log("Room ", chosenRoom, "DOES NOT EXIST, CAN NOT REMOVE PLAYER", playerName)
      return { playerName, chosenRoom }
    }  else {
      updatedRoom = existingRoom;
    }    
    existingPlayer = updatedRoom.currentPlayers && updatedRoom.currentPlayers.find((player) => player.name === playerName);  
    if (existingPlayer) {
      const updatedPlayers = [...updatedRoom.currentPlayers];
      updatedPlayers.splice(playerIndex, 1);  // REMOVE playerName cell
      updatedRoom = {
        ... updatedRoom,
        currentPlayers: updatedPlayers,
      }
      console.log("REMOVING PLAYER ", playerName , "FROM ROOM ", chosenRoom);
      if ( updatedPlayers.length == 0 )  {  // NO PLAYERS IN THE ROOM
        updatedRoom = {
          ... updatedRoom,
          startGame: false,
          endGame: false,
        }
      }
    }  
    //UPDATE UPDATED-ROOM IN ACTIVE-ROOMS ARRAY
    const existingRoomIndex = activeRooms.findIndex((room) => room.id === updatedRoom.id);
    if (existingRoomIndex !== -1) {
      activeRooms[existingRoomIndex] = updatedRoom;
    } 	  
    else {
      console.log("ROOM ", chosenRoom, "DOES NOT EXIST IN ACTIVE_ROOMS ARRAY ", activeRooms)
    }  
    socket.join(updatedRoom.id);
    console.log("SERVER -- on-REMOVE_PLAYER_FROM_ROOM -- emmiting updatedRoom: ", updatedRoom)
    console.log("SERVER -- on-REMOVE_PLAYER_FROM_ROOM -- emmiting activeRooms: ", activeRooms)  
    io.emit("UPDATED_ROOMS_AND_ROOM_DATA", activeRooms, updatedRoom);
    });


    socket.on("CURENT_ROOM_CHANGED", (updatedRoom) => {
      const existingRoomIndex = activeRooms.findIndex((room) => room.id === updatedRoom.id);
      if (existingRoomIndex !== -1) {
        activeRooms[existingRoomIndex] = updatedRoom;
      }
      console.log("2222 -- on-CREATE_ROOM_AND_ADD_PLAYER -- updatedRoom.cardsData[0]: ", updatedRoom.cardsData)
      io.emit("UPDATED_ROOMS_AND_ROOM_DATA", activeRooms, updatedRoom);
    });


    socket.on("MATCHED_CARDS_CHANGED", (matchedCards) => {
      io.emit("UPDATED_MATCHED_CARDS", matchedCards);
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
