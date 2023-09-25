let activeRooms = [];

console.log("IN serverSocketServices.js");

const serverSocketServices = (io) => {

  io.on("connection", (socket) => {
    
    socket.on("CREATE_ROOM_AND_ADD_PLAYER", ({ playerName, chosenRoom }) => {
      console.log("IN serverSocketServices - ON-CREATE_ROOM_AND_ADD_PLAYER  -- chosenRoom: ", chosenRoom);
      let existingRoom, newRoom, updatedRoom;
      let existingPlayer = {}, newPlayer = {};

      existingRoom = activeRooms.find((oneOfTheRooms) => oneOfTheRooms.id === chosenRoom.id);

      if (!existingRoom) {  // HANDLE NEW ROOM
        newRoom = {
          ...chosenRoom,
          currentPlayers: [],
        };

        console.log("SERVER CREATING NEW ROOM -- newRoom.id: ", newRoom.id);
        updatedRoom = newRoom;
      } else {  // ROOM EXISTS
        console.log("ROOM ", existingRoom.id, "already exists");
        updatedRoom = existingRoom;
      }

      // HANDLE PLAYER
      // Check if the player with the same name already exists
      existingPlayer = updatedRoom.currentPlayers && updatedRoom.currentPlayers.find((player) => player.name === playerName);

      if (existingPlayer) {
        console.log("Player", playerName, "already exists in room", updatedRoom.id);
      } else {
        // HANDLE NEW PLAYER
        console.log("Adding player", playerName, "to chosenRoom:", updatedRoom.id);
        newPlayer = {  // CREATE SOCKET-ID FOR NEW PLAYER
          socketId: socket.id,
          name: playerName,
          email: "",
          isWinner: false,
          isActive: true,
        };
        updatedRoom.currentPlayers.push(newPlayer);
      }

      // Find the index of the existing room in activeRooms
      const existingRoomIndex = activeRooms.findIndex((room) => room.id === updatedRoom.id);

      if (existingRoomIndex !== -1) {  // If it exists, update that room in activeRooms
        activeRooms[existingRoomIndex] = updatedRoom;
      } else {
        // If it doesn't exist, add the updatedRoom to activeRooms
        activeRooms.push(updatedRoom);
      }
      console.log("Emitting from server activeRooms:", activeRooms);
      console.log("Emitting from server updatedRoom:", updatedRoom);

      // Join the socket to the room
      socket.join(updatedRoom.id);

      // Emit to all players in the room
      io.emit("UPDATED_ROOMS_AND_ROOM_DATA", activeRooms, updatedRoom);
    });

        
    socket.on("CURENT_ROOM_CHANGED", ( updatedRoom ) => {
		
      console.log("IN serverSocketServices - ON-UPDATE_ROOMS_AND_ROOM  -- updatedRoom: ", updatedRoom);

      // Find the index of the existing room in activeRooms
      const existingRoomIndex = activeRooms.findIndex((room) => room.id === updatedRoom.id);

      if (existingRoomIndex !== -1) {  // If it exists, update that room in activeRooms
        activeRooms[existingRoomIndex] = updatedRoom;
      } 
      console.log("Emitting from server activeRooms:", activeRooms);
      console.log("Emitting from server updatedRoom:", updatedRoom);

      // Emit to all players in the room
      io.emit("UPDATED_ROOMS_AND_ROOM_DATA", activeRooms, updatedRoom);
    });

    socket.on("MATCHED_CARDS_CHANGED", ( matchedCards ) => {
      // Emit to all players in the room
      io.emit("UPDATED_MATCHED_CARDS", matchedCards);
    });

  });

};

module.exports = serverSocketServices;
