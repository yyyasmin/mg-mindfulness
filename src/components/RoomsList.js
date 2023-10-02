import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate  } from "react-router-dom";
import isEmpty from "../helpers/isEmpty";

import {  
  updateCurentRoom,
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
  const navigate = useNavigate(); // Get the navigate function from React Router
  

  console.log("Rooms -- roomsInitialData: ", roomsInitialData)

  const handleJoinRoom = async (chosenRoom) => {
      console.log("1111")
      console.log("ROOMS -- handleJoinRoom -- chosenRoom", chosenRoom)
      console.log("RoomsList -- playerName: ", userName)

      emitAddMemberToRoom({
        playerName: userName,
        chosenRoom: chosenRoom,
      });  
  }

  useEffect(() => {
    console.log("2222")
    updateCurentRoom(setCurrentRoom);
    return () => {
      removeUpdatedRoomDataListener();
    };
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts


  useEffect(() => {
    console.log("RoomList -- useEffect[currentRoom] -- currentRoom: ", currentRoom)

    if (currentRoom !== null && currentRoom !== undefined && currentRoom.id >= 0) {
      console.log("IN RoomsList 2222 -- useEffect[currentRoom] -- passing to GAME -- currentRoom: ", currentRoom);
      // Navigate to the game page
      navigate(`/game/${currentRoom.id}`, {
        state: { userName, currentRoom },
      });
    }
  }, [currentRoom]);
  
  console.log("4444")


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
