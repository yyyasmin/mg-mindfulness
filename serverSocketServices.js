// HELPERS
let activeRooms = []; // KEEP TRACK OF PLAYERS

////////console.log("")
////////console.log("****************************************************************")
console.log("IN serverSocketServices.js -- activeRooms: ", activeRooms)
////////console.log("****************************************************************")
////////console.log("")


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
const emitMsgToRoomPlayers = (io, updatedRoom, msgType) => {
  updatedRoom.currentPlayers.forEach((player) => {
    io.to(player.socketId).emit(msgType, updatedRoom);
  });
};


const pppActiveRooms = () => {
  //console.log("");
  //console.log("Active Rooms:");
  activeRooms.forEach(room => {
    //console.log(`Room ID: ${room.id}, Current Players: ${room.currentPlayers}`);
  });
}


const getRoomFromActiveRoomsById = (roomId) => {
  const existingRoomIndex = activeRooms.findIndex((room) => room.id === roomId);
  if (existingRoomIndex !== -1) {
    ////////console.log("ROOME NUM: ", roomId, " Is FOUND IN ActiveRooms IN IDX:", existingRoomIndex)
    ////////console.log("")
	  return activeRooms[existingRoomIndex]
  } else {
    ////////console.log("REQUEST ROOM NUM: ", roomId, " TO UPDATE IS MISSNG IN activateRooms")
	return -1
  }
}

const getRoomIdxFromActiveRoomsById = (roomId) => {
  return activeRooms.findIndex((room) => room.id === roomId);
}

const updateActiveRoomsWithUpdatedRoom = (roomWithNewData) => {
  //console.log("")
  //console.log("IN updateActiveRoomsWithUpdatedRoom -- roomWithNewData.currentPlayers: ", roomWithNewData.currentPlayers)
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
  activeRooms[updatingIdx] = {...roomWithNewData};
  //console.log("ROOME NUM: ", roomWithNewData.id, " HAS UPDATED IN activeRooms TO:", roomWithNewData.currentPlayers)
  //console.log("")
  return activeRooms[updatingIdx]

}


const setAvailableRoomInActiveRooms = (requesedRoom) => {

  //console.log("")
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
  const existingPlayer = roomToAddPlayer.currentPlayers && roomToAddPlayer.currentPlayers.find((player) => player.name === playerName);
  
  if (existingPlayer) {
    updatedPlayers = movePlayerToEnd(roomToAddPlayer.currentPlayers, playerName);
    //console.log("PLAYER:", playerName, "IS ALREADY IN activeRooms IN ROOM NUM:", roomToAddPlayer.id, " NOW ROOMS PLAYERS IS:", roomToAddPlayer.currentPlayers)
    //console.log("")
    roomToAddPlayerNewCopy = { ...roomToAddPlayer, currentPlayers: updatedPlayers };
    return updateActiveRoomsWithUpdatedRoom(roomToAddPlayerNewCopy);
  
  } else {
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

    //console.log("NEW PLAYERS WIH ADDITION PLAYER:", playerName, "IS: ", currentPlayersNewCopy)
    //console.log()

    roomToAddPlayerNewCopy = { ...availableRoom, currentPlayers:currentPlayersNewCopy };


    if (roomToAddPlayerNewCopy.currentPlayers.length === roomToAddPlayerNewCopy.maxMembers) {
      roomToAddPlayerNewCopy.currentPlayers.forEach((player) => {
        player.isActive = false;
      });
      roomToAddPlayerNewCopy.currentPlayers[0].isActive = true;
      roomToAddPlayerNewCopy.startGame = true;
    }
    //console.log("IN addPlayerToRoom BEFORE updateActiveRoomsWithUpdatedRoom -- roomToAddPlayerNewCopy-players: ", roomToAddPlayerNewCopy.currentPlayers)
    //console.log("")
    return updateActiveRoomsWithUpdatedRoom(roomToAddPlayerNewCopy);
  }
};




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
      ////////console.log(`${playerName} has been inactive and will be removed.`);
      delete playerLastActive[playerName];
      io.emit("PLAYER_LEFT_ROOM", playerName);
    }
  }
}

// Start a timer to check for inactive players periodically
setInterval(() => {
  checkInactivePlayers();
}, HEARTBEAT_INTERVAL);

// Socket.io event handling
const serverSocketServices = (io) => {
	
  io.on("connection", (socket) => {
	  
    // Listen for heartbeat signal from client
    socket.on("heartbeat", (playerName) => {
      handleHeartbeat(playerName);
    });

    socket.on("CREATE_ROOM_AND_ADD_PLAYER", ({ playerName, chosenRoom }) => {
      if ( isEmpty(playerName) )  {
        //console.log("REQUESTE PLAYER IS:", playerName)
        io.emit("UPDATED_CURRENT_ROOM", chosenRoom);
        return -1
      }
      
      let updatedRoom = { ...setAvailableRoomInActiveRooms(chosenRoom) };
      //console.log("RETURNED FROM setAvailableRoomInActiveRooms: ", updatedRoom.id)

      if (updatedRoom === -1)  {
        //console.log("CAN NOT SET AVAILABLE ROOM FOR REQUESTED ROOOM NUM:", chosenRoom.id, " AND PLAYER:", playerName)
        //console.log("")

      }  else {
        updatedRoom = { ...addPlayerToRoom(updatedRoom, playerName, socket.id) } ;
        //console.log("RETURNED FROM addPlayerToRoom: ", updatedRoom.id)

      }

      //console.log("EMMITING TI CLIENT updatedRoom: ", updatedRoom.id)
      //console.log("")
      //console.log("")
      emitMsgToRoomPlayers(io, updatedRoom, "UPDATED_CURRENT_ROOM");
    })

	socket.on("REMOVE_PLAYER_FROM_ROOM", ({ playerName, requestedRoom }) => {
    ////console.log("IN REMOVE_PLAYER_FROM_ROOM -- playerName, requestedRoom:", playerName, requestedRoom.id)
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
		emitMsgToRoomPlayers(io, updatedRoom, "PLAYER_LEFT_ROOM")
    emitMsgToRoomPlayers(io, updatedRoom, "UPDATED_CURRENT_ROOM")
	}) // END REMOVE_PLAYER_FROM_ROOM


	socket.on("REMOVE_ROOM_FROM_ACTIVE_ROOMS", (roomId) => {
		removeRoomFromActiveRooms(roomId);
	});

	socket.on("CURENT_ROOM_CHANGED", (updatedRoom) => {
    ////console.log("")
    ////console.log("BEFORE updateActiveRoomsWithUpdatedRoom -- updatedRoom: ", updatedRoom)
    ////console.log("")
		updateActiveRoomsWithUpdatedRoom(updatedRoom);
    ////console.log("AFTER updateActiveRoomsWithUpdatedRoom -- updatedRoom: ", updatedRoom)
    ////console.log("")
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
