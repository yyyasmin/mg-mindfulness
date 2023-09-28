// init.js
import importArr from "./importCardFullPath"; // Import all exports for images loading 

// This function fetches data from a JSON file
const fetchDataFromJSON = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from JSON file:", error);
    return null;
  }
};

// Initialize rooms with data from rooms.json
const initRoomsFromJson = async () => {
  console.log("7777")

  const roomsData = await fetchDataFromJSON("https://react-multi-match-game-production.up.railway.app/database/rooms.json");
  console.log("8888")

  if (roomsData) {
    console.log("9999")

    return roomsData.map((room) => ({
      ...room,
      cardsData: [], // Initialize cardsData for each room (to be filled later)
    }));
  }
  return [];
};

// Initialize cardsData for each room based on data from cards.json
const initCardsInRoomsFromJson = async (rooms) => {
  console.log("10-10-10-10")

  const cardsData = await fetchDataFromJSON("https://react-multi-match-game-production.up.railway.app/database/Cards.json");
  if (cardsData) {
    rooms.forEach((room) => {
      if (cardsData[room.id]) {
        room.cardsData = cardsData[room.id].gameCards.map((card, index) => ({
          ...card,
          imageImportName: importArr[index], // Use the generated import names
        })) || [];
      }
    });
  }
  return rooms;
};

// Export a function that initializes rooms with cardsData
export const initRoomsFunc = async () => {
  console.log("11-11-11-11")

  let rooms = await initRoomsFromJson();
  rooms = await initCardsInRoomsFromJson(rooms);
  return rooms;
};
