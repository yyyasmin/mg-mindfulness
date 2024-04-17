import React from "react";
import styled from "styled-components";

const PlayersContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1vw;
  margin-top: 1vw;
`;

const Player = styled.div`
  margin-bottom: 0.5vw;
  font-size: calc(0.8rem + 0.5vw);
  color: ${(props) => (props.isPlayersTurn ? "brown" : "lightbrown")};
`;

const PlayerName = styled.span`
  font-size: calc(0.8rem + 0.5vw);
  color: #808000;
`;

const BoldPlayerName = styled(PlayerName)`
  font-weight: bold;
`;

const Turn = styled.div`
  margin-left: 0.5vw;
  font-size: calc(0.8rem + 0.5vw);
  color: #808000;
`;

const Players = ({ maxMembers=2, players=[], playerName }) => {
  const currentPlayerIndex = players.findIndex((player) => player.name === playerName);
  const activePlayer = players.find((player) => player.isActive);

  return (
    <PlayersContainer>
      <Player>
        PLAYERS:{" "}
        {players.map((player, index) => (
          <PlayerName key={index}>
            {player.name === playerName ? `${player.name}(you)` : player.name}{" "}
          </PlayerName>
        ))}
        {players.length < maxMembers && (
          <PlayerName>
            Waiting for another player to join the game...
          </PlayerName>
        )}
        {activePlayer && (
          <Turn>
            ITS{" "}
            <BoldPlayerName>{activePlayer.name}</BoldPlayerName>'S TURN
          </Turn>
        )}
      </Player>
    </PlayersContainer>
  );
};

export default Players;
