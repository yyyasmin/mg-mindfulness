import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PlayersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: center;
  margin-bottom: 5px;
`;

const Player = styled.div`
  margin-bottom: 10px;
  font-size: ${(props) => (props.isPlayersTurn ? "2.3rem" : "2.3rem")};
  font-weight: ${(props) => (props.isPlayersTurn ? "650" : "500")};
  color: ${(props) => (props.isPlayersTurn ? "brown" : "lightbrown")};
`;
const PlayerName = styled.div`
  margin-bottom: 10px;
  font-size: 2.3rem;
  font-weight: 500;
  color: #C4B454;
`;
const Turn = styled.div`
  margin-bottom: 10px;
  font-size: 2.3rem;
  font-weight: 650;
  color: #808000;
`;

const Players = (props) => {
  const { players, playerName } = props

  const activePlayerIndex = players.findIndex((player) => player.isActive);
  const activePlayer = players[activePlayerIndex]

  return (
    <Container>

      <PlayersContainer>
        <PlayerName> 
          You are: {playerName}
        </PlayerName>

        <Turn> 
            It's {activePlayer ? activePlayer.name + "'s" : ""} turn
        </Turn>
      </PlayersContainer>

      <PlayersContainer>
        {players.map((player, index) => (
          <Player
              key={index}
              isPlayersTurn={player.isActive}>
            Player: {player.name}
          </Player>
        ))}
      </PlayersContainer>

    </Container>
  );
};

export default Players;
