import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MsgContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* Allow Msg to wrap to the next row if needed */
  gap: 40px;
  justify-content: center;
  margin-bottom: 5px; /* Adjust the bottom margin */
`;

const MsgSection = styled.div`
  margin-bottom: 10px; /* Adjust the vertical spacing between Msg */
  font-size: 2.3rem;
`;

const WaitingMsg = () => {

  return (
    <Container>
      <MsgContainer>
          <MsgSection>Waiting for another player to join the room...</MsgSection>
      </MsgContainer>
    </Container>
  );
};

export default WaitingMsg;
