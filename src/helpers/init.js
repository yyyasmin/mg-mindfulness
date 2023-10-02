// init.js
// import importArr from "./importCardFullPath.js"; // Import all exports for images loading 
import { shuffle } from "./shuffle"; // Import all exports for images loading 
import { CHOSEN_PROXY_URL } from "./ServerRoutes.js"


const em1 =  require("../assets/textures/emotions_1/png/em1.png");
const em2 =  require("../assets/textures/emotions_1/png/em2.png");
const em3 =  require("../assets/textures/emotions_1/png/em3.png");
const em4 =  require("../assets/textures/emotions_1/png/em4.png");
const em5 =  require("../assets/textures/emotions_2/png/em5.png");
const em6 =  require("../assets/textures/emotions_2/png/em6.png");
const em7 =  require("../assets/textures/emotions_2/png/em7.png");
const em8 =  require("../assets/textures/emotions_2/png/em8.png");
const em9 =  require("../assets/textures/emotions_2/png/em9.png");
const em10 =  require("../assets/textures/emotions_2/png/em10.png");

const importArr =  [em1, em2, em3, em4, em5, em6, em7, em8, em9, em10];

console.log("init - server - CHOSEN_PROXY_URL: ", CHOSEN_PROXY_URL)
console.log("init - server - importArr: ", importArr)


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
  const cardsData = await fetchDataFromJSON(jsonURL);

  if (cardsData) {
    rooms.forEach((room) => {
      if (cardsData[room.id]) {
        let gameCards = cardsData[room.id].gameCards || [];
        // Map each card to include the imported image directly
        gameCards = gameCards.map((card, index) => ({
          ...card, // Use spread operator to copy the card
          imageImportName: importArr[index]
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
