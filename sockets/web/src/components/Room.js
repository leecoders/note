import React, { useState, useEffect } from "react";
import styled from "styled-components";
import io from "socket.io-client";
import Speech from "./Speech.js";

function Room() {
  const [socket, setSocket] = useState(io.connect("http://localhost:8000"));
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log("client is connected on socket");
    socket.on("add message", data => {
      console.log(data);
      setMessages(data.messages);
    });
  }, []);

  const sendMessageToServer = () => {
    socket.emit("new message", text);
    setText("");
    document.querySelector(".text-input").focus();
  };

  return (
    <RoomWrapper>
      <MessageContainer
        onClick={() => {
          document.querySelector(".text-input").focus();
        }}
      >
        {messages.map((message, idx) => {
          return <Speech key={idx} message={message} />;
        })}
      </MessageContainer>
      <InputContainer>
        <Input
          className="text-input"
          value={text}
          onChange={e => {
            setText(e.target.value);
          }}
          onKeyPress={e => {
            if (e.key === "Enter") {
              sendMessageToServer();
            }
          }}
          autoFocus
        />
        <Button onClick={sendMessageToServer}>전송</Button>
      </InputContainer>
    </RoomWrapper>
  );
}

const RoomWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  font-size: 2rem;
`;
const MessageContainer = styled.div`
  position: relative;
  margin: 0 auto;
  width: 100%;
  height: 90%;
  font-size: 2rem;
`;
const InputContainer = styled.div`
  position: relative;
  width: 100%;
  height: 10%;
  border-top: 1px solid #868e96;
`;
const Input = styled.input`
  position: relative;
  display: inline-block;
  top: 50%;
  transform: translateY(-50%);
  left: 3rem;
  width: 85%;
  height: 5rem;
  border: none;
  outline: none;
  background: #ffffff;
  font-size: 2rem;
  padding: 0 1rem;
`;
const Button = styled.div`
  position: absolute;
  display: inline-block;
  top: 50%;
  transform: translateY(-50%);
  right: 1rem;
  width: 8%;
  height: 5rem;
  line-height: 5rem;
  background: #adb5bd;
  border: none;
  outline: none;
  text-align: center;
  border-radius: 0.4rem;
`;

export default Room;