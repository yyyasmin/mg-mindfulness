// App.js

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NameForm from "./components/NameForm";
import RoomsList from "./components/RoomsList";
import Game from "./components/Game";
import { initRoomsFunc } from "./helpers/init"; // Import the initialization function
// FOR RUNNINIG
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
////console.log("12-12-12-12")

function App() {
  const [userName, setUserName] = useState("");
  const [roomsInitialData, setRoomsInitialData] = useState(null); // State to hold initialization data
  const [dataIsSet, setDataIsSet] = useState(false); // State to hold initialization data

  useEffect(() => {
    // Initialize the app when it mounts
    const init = async () => {
      ////console.log("6666")

      try {
        const initRoomsObj = await initRoomsFunc();
        setRoomsInitialData(initRoomsObj);
      } catch (error) {
        ////console.error("Error initializing the app:", error);
      }
    };
    init();
  }, []);

  
  useEffect(() => {
    ////console.log("5555")

    if  ( roomsInitialData )  {
      setDataIsSet(true)
      ////console.log("IN App roomsInitialData -- ", roomsInitialData)
    }
  }, [roomsInitialData]);

  return (
    <Router>
      <AppContainer>
        <Routes>
{ dataIsSet? <Route path="/rooms" element={<RoomsList userName={userName} roomsInitialData={roomsInitialData} />} /> : null}
          <Route path="/name" element={<NameForm setUserName={setUserName} />} />
          {/* Add the route for the game page with :roomId parameter */}
          <Route path="/game/:roomId" element={<Game />} />

          <Route path="" element={<NameForm setUserName={setUserName} />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
