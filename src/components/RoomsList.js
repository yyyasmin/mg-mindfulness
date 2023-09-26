import React, { useState, useEffect } from "react";
import styled from "styled-components";
//import { useNavigate  } from "react-router-dom";

import {  updateCurentRoomAndActiveRooms,
  removeUpdatedRoomDataListener,
  emitAddMemberToRoom
} from "../clientSocketServices";

const GameContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
  background-color: snow;

`;

const RoomsList = ({ userName, roomsInitialData }) => {
  
  const [currentRoom, setCurrentRoom] = useState({});
  const [updatedActiveRooms, setUpdatedActiveRooms] = useState([]);

  const handleJoinRoom = async (chosenRoom) => {
    
      emitAddMemberToRoom({
        playerName: userName,
        chosenRoom: chosenRoom,
      });  
  }

  useEffect(() => {
    // Listen for updated room data from the server - 
	// when arive - set updated curentRoom and activeRooms values sent by server
    updateCurentRoomAndActiveRooms(setUpdatedActiveRooms, setCurrentRoom);
    // Clean up the event listener when the component unmounts
    return () => {
      removeUpdatedRoomDataListener();
    };
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts


  // Use useEffect to listen for changes in updatedActiveRooms and currentRoom
  useEffect(() => {
    // Check if updatedActiveRooms has a length greater than 0
    if (currentRoom != undefined && currentRoom.id >= 0) {
      console.log("IN RoomsList 2222 -- useEffect[updatedActiveRooms, currentRoom] -- passing to GAME -- currentRoom: ", currentRoom);
      
	  // Navigate to the game page
      //navigate(`/game/${currentRoom.id}`, {
      //  state: { userName, currentRoom },
      //  });
    }
  }, [currentRoom]);
  

  return (
    <GameContainer>
      <h3>Available Rooms:</h3>
      <table>
        <thead>
          <tr>
            <th>Room Name</th>
            <th>Difficulty</th>
            <th>Max Members</th>
            <th>Info</th>
            <th>Join</th>
          </tr>
        </thead>
        <tbody>
          {roomsInitialData.map((room) => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>{room.difficulty}</td>
              <td>{room.maxMembers}</td>
              <td>
                <a
                  href={room.info}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {room.name}
                </a>
              </td>
              <td>
                <button onClick={() => handleJoinRoom(room)}>Join</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </GameContainer>
  );
};

export default RoomsList;
