// HELPERS
let activeRooms = []; // KEEP TRACK OF PLAYERS

////console.log("")
////console.log("****************************************************************")
////console.log("IN serverSocketServices.js -- activeRooms: ", activeRooms)
////console.log("****************************************************************")
////console.log("")


// CHECK IF OBJ OF ANY TYPE IS EMPTY 
function isEmpty(obj) {
  if (typeof obj === 'undefined' || obj === null) {
    return true;
  }

  if (typeof obj === 'string' && obj.trim() === '') {
    return true;
  }

  if (Array.isArray(obj) && obj.length === 0) {
    return true;
  }
  if (typeof obj === 'object' && Object.keys(obj).length === 0) {
    return true;
  }

  return false;
}

// Function to emit UPDATED_CURRENT_ROOM event to all players in a room
const emitMsgToRoomPlayers = (io, msgType, updatedRoom) => {
  updatedRoom.currentPlayers.forEach((player) => {
    io.to(player.socketId).emit(msgType, updatedRoom);
  });
};

const emitMsgToRoomPlayers2 = (io, msgType, updatedRoom, updatedObj2) => {
  updatedRoom.currentPlayers.forEach((player) => {
    io.to(player.socketId).emit(msgType, updatedRoom, updatedObj2);
  });
};

const emitMsgToRoomPlayers3 = (io, msgType, updatedRoom, updatedObj2, updatedObj3) => {

  updatedRoom.currentPlayers.forEach((player) => {
    console.log("SENDING TO PPPPPPPPPPPPPPPPPPPPPPPPPP---msgType: ", msgType, updatedObj2, updatedObj3, player)
    console.log("SENDING TO PPPPPPPPPPPPPPPPPPPPPPPPPP---PLAYER: ", player)
    console.log("SENDING TO PPPPPPPPPPPPPPPPPPPPPPPPPP---updatedObj2: ", updatedObj2)
    console.log("SENDING TO PPPPPPPPPPPPPPPPPPPPPPPPPP---updatedObj3: ", updatedObj3)

    io.to(player.socketId).emit(msgType, updatedObj2, updatedObj3);
  });
};

const pppActiveRooms = () => {
  //console.log("");
  //console.log("****************************************************")
  //console.log("****************************************************")
  //console.log("Active Rooms:");
  activeRooms.forEach(room => {
    //console.log("Room ID:", room.id, " Current Players:", room.currentPlayers);
  });
  //console.log("****************************************************")
  //console.log("****************************************************")
  //console.log("")
}


const getRoomFromActiveRoomsById = (roomId) => {
  const existingRoomIndex = activeRooms.findIndex((room) => room.id === roomId);
  if (existingRoomIndex !== -1) {
    ////console.log("ROOME NUM: ", roomId, " Is FOUND IN ActiveRooms IN IDX:", existingRoomIndex)
    ////console.log("")
	  return activeRooms[existingRoomIndex]
  } else {
    ////console.log("REQUEST ROOM NUM: ", roomId, " TO UPDATE IS MISSNG IN activateRooms")
	return -1
  }
}

const getRoomIdxFromActiveRoomsById = (roomId) => {
  return activeRooms.findIndex((room) => room.id === roomId);
}

const updateActiveRoomsWithUpdatedRoom = (roomWithNewData) => {
  //console.log("")
  //console.log("IN updateActiveRoomsWithUpdatedRoom  ")
  //console.log("BEFORE UPDATE:")
  pppActiveRooms()

  if (isEmpty(roomWithNewData)) {
    //console.log("RQUESTED ROOM TO UPDATE IS EEEEEEEEEEEEEEEEEEE -- EMPTY:", roomWithNewData)
    //console.log("")
    return -1
  }
  
  
  const roomId = roomWithNewData.id
  const updatingIdx = getRoomIdxFromActiveRoomsById(roomId)
  if (updatingIdx === -1)  {
    //console.log("REQUSETED ROOM:", roomId, " IS MISSINF IN activeRooms")
    //console.log("")
    return -1
  }
  
  let roomToUpdate = activeRooms[updatingIdx]
  if ( !isEmpty(roomToUpdate.currentPlayers) && isEmpty(roomWithNewData.currentPlayers) ) {
	  //console.log("CAN NOT EMPTY POPULATED ROOM", roomToUpdate.id, " WITH PLAYERS DATA:", roomWithNewData.currentPlayers)
	  return -1
  }
  
  activeRooms[updatingIdx] = {...roomWithNewData};
  //console.log("AFTER UPDATE:")
  pppActiveRooms()
  return activeRooms[updatingIdx]

}


const setAvailableRoomInActiveRooms = (requesedRoom) => {

  //console.log("")

  if ( isEmpty(requesedRoom) )  {
    //console.log("REQUESTING EMPTY ROOM:", requesedRoom, "TO SET FOR PLAYER ")
    return -1
  }

  //console.log("ÏN setAvailableRoomInActiveRooms -- requesedRoom-ID", requesedRoom.id)

    let shiftRoomId = requesedRoom.id;
    // GET AVAILABLE ROOM FOR REQUEST updatedRoom.id
    while (activeRooms.some((r) => r.id === shiftRoomId && r.currentPlayers.length >= r.maxMembers)) {
      shiftRoomId += "0";
    }
    const setRoomIndex = activeRooms.findIndex((r) => r.id === shiftRoomId);

    //console.log("setRoomIndex: ", setRoomIndex)

    if (setRoomIndex !== -1) {  // FOUND THE AVAILABLE ROOM IN activeRooms FOR THE NEW PLAYER
      //console.log("FOUND AVAILABLE ROOM NUM: ", shiftRoomId, " FOR NEW PLAYER IN INDEX:", setRoomIndex)
      return activeRooms[setRoomIndex]
    }

    else {  // CREATING NEW ROOM FOR NEW PLAYER AND REQUEST ROOM requesedRoom
      const newRoomId = shiftRoomId
      const updatedRoomNewCopy = {
        ...requesedRoom, 
        id: newRoomId,
        currentPlayers: [],
		  }
      updatedRoomNewCopy.cardsData.map((card, index) => {
      // Reset all game cards to be on their back side when a new player joins to start the game from the beginning
       card.faceType = "back";
      });
      activeRooms.push(updatedRoomNewCopy);
      //console.log("IN updateOrCreateRoom -- CREATED NEW ROOM room ", updatedRoomNewCopy.id, "in index :", activeRooms.length-1)
      //console.log("")
      pppActiveRooms()
      return activeRooms[activeRooms.length-1]
    }
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


const addPlayerToRoom = (roomToAddPlayer, playerName, socketId) => {
    let updatedPlayers;
    let roomToAddPlayerNewCopy;

    // const existingPlayer = roomToAddPlayer.currentPlayers && roomToAddPlayer.currentPlayers.find((player) => player.name === playerName);
    
    // if (existingPlayer) {
    //   updatedPlayers = movePlayerToEnd(roomToAddPlayer.currentPlayers, playerName);
    //   ////console.log("PLAYER:", playerName, "IS ALREADY IN activeRooms IN ROOM NUM:", roomToAddPlayer.id, " NOW ROOMS PLAYERS IS:", roomToAddPlayer.currentPlayers)
    //   ////console.log("")
    //   roomToAddPlayerNewCopy = { ...roomToAddPlayer, currentPlayers: updatedPlayers };
    //   return updateActiveRoomsWithUpdatedRoom(roomToAddPlayerNewCopy);
    
    // } 

    newPlayer = {
      socketId: socketId,
      name: playerName,
      email: "",
      isWinner: false,
      isActive: false,
      flippCount: 0,
    };

    let availableRoomIdx = getRoomIdxFromActiveRoomsById(roomToAddPlayer.id)
    let availableRoom = activeRooms[availableRoomIdx]

    let currentPlayersNewCopy = [...availableRoom.currentPlayers]
    currentPlayersNewCopy.push(newPlayer)

    ////console.log("NEW PLAYERS WIH ADDITION PLAYER:", playerName, "IS: ", currentPlayersNewCopy)
    ////console.log()

    roomToAddPlayerNewCopy = { ...availableRoom, currentPlayers:currentPlayersNewCopy };

    if (roomToAddPlayerNewCopy.currentPlayers.length === roomToAddPlayerNewCopy.maxMembers) {
      roomToAddPlayerNewCopy.currentPlayers.forEach((player) => {
        player.isActive = false;
      });
      roomToAddPlayerNewCopy.currentPlayers[0].isActive = true;
      roomToAddPlayerNewCopy.startGame = true;
    }
    return updateActiveRoomsWithUpdatedRoom(roomToAddPlayerNewCopy);
 }


const removeRoomFromActiveRooms = (roomId) => {
  const roomIndex = activeRooms.findIndex((r) => r.id === roomId);
  if (roomIndex !== -1) {
    activeRooms.splice(roomIndex, 1);
	  //console.log("REQUESTED ROOM:",roomId, " HAS REMOVED FRM activeRooms")
	  //console.log("")

  }
  else {
	  //console.log("REQUESTED ROOM:",roomId, " IS MISSIF GROM activeRooms")
	  //console.log("")
	  return -1
  }
};

// SOCKET SERVICES
const HEART_BEAT_INTERVAL = 60000; // 1 minute
const INACTIVE_TIMEOUT = 3600000; // 1 hour
const playerLastActive = {};

// Function to handle HEART_BEAT signal from client
function handleHeartBeat(playerName) {
  playerLastActive[playerName] = Date.now();
}

// Function to check for inactive players and remove them
function checkInactivePlayers(io) {
  const currentTime = Date.now();
  for (const playerName in playerLastActive) {
    if (currentTime - playerLastActive[playerName] > INACTIVE_TIMEOUT) {
      ////console.log(`${playerName} has been inactive and will be removed.`);
      delete playerLastActive[playerName];
      io.emit("PLAYER_LEFT_ROOM", playerName);
    }
  }
}

// Start a timer to check for inactive players periodically
setInterval(() => {
  checkInactivePlayers();
}, HEART_BEAT_INTERVAL);

// Socket.io event handling
const serverSocketServices = (io) => {
	
  io.on("connection", (socket) => {
	  
    // Listen for HEART_BEAT signal from client
    socket.on("HEART_BEAT", (playerName) => {
      handleHeartBeat(playerName);
    });

    socket.on("CREATE_ROOM_AND_ADD_PLAYER", ( {chosenRoom, playerName} ) => {

      //console.log("")
      //console.log("IN CREATE_ROOM_AND_ADD_PLAYER: chosenRoom:", chosenRoom, "PLAYER:", playerName)
      
      let updatedRoom = { ...setAvailableRoomInActiveRooms(chosenRoom) };

      if (updatedRoom === -1)  {
        //console.log("CAN NOT SET AVAILABLE ROOM FOR REQUESTED ROOOM NUM:", chosenRoom.id, " AND PLAYER:", playerName)
        //console.log("")

      }  else {
        updatedRoom = { ...addPlayerToRoom(updatedRoom, playerName, socket.id) } ;
      }

      emitMsgToRoomPlayers(io, "UPDATED_CURRENT_ROOM", updatedRoom);
    })


    socket.on("REMOVE_PLAYER_FROM_ROOM", ( {requestedRoom, playerName} ) => {

      if ( isEmpty(requestedRoom) )  {
        //console.log("IN REMOVE_PLAYER_FROM_ROOM -- REQUESTED ROOM IS EMPTY -- playerName, requestedRoom:", playerName, requestedRoom)
        return -1
      }

      //console.log("IN REMOVE_PLAYER_FROM_ROOM -- playerName, requestedRoom:", playerName, requestedRoom.id)
      let existingRoom, updatedRoom;
      let existingPlayer = {};
      existingRoom = getRoomFromActiveRoomsById(requestedRoom);
      
      if (existingRoom === -1) {
        return { playerName, requestedRoom };
      } else {
        updatedRoom = existingRoom;
      }
        
      requestedPlayer = !isEmpty(updatedRoom.currentPlayers) && 
                updatedRoom.currentPlayers.find((player) => player.name === playerName);

      if (existingPlayer) {
        let PlayersToSendMsg =
        [...updatedRoom.currentPlayers.filter((player) => player.name !== playerName)];
        if (PlayersToSendMsg.length === 1) {
          updatedPlayers[0].isActive = true;
        }
        updatedRoom = {
          ...updatedRoom,
          currentPlayers: PlayersToSendMsg,
        };
        if (PlayersToSendMsg.length == 0) {
          updatedRoom = {
            ...updatedRoom,
            currentPlayers: PlayersToSendMsg,
            startGame: false,
            endGame: false,
          };
        }
      }
      emitMsgToRoomPlayers(io, "PLAYER_LEFT_ROOM", updatedRoom)
      emitMsgToRoomPlayers(io, "UPDATED_CURRENT_ROOM", updatedRoom)
    }) // END REMOVE_PLAYER_FROM_ROOM


    socket.on("REMOVE_ROOM_FROM_ACTIVE_ROOMS", (roomId) => {
      removeRoomFromActiveRooms(roomId);
    });

    socket.on("CURENT_ROOM_CHANGED", (updatedRoom) => {
      updateActiveRoomsWithUpdatedRoom(updatedRoom);
      emitMsgToRoomPlayers(io, "UPDATED_CURRENT_ROOM", updatedRoom);
    });

    // socket.on("MATCHED_CARDS_CHANGED", (updatedRoom, matchedCards) => {
    //   emitMsgToRoomPlayers2(io, "UPDATED_MATCHED_CARDS", updatedRoom, matchedCards);
    // });

    socket.on("IS_MATCHED_CHANGED", (cr, isMatched, last2FlippedCards, have_has_word_idx) => {
      //console.log("IN ON-IS_MATCHED_CHANGED -- cr:", cr)
      //console.log("IN ON-IS_MATCHED_CHANGED -- last2FlippedCards:", last2FlippedCards)
      emitMsgToRoomPlayers3(io, "UPDATED_IS_MATCHED", cr, isMatched, last2FlippedCards);
    });
    

    // socket.on("CARD_SIZE_CHANGED", (cr, updatedRoom, cardSize) => {
    // emitMsgToRoomPlayers3(io, "UPDATED_CARD_SIZE", cr, updatedRoom, cardSize);
    // });

    socket.on("START_GAME", (cr) => {
      emitMsgToRoomPlayers(io, "UPDATED_START_GAME", cr);
    });

    socket.on("END_GAME", (cr) => {
      emitMsgToRoomPlayers(io, "UPDATED_END_GAME", cr);
    });
	
  });
	
};

module.exports = serverSocketServices;
