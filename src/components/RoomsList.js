import React, { useState, useEffect } from "react";
import { useNavigate  } from "react-router-dom";


const RoomsList = ({ userName, roomsInitialData }) => {
  const [un, setUserName] = useState('')
  const [room, setRoomsInitialData] = useState('')

  useEffect( () => {
    if (userName != undefined && roomsInitialData != undefined)
    setUserName(userName)
    setRoomsInitialData(roomsInitialData)
  } , [])

 
  return (
    <div>
      <h3>Available Rooms:</h3>
      <table>
        <thead>
          <tr>
            <th>Room Name 1</th>
            <th>Difficulty 1</th>
            <th>Max Members 1</th>
            <th>Info 1</th>
            <th>Join 1</th>
          </tr>
        </thead>
        <tbody>
            <td>Room Name {room} 2</td>
            <td>Difficulty {un} 2</td>
            <td>Max Members 2 </td>
            <td>Info 2</td>
            <td>Join 2</td>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomsList;
