let activeRooms = [];

console.log("IN serverSocketServices.js");

const serverSocketServices = (io) => {

  io.on("connection", (socket) => {
    
    socket.on("CREATE_ROOM_AND_ADD_PLAYER", ({ playerName, chosenRoom }) => {

      let existingRoom, newRoom, updatedRoom;
      let existingPlayer = {}, newPlayer = {};

      existingRoom = activeRooms.find((oneOfTheRooms) => oneOfTheRooms.id === chosenRoom.id);

      if (!existingRoom) {
        newRoom = {
          ...chosenRoom,
          currentPlayers: [],
        };

        updatedRoom = newRoom;
      } else {
        console.log("ROOM ", existingRoom.id, "already exists");
        updatedRoom = existingRoom;
      }

      existingPlayer = updatedRoom.currentPlayers && updatedRoom.currentPlayers.find((player) => player.name === playerName);

      if (existingPlayer) {
        console.log("Player", playerName, "already exists in room", updatedRoom.id);
      } else {
        console.log("Adding player", playerName, "to chosenRoom:", updatedRoom.id);
        newPlayer = {
          socketId: socket.id,
          name: playerName,
          email: "",
          isWinner: false,
          isActive: true,
        };
        updatedRoom.currentPlayers.push(newPlayer);
      }

      const existingRoomIndex = activeRooms.findIndex((room) => room.id === updatedRoom.id);

      if (existingRoomIndex !== -1) {
        activeRooms[existingRoomIndex] = updatedRoom;
      } else {
        activeRooms.push(updatedRoom);
      }

      socket.join(updatedRoom.id);

      console.log("on-CREATE_ROOM_AND_ADD_PLAYER -- updatedRoom.cardsData[0]: ", updatedRoom.cardsData[0])

      io.emit("UPDATED_ROOMS_AND_ROOM_DATA", activeRooms, updatedRoom);
    });

    socket.on("CURENT_ROOM_CHANGED", (updatedRoom) => {

      const existingRoomIndex = activeRooms.findIndex((room) => room.id === updatedRoom.id);

      if (existingRoomIndex !== -1) {
        activeRooms[existingRoomIndex] = updatedRoom;
      }

      io.emit("UPDATED_ROOMS_AND_ROOM_DATA", activeRooms, updatedRoom);
    });

    socket.on("MATCHED_CARDS_CHANGED", (matchedCards) => {
      io.emit("UPDATED_MATCHED_CARDS", matchedCards);
    });
  });
};

module.exports = serverSocketServices;
