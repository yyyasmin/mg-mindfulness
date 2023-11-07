import { Emotions_1 } from "./GameCards/Emotions_1.js";
import { Emotions_2 } from "./GameCards/Emotions_2.js";
import { Intimacy_1 } from "./GameCards/Intimacy_1.js";
import { Calm_1 } from "./GameCards/Calm_1.js";
import { First_Letter_1 } from "./GameCards/First_Letter_1.js";
import { Deep_1 } from "./GameCards/Deep_1.js";
import { Deep_2 } from "./GameCards/Deep_2.js";
import { Deep_3 } from "./GameCards/Deep_3.js";

import { shuffle } from "./shuffle"; // Import all exports for images loading
import { CHOSEN_PROXY_URL } from "./ServerRoutes.js";

console.log("init - server - CHOSEN_PROXY_URL: ", CHOSEN_PROXY_URL);

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

// Initialize cards in rooms from a JSON file based on gameName
const initCardsInRoomsFromJson = async (rooms) => {
  for (const room of rooms) {
    const jsonURL = `${CHOSEN_PROXY_URL}/database/GameCards/${room.gameName}.json`;
    const cardsData = await fetchDataFromJSON(jsonURL);
    if (cardsData) {
      let gameCards = cardsData.gameCards || [];
      const importArr = {
        Emotions_1: Emotions_1,
        Emotions_2: Emotions_2,
        Intimacy_1: Intimacy_1,
        Calm_1: Calm_1,
        First_Letter_1: First_Letter_1,
        Deep_1: Deep_1,
        Deep_2: Deep_2,
        Deep_3: Deep_3,
        // Add more gameName mappings as needed
      };
      if (importArr[room.gameName]) {
        const gameCards1 = gameCards.map((card, index) => ({
          ...card,
          imageImportName: importArr[room.gameName][index][0],
        }));   
        const gameCards2 = gameCards.map((card, index) => ({
          ...card,
          imageImportName: importArr[room.gameName][index][1],
        }));
        gameCards = shuffle(gameCards1.concat(gameCards2));
        room.cardsData = gameCards; 
      }      
    }
  }
  return rooms;
};

// Initialize rooms with data from rooms.json
const initRoomsFromJson = async () => {
  const jsonURL = `${CHOSEN_PROXY_URL}/database/rooms.json`;
  const roomsData = await fetchDataFromJSON(jsonURL);
  if (roomsData) {
    return roomsData.map((room) => ({
      ...room,
      cardsData: [], // Initialize cardsData for each room (to be filled later)
    }));
  }
  return [];
};

// ... Rest of your code ...

// Export a function that initializes rooms with cardsData
export const initRoomsFunc = async () => {
  let rooms = await initRoomsFromJson();
  rooms = await initCardsInRoomsFromJson(rooms); // Make sure to await this function
  console.log("INIT -- initRoomsFunc -- rooms: ", rooms)
  return rooms;
};
