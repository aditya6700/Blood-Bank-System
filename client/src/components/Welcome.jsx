import React from "react";
import styled from "styled-components";
import welcomeChat from "../assets/welcomeChat.gif";

export default function Welcome({username}) {
  return (
    <Container>
      <img src={welcomeChat} alt="no chats" />
      <h2>
        Welcome, <span>{username}!</span>
      </h2>
      <h4>Please select a chat to Start messaging.</h4>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
    text-transform: capitalize;
  }
`;
