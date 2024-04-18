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
  min-height: 100%;
  font-family: Lobster, Georgia, serif;
  color: #545454;
  padding: 2vw;
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
  width: 15vw;
  height: 15vw;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  text-align: center;
  border: 6px solid ${(props) => props.frameColor};
  border-radius: 5px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.2s ease-in-out;
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
  font-size: 1.5vw;
`;

const JoinButton = styled.button`
  background-color: ${(props) => props.btnColor};
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 1.5vw;
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
    if (!isEmpty(updatedCr)) {
      await emitCurentRoomChanged({ ...updatedCr });
    }
  };

  const handleJoinRoom = async (room) => {
    console.log("IN handleJoinRoom -- room: ", room)
    console.log("IN handleJoinRoom -- userName: ", userName)

    if ( !isEmpty(room) && !isEmpty(userName) ) {
      await emitAddMemberToRoom( {
        chosenRoom: room,
        playerName: userName
      } );
      broadcastChangeCr(room);
    }
  };

  console.log("In ROOM-LIST -- roomsInitialData: ", roomsInitialData)
  return (
    <GameContainer>
      <GameHeading>Get To Know Each Other Room:</GameHeading>
      <RoomList>
        {roomsInitialData.map((room) => (
          <RoomItem key={room.id} frameColor={room.frameColor} backgroundImage={room.backgroundImage}>
            <RoomInfoLink href={room.info} target="_blank" rel="noopener noreferrer">
              {room.linkTilte}
            </RoomInfoLink>
            <JoinButton btnColor={room.frameColor} onClick={() => handleJoinRoom(room)}>Join</JoinButton>
          </RoomItem>
        ))}
      </RoomList>
    </GameContainer>
  );
};

export default RoomsList;
