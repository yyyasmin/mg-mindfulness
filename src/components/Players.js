import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ReactCardFlip from "react-card-flip";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wellcome = styled.h1`
  font-size: 2.5rem;
  margin: 10px 0 5px 0; /* Adjust top and bottom margin */
`;

const PlayersContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* Allow players to wrap to the next row if needed */
  gap: 40px;
  justify-content: center;
  margin-bottom: 5px; /* Adjust the bottom margin */
`;

const Player = styled.div`
  margin-bottom: 10px; /* Adjust the vertical spacing between players */
  font-size: 2.3rem;
`;

const Players = (props) => {
  const players = props.players;

  return (
    <Container>
      <PlayersContainer>
        {players.map((player, index) => (
          <Player key={index}>Player: {player.name}</Player>
        ))}
      </PlayersContainer>
    </Container>
  );
};

export default Players;
