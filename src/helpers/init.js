// init.js
// import importArr from "./importCardFullPath.js"; // Import all exports for images loading 
import { shuffle } from "./shuffle"; // Import all exports for images loading 
import { CHOSEN_PROXY_URL } from "./ServerRoutes.js"

// Import all the required images for Emotions-1
const em1_1 = require("../assets/textures/emotions_1/png1/em1.png");
const em1_2 = require("../assets/textures/emotions_1/png2/em1.png");
const em2_1 = require("../assets/textures/emotions_1/png1/em2.png");
const em2_2 = require("../assets/textures/emotions_1/png2/em2.png");
const em3_1 = require("../assets/textures/emotions_1/png1/em3.png");
const em3_2 = require("../assets/textures/emotions_1/png2/em3.png");
const em4_1 = require("../assets/textures/emotions_1/png1/em4.png");
const em4_2 = require("../assets/textures/emotions_1/png2/em4.png");
const emotions1Cards = [
  [em1_1, em1_2],
  [em2_1, em2_2],
  [em3_1, em3_2],
  [em4_1, em4_2]
];

// Import all the required images for Emotions-2
const em5_1 = require("../assets/textures/emotions_2/png1/em5.png");
const em5_2 = require("../assets/textures/emotions_2/png2/em5.png");
const em6_1 = require("../assets/textures/emotions_2/png1/em6.png");
const em6_2 = require("../assets/textures/emotions_2/png2/em6.png");
const em7_1 = require("../assets/textures/emotions_2/png1/em7.png");
const em7_2 = require("../assets/textures/emotions_2/png2/em7.png");
const em8_1 = require("../assets/textures/emotions_2/png1/em8.png");
const em8_2 = require("../assets/textures/emotions_2/png2/em8.png");
const em9_1 = require("../assets/textures/emotions_2/png1/em9.png");
const em9_2 = require("../assets/textures/emotions_2/png2/em9.png");
const em10_1 = require("../assets/textures/emotions_2/png1/em10.png");
const em10_2 = require("../assets/textures/emotions_2/png2/em10.png");
const emotions2Cards = [
  [em5_1, em5_2],
  [em6_1, em6_2],
  [em7_1, em7_2],
  [em8_1, em8_2],
  [em9_1, em9_2],
  [em10_1, em10_2]
];

// Import all the required images for Intimacy-1
const inti1_1 = require("../assets/textures/intimacy_1/png1/inti1.png");
const inti1_2 = require("../assets/textures/intimacy_1/png2/inti1.png");
const inti2_1 = require("../assets/textures/intimacy_1/png1/inti2.png");
const inti2_2 = require("../assets/textures/intimacy_1/png2/inti2.png");
const inti3_1 = require("../assets/textures/intimacy_1/png1/inti3.png");
const inti3_2 = require("../assets/textures/intimacy_1/png2/inti3.png");
const inti4_1 = require("../assets/textures/intimacy_1/png1/inti4.png");
const inti4_2 = require("../assets/textures/intimacy_1/png2/inti4.png");
const inti5_1 = require("../assets/textures/intimacy_1/png1/inti5.png");
const inti5_2 = require("../assets/textures/intimacy_1/png2/inti5.png");
const inti6_1 = require("../assets/textures/intimacy_1/png1/inti6.png");
const inti6_2 = require("../assets/textures/intimacy_1/png2/inti6.png");
const inti7_1 = require("../assets/textures/intimacy_1/png1/inti7.png");
const inti7_2 = require("../assets/textures/intimacy_1/png2/inti7.png");
const inti8_1 = require("../assets/textures/intimacy_1/png1/inti8.png");
const inti8_2 = require("../assets/textures/intimacy_1/png2/inti8.png");
const inti9_1 = require("../assets/textures/intimacy_1/png1/inti9.png");
const inti9_2 = require("../assets/textures/intimacy_1/png2/inti9.png");
const inti10_1 = require("../assets/textures/intimacy_1/png1/inti10.png");
const inti10_2 = require("../assets/textures/intimacy_1/png2/inti10.png");
const inti11_1 = require("../assets/textures/intimacy_1/png1/inti11.png");
const inti11_2 = require("../assets/textures/intimacy_1/png2/inti11.png");
const inti12_1 = require("../assets/textures/intimacy_1/png1/inti12.png");
const inti12_2 = require("../assets/textures/intimacy_1/png2/inti12.png");
const intimacy1Cards = [
  [inti1_1, inti1_2],
  [inti2_1, inti2_2],
  [inti3_1, inti3_2],
  [inti4_1, inti4_2],
  [inti5_1, inti5_2],
  [inti6_1, inti6_2],
  [inti7_1, inti7_2],
  [inti8_1, inti8_2],
  [inti9_1, inti9_2],
  [inti10_1, inti10_2],
  [inti11_1, inti11_2],
  [inti12_1, inti12_2]
];

// Import all the required images for Calm-1
const calm1_1 = require("../assets/textures/calm_1/png1/calm1.PNG");
const calm1_2 = require("../assets/textures/calm_1/png2/calm1.PNG");
const calm2_1 = require("../assets/textures/calm_1/png1/calm2.PNG");
const calm2_2 = require("../assets/textures/calm_1/png2/calm2.PNG");
const calm3_1 = require("../assets/textures/calm_1/png1/calm3.PNG");
const calm3_2 = require("../assets/textures/calm_1/png2/calm3.PNG");
const calm4_1 = require("../assets/textures/calm_1/png1/calm4.PNG");
const calm4_2 = require("../assets/textures/calm_1/png2/calm4.PNG");
const calm5_1 = require("../assets/textures/calm_1/png1/calm5.PNG");
const calm5_2 = require("../assets/textures/calm_1/png2/calm5.PNG");
const calm6_1 = require("../assets/textures/calm_1/png1/calm6.PNG");
const calm6_2 = require("../assets/textures/calm_1/png2/calm6.PNG");
const calm7_1 = require("../assets/textures/calm_1/png1/calm7.PNG");
const calm7_2 = require("../assets/textures/calm_1/png2/calm7.PNG");
const calm1Cards = [
  [calm1_1, calm1_2],
  [calm2_1, calm2_2],
  [calm3_1, calm3_2],
  [calm4_1, calm4_2],
  [calm5_1, calm5_2],
  [calm6_1, calm6_2],
  [calm7_1, calm7_2]
];

// Import all the required images for first_letter_1
const fl1_1 = require("../assets/textures/first_letter_1/png1/fl1.PNG");
const fl1_2 = require("../assets/textures/first_letter_1/png2/fl1.PNG");
const fl2_1 = require("../assets/textures/first_letter_1/png1/fl2.PNG");
const fl2_2 = require("../assets/textures/first_letter_1/png2/fl2.PNG");
const fl3_1 = require("../assets/textures/first_letter_1/png1/fl3.PNG");
const fl3_2 = require("../assets/textures/first_letter_1/png2/fl3.PNG");
const fl4_1 = require("../assets/textures/first_letter_1/png1/fl4.PNG");
const fl4_2 = require("../assets/textures/first_letter_1/png2/fl4.PNG");
const fl5_1 = require("../assets/textures/first_letter_1/png1/fl5.PNG");
const fl5_2 = require("../assets/textures/first_letter_1/png2/fl5.PNG");
const fl6_1 = require("../assets/textures/first_letter_1/png1/fl6.PNG");
const fl6_2 = require("../assets/textures/first_letter_1/png2/fl6.PNG");
const firstLetter1Cards = [
  [fl1_1, fl1_2],
  [fl2_1, fl2_2],
  [fl3_1, fl3_2],
  [fl4_1, fl4_2],
  [fl5_1, fl5_2],
  [fl6_1, fl6_2]
];


// Import all the required images for Deep-1
const d1_1 = require("../assets/textures/deep_1/png1/d1.png");
const d1_2 = require("../assets/textures/deep_1/png2/d1.png");
const d2_1 = require("../assets/textures/deep_1/png1/d2.PNG");
const d2_2 = require("../assets/textures/deep_1/png2/d2.PNG");
const d3_1 = require("../assets/textures/deep_1/png1/d3.PNG");
const d3_2 = require("../assets/textures/deep_1/png2/d3.PNG");
const d4_1 = require("../assets/textures/deep_1/png1/d4.PNG");
const d4_2 = require("../assets/textures/deep_1/png2/d4.PNG");
const d5_1 = require("../assets/textures/deep_1/png1/d5.png");
const d5_2 = require("../assets/textures/deep_1/png2/d5.png");
const d6_1 = require("../assets/textures/deep_1/png1/d6.png");
const d6_2 = require("../assets/textures/deep_1/png2/d6.png");
const d7_1 = require("../assets/textures/deep_1/png1/d7.png");
const d7_2 = require("../assets/textures/deep_1/png2/d7.png");
const d8_1 = require("../assets/textures/deep_1/png1/d8.png");
const d8_2 = require("../assets/textures/deep_1/png2/d8.png");
const d9_1 = require("../assets/textures/deep_1/png1/d9.png");
const d9_2 = require("../assets/textures/deep_1/png2/d9.png");
const d10_1 = require("../assets/textures/deep_1/png1/d10.png");
const d10_2 = require("../assets/textures/deep_1/png2/d10.png");
const d11_1 = require("../assets/textures/deep_1/png1/d11.png");
const d11_2 = require("../assets/textures/deep_1/png2/d11.png");
const d12_1 = require("../assets/textures/deep_1/png1/d12.png");
const d12_2 = require("../assets/textures/deep_1/png2/d12.png");
const d13_1 = require("../assets/textures/deep_1/png1/d13.png");
const d13_2 = require("../assets/textures/deep_1/png2/d13.png");
const d14_1 = require("../assets/textures/deep_1/png1/d14.png");
const d14_2 = require("../assets/textures/deep_1/png2/d14.png");
const d15_1 = require("../assets/textures/deep_1/png1/d15.png");
const d15_2 = require("../assets/textures/deep_1/png2/d15.png");
const d16_1 = require("../assets/textures/deep_1/png1/d16.png");
const d16_2 = require("../assets/textures/deep_1/png2/d16.png");
const d17_1 = require("../assets/textures/deep_1/png1/d17.png");
const d17_2 = require("../assets/textures/deep_1/png2/d17.png");
const d18_1 = require("../assets/textures/deep_1/png1/d18.png");
const d18_2 = require("../assets/textures/deep_1/png2/d18.png");
const d19_1 = require("../assets/textures/deep_1/png1/d19.png");
const d19_2 = require("../assets/textures/deep_1/png2/d19.png");
const d20_1 = require("../assets/textures/deep_1/png1/d20.png");
const d20_2 = require("../assets/textures/deep_1/png2/d20.png");
const d21_1 = require("../assets/textures/deep_1/png1/d21.png");
const d21_2 = require("../assets/textures/deep_1/png2/d21.png");
const d22_1 = require("../assets/textures/deep_1/png1/d22.png");
const d22_2 = require("../assets/textures/deep_1/png2/d22.png");
const d23_1 = require("../assets/textures/deep_1/png1/d23.png");
const d23_2 = require("../assets/textures/deep_1/png2/d23.png");
const d24_1 = require("../assets/textures/deep_1/png1/d24.PNG");
const d24_2 = require("../assets/textures/deep_1/png2/d24.PNG");
const d25_1 = require("../assets/textures/deep_1/png1/d25.png");
const d25_2 = require("../assets/textures/deep_1/png2/d25.png");
const d26_1 = require("../assets/textures/deep_1/png1/d26.PNG");
const d26_2 = require("../assets/textures/deep_1/png2/d26.PNG");
const d27_1 = require("../assets/textures/deep_1/png1/d27.PNG");
const d27_2 = require("../assets/textures/deep_1/png2/d27.PNG");
const d28_1 = require("../assets/textures/deep_1/png1/d28.png");
const d28_2 = require("../assets/textures/deep_1/png2/d28.png");
const d29_1 = require("../assets/textures/deep_1/png1/d29.PNG");
const d29_2 = require("../assets/textures/deep_1/png2/d29.PNG");
const d30_1 = require("../assets/textures/deep_1/png1/d30.png");
const d30_2 = require("../assets/textures/deep_1/png2/d30.png");
const d31_1 = require("../assets/textures/deep_1/png1/d31.png");
const d31_2 = require("../assets/textures/deep_1/png2/d31.png");
const d32_1 = require("../assets/textures/deep_1/png1/d32.png");
const d32_2 = require("../assets/textures/deep_1/png2/d32.png");
const d33_1 = require("../assets/textures/deep_1/png1/d33.png");
const d33_2 = require("../assets/textures/deep_1/png2/d33.png");
const d34_1 = require("../assets/textures/deep_1/png1/d34.png");
const d34_2 = require("../assets/textures/deep_1/png2/d34.png");
const d35_1 = require("../assets/textures/deep_1/png1/d35.png");
const d35_2 = require("../assets/textures/deep_1/png2/d35.png");
const d36_1 = require("../assets/textures/deep_1/png1/d36.png");
const d36_2 = require("../assets/textures/deep_1/png2/d36.png");

// Deep-1 cards array
const deep_1Cards = [
  [d1_1, d1_2],
  [d2_1, d2_2],
  [d3_1, d3_2],
  [d4_1, d4_2],
  [d5_1, d5_2],
  [d6_1, d6_2],
  [d7_1, d7_2],
  [d8_1, d8_2],
  [d9_1, d9_2],
  [d10_1, d10_2],
  [d11_1, d11_2],
  [d12_1, d12_2],
  [d13_1, d13_2],
  [d14_1, d14_2],
  [d15_1, d15_2],
  [d16_1, d16_2],
  [d17_1, d17_2],
  [d18_1, d18_2],
  [d19_1, d19_2],
  [d20_1, d20_2],
  [d21_1, d21_2],
  [d22_1, d22_2],
  [d23_1, d23_2],
  [d24_1, d24_2],
  [d25_1, d25_2],
  [d26_1, d26_2],
  [d27_1, d27_2],
  [d28_1, d28_2],
  [d29_1, d29_2],
  [d30_1, d30_2],
  [d31_1, d31_2],
  [d32_1, d32_2],
  [d33_1, d33_2],
  [d34_1, d34_2],
  [d35_1, d35_2],
  [d36_1, d36_2]
];



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

          case "3":
              importArr[room.id] = calm1Cards;
              break;

          case "4":
            importArr[room.id] = firstLetter1Cards;
            break;

          case "5":
            importArr[room.id] = deep_1Cards;
            break;

          default:
            console.log("NO ROOM WITH ID ", room.id, "in database-Cards.json file")
            // Handle other cases or provide a default card set
            break;
        }
        console.log("init - server - importArr: ", importArr)

        let gameCards1 = gameCards.map((card, index) => {
          // console.log('Init -- Index:', index); // Log the index
          // console.log('Init -- importArr[room.id][index][0]:', importArr[room.id][index][0]); // Log the index

          return {
            ...card,
            imageImportName: importArr[room.id][index][0]
          };
        });
        
        let gameCards2 = gameCards.map((card, index) => ({
          ...card,
          imageImportName: importArr[room.id][index][1]
        }));
                
        gameCards = gameCards1.concat(gameCards2);
        gameCards = shuffle(gameCards);
        room.cardsData = gameCards;

        console.log("INIT -- AFTER SHUFFLE -- room: ", room);
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
