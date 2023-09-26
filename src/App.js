// App.js

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import RoomsList from "./components/RoomsList";
import { initRoomsFunc } from "./helpers/init"; // Import the initialization function

const AppContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  background-color: snow;
`;

// const Title = styled.h1`
//   margin-top: 15px;
//   font-size: 4rem;
// `;

function App() {
  const [userName, setUserName] = useState("");
  const [roomsInitialData, setRoomsInitialData] = useState(null); // State to hold initialization data

  useEffect(() => {
    // Initialize the app when it mounts
    const init = async () => {
      try {
        const initRoomsObj = await initRoomsFunc();
        setRoomsInitialData(initRoomsObj);
      } catch (error) {
        console.error("Error initializing the app:", error);
      }
    };

    init();
  }, []);

  
  useEffect(() => {
    if  ( roomsInitialData )  {
      setUserName('yyy')
    }
  }, [roomsInitialData]);

  return (
      <AppContainer>
 <RoomsList userName={userName} roomsInitialData={roomsInitialData} />
      </AppContainer>

  );
}

export default App;
