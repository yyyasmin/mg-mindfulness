// init.js
// import importArr from "./importCardFullPath.js"; // Import all exports for images loading 
import { shuffle } from "./shuffle"; // Import all exports for images loading 
import { CHOSEN_PROXY_URL } from "./ServerRoutes.js"

// Import all the required images for Emotions-1
const em1 = require("../assets/textures/emotions_1/png/em1.png");
const em2 = require("../assets/textures/emotions_1/png/em2.png");
const em3 = require("../assets/textures/emotions_1/png/em3.png");
const em4 = require("../assets/textures/emotions_1/png/em4.png");

// Import all the required images for Emotions-2
const em5 = require("../assets/textures/emotions_2/png/em5.png");
const em6 = require("../assets/textures/emotions_2/png/em6.png");
const em7 = require("../assets/textures/emotions_2/png/em7.png");
const em8 = require("../assets/textures/emotions_2/png/em8.png");
const em9 = require("../assets/textures/emotions_2/png/em9.png");
const em10 = require("../assets/textures/emotions_2/png/em10.png");

// Import all the required images for Intimacy-1
const inti1 = require("../assets/textures/intimacy_1/png/inti1.png");
const inti2 = require("../assets/textures/intimacy_1/png/inti2.png");
const inti3 = require("../assets/textures/intimacy_1/png/inti3.png");
const inti4 = require("../assets/textures/intimacy_1/png/inti4.png");
const inti5 = require("../assets/textures/intimacy_1/png/inti5.png");
const inti6 = require("../assets/textures/intimacy_1/png/inti6.png");
const inti7 = require("../assets/textures/intimacy_1/png/inti7.png");
const inti8 = require("../assets/textures/intimacy_1/png/inti8.png");
const inti9 = require("../assets/textures/intimacy_1/png/inti9.png");
const inti10 = require("../assets/textures/intimacy_1/png/inti10.png");
const inti11 = require("../assets/textures/intimacy_1/png/inti11.png");
const inti12 = require("../assets/textures/intimacy_1/png/inti12.png");

// Create separate arrays for each room's card set
const emotions1Cards = [em1, em2, em3, em4];
const emotions2Cards = [em5, em6, em7, em8, em9, em10];
const intimacy1Cards = [inti1, inti2, inti3, inti4, inti5, inti6, inti7, inti8, inti9, inti10, inti11, inti12];

console.log("init - server - CHOSEN_PROXY_URL: ", CHOSEN_PROXY_URL)


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
  const jsonURL = `${CHOSEN_PROXY_URL}/database/rooms.json`;
  console.log("7777 - initRoomsFromJson -- jsonURL: ", jsonURL)

  const roomsData = await fetchDataFromJSON(jsonURL);
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


// Initialize cards in rooms from Cards.json
const initCardsInRoomsFromJson = async (rooms) => {
  const jsonURL = `${CHOSEN_PROXY_URL}/database/Cards.json`;
  let importArr = [];

  const cardsData = await fetchDataFromJSON(jsonURL);

  if (cardsData) {
    rooms.forEach((room) => {
      if (cardsData[room.id]) {
        let gameCards = cardsData[room.id].gameCards || [];
         // Assign the appropriate card set based on the room's gameName
         switch (room.id) {

          case "0":
            importArr[room.id] = emotions1Cards;
            break;

          case "1":
            importArr[room.id] = emotions2Cards;
            break;

          case "2":
            importArr[room.id] = intimacy1Cards;
            break;

          default:
            console.log("NO ROOM WITH ID ", room.id, "in database-Cards.json file")
            // Handle other cases or provide a default card set
            break;
        }
        console.log("init - server - importArr: ", importArr)

        // Map each card to include the imported image directly
        gameCards = gameCards.map((card, index) => ({
          ...card, // Use spread operator to copy the card
          imageImportName: importArr[room.id][index]
        }));
        // Duplicate each card and use spread operator
        gameCards = gameCards.flatMap((card) => [{ ...card }, { ...card }]);
        gameCards = shuffle(gameCards);
        // Assign the shuffled gameCards array back to the room's cardsData property
        room.cardsData = gameCards;

        console.log("INIT -- AFTER SHUFFLE -- room.cardsData: ", room.cardsData);
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
