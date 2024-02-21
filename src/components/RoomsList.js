import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import isEmpty from "../helpers/isEmpty";
import {
  updateCr,
  removeUpdatedRoomDataListener,
  emitAddMemberToRoom,
  emitCurentRoomChanged,

} from "../clientSocketServices";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: Lobster, Georgia, serif;
  color: #545454;
`;

const GameHeading = styled.h1`
  text-align: center;
  font-size: 2.4rem;
  margin: 0 0 0.8em;
`;

const RoomList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const RoomItem = styled.li`
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;
  margin: 10px;
  width: 180px;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  text-align: center;
  border: 8px solid ${(props) => props.frameColor};
  border-radius: 5px;
  box-shadow: 0 2px 6px 0 rgba(0,0,0,0.1);
  position: relative;
  transition: all .2s ease-in-out;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
  }
`;

const RoomInfoLink = styled.a`
  color: #fff;
  text-decoration: none;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 5px;
  margin: 5px 0;
`;

const JoinButton = styled.button`
  background-color: ${(props) => props.btnColor};
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;

`;

const RoomsList = ({ userName, roomsInitialData }) => {
  const [currentRoom, setCr] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const handleUpdateCr = (room) => setCr(room);
    updateCr(handleUpdateCr);

    return () => {
      removeUpdatedRoomDataListener();
    };
  }, []);

  useEffect(() => {
    if (currentRoom && currentRoom.id >= 0) {
      navigate(`/game/${currentRoom.id}`, {
        state: { userName, currentRoom },
      });
    }
  }, [currentRoom, navigate, userName]);

  
  const broadcastChangeCr = async (updatedCr) => {
    //console.log("IN RoomsList -- broadcastChangeCr -- updatedCr: ", updatedCr)
    if ( !isEmpty(updatedCr) )  {
        await emitCurentRoomChanged({ ...updatedCr });
    }
  }

  const handleJoinRoom = async (room) => {
    if (!isEmpty(userName)) {
      await emitAddMemberToRoom({
        playerName: userName,
        chosenRoom: room,
      });
      // Potentially set current room here if immediate feedback is needed
      broadcastChangeCr(room);
      //console.log("IN handleJoinRoom -- after broadcastChangeCr -- currentRoom-currentPlayers: ", currentRoom.currentPlayers)
    }
  };

  return (
    <GameContainer>
      <GameHeading>Available Rooms:</GameHeading>
      <RoomList>
        {roomsInitialData.map((room) => (
          <RoomItem key={room.id} frameColor={room.frameColor} backgroundImage={room.backgroundImage}>
            <RoomInfoLink href={room.info} target="_blank" rel="noopener noreferrer">
              {room.name}
            </RoomInfoLink>
            <JoinButton btnColor={room.frameColor} onClick={() => handleJoinRoom(room)}>Join</JoinButton>
          </RoomItem>
        ))}
      </RoomList>
    </GameContainer>
  );
};

export default RoomsList;
