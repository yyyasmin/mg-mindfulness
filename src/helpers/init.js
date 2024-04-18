
import { Acquaintance_1 } from "./GameCards/Acquaintance_1.js";

import { shuffle } from "./shuffle"; // Import all exports for images loading
import { CHOSEN_PROXY_URL } from "./ServerRoutes.js";

const TITLE_SIZE = "2.5rem";

const fetchDataFromJSON = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

const getInitialGallerySize = () => {
	let initialGallerySize = { 
    width: window.innerWidth,
    height: window.innerHeight - parseFloat(TITLE_SIZE)
  }
	return initialGallerySize			
}


export const calculateCardSize = (cardsNum) => {
  const initialSize = getInitialGallerySize();
  const containerWidth = initialSize.width;
  const containerHeight = initialSize.height;
  let cols, rows

  switch(cardsNum)  {

  case 2:
    cols = 2
    rows = 1
    break;

	case 8:
      cols = 4
	  rows = 2
	  break;

    case 10:
      cols = 5
      rows = 2
      break;

    case 12:
      cols = 4
      rows = 3
      break;

    case 14:
      cols = 7
      rows = 2
      break;

    case 16:
      cols = 4
      rows = 4
      break;

    case 18:
      cols = 6
      rows = 3
      break;

    case 20:
      cols = 5
      rows = 4
      break;

    case 22:
      cols = 5
      rows = 5
      break;

    case 24:
      cols = 6
      rows = 4
      break;

    case 26:
      cols = 5
      rows = 5
      break;

    case 28:
      cols = 7
      rows = 4
      break;

    case 30:
      cols = 6
      rows = 5
      break;

    default:
      cols = 4
      rows = 4
  }   // END switch

  //if its a vertical screen swap cols and rows
  if ( containerHeight > containerWidth)  {
    let tmpCols = cols
    cols = rows
    rows = tmpCols
  }

  let totalGapWidth = containerWidth * 2 / 100  //2%
  let totalGapHeight = containerHeight * 2 / 100  //2%

  let gapWidth = totalGapWidth / (cols+1)
  let gapHeight = totalGapHeight / (rows+1)

  let cardWidth = ( containerWidth - (totalGapWidth+1) ) / cols
  cardWidth = Math.min(0.4 * containerWidth, cardWidth);

  let cardHeight = ( containerHeight - (totalGapHeight+1) ) / rows
  cardHeight = Math.min(containerHeight*0.6, cardHeight*0.8)

  console.log("IN init -- calculateCardSize -- cardsNum, cardWidth, cardHeight:  ", cardsNum, cardWidth, cardHeight)

  
  //let cardWidth = CARD_RATIO * cardHeight
  const cardSize = {
    card: {
      width: cardWidth,
      height: cardHeight,
    },
    gap: {
      width: gapWidth,
      height: gapHeight,
    },
  };
  console.log("IN init -- calculateCardSize -- cardsNum, cardSize:  ", cardsNum, cardSize)

  return cardSize;
};


// Initialize cards in rooms from a JSON file based on gameName
const initCardsInRoomsFromJson = async (rooms) => {
  for (const room of rooms) {
    const jsonURL = `${CHOSEN_PROXY_URL}/database/GameCards/${room.gameName}.json`;
    const cardsData = await fetchDataFromJSON(jsonURL);

    if (cardsData) {
      let gameCards = cardsData.gameCards || [];
      const importArr = {
        Acquaintance_1: Acquaintance_1
        // Add more gameName mappings as needed
      };

      const backgroundImage = importArr[room.gameName] ? importArr[room.gameName][0] : null;


      if (importArr[room.gameName]) {
        const gameCards1 = gameCards.map((card, index) => ({
          ...card,
          imageImportName: importArr[room.gameName][index+1][0],
        }));   
        const gameCards2 = gameCards.map((card, index) => ({
          ...card,
          imageImportName: importArr[room.gameName][index+1][1],
        }));
        gameCards = shuffle(gameCards1.concat(gameCards2));
        room.cardsData = gameCards; 
        room.cardSize = calculateCardSize(gameCards.length)
		    room.MatchedCardSize = calculateCardSize(2)
        console.log("IN initCardsInRoomsFromJson -- room.MatchedCardSize: ", room.MatchedCardSize)
        room.backgroundImage = backgroundImage;
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
  ////console.log("11-11-11-11");
  let rooms = await initRoomsFromJson();
  console.log("IN init -- rooms: ", rooms)
  rooms = await initCardsInRoomsFromJson(rooms); // Make sure to await this function
  return rooms;
};