/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import MsgItem from "./MsgItem";
import styles from "../../styles/Chat/MsgList.module.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import React from "react";
import { Socket, io } from "socket.io-client";

enum ActiveDiscussionType {
  PRIV_MSG = "PRIV_MSG",
  CHANNEL = "CHANNEL",
}

type MsgListProps = {
  activeDiscussion: string | undefined;
  activeDiscussionType: ActiveDiscussionType;
  showUserInfos: (username: string | null) => void;
};

export default function MsgList({
  activeDiscussion,
  activeDiscussionType,
  showUserInfos,
}: MsgListProps) {
  const [textInput, setTextInput] = useState<string>("");
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<Message[] | undefined>(undefined);

  const msgListRef = useRef(null);

  async function socketInitializer(): Promise<any> {
    const socket = io("http://10.5.0.3:3001");

    socket?.on("connect", () => {
      console.log("connected");
    });
    setSocket(socket);
  }

  function sendMessage(data: string) {
    socket?.emit("message", data);
  }

  useEffect(() => {
    socketInitializer();
  }, [setSocket]);

  async function addMessage(content: string) {
    try {
      const data = {
        channelName: activeDiscussion,
        content: textInput,
      };

      const res = await fetch("http://10.5.0.3:3001/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error adding a new message", error);
    }
  }

  async function getMessages(): Promise<Message[] | undefined> {
    if (activeDiscussionType === ActiveDiscussionType.CHANNEL) {
      try {
        const res = await axios.get("http://10.5.0.3:3001/channels/messages", {
          params: { channelName: activeDiscussion },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const messages = res.data;
        return messages;
      } catch (error) {
        console.error("Error fetching channel messages", error);
        return undefined;
      }
    }
    return undefined;
  }

  function handleChange(evt: any) {
    const { name, value } = evt.target;
    setTextInput(value);
  }

  function handleSubmit(evt: any) {
    evt.preventDefault();
    addMessage(textInput);
    sendMessage(textInput);
    setTextInput("");
  }

  function messageListner(message: Message) {
    console.log(message);
    if (messages) setMessages([...messages, message]);
  }

  useEffect((): any => {
    socket?.on("message", messageListner);
    return () => socket?.off("message", messageListner);
  }, [messageListner]);

  useEffect(() => {
    getMessages().then((messages) => {
      setMessages(messages);
    });
  }, [activeDiscussion]);

  useEffect(() => {
    getMessages().then((messages) => {
      setMessages(messages);
    });
  }, [activeDiscussionType]);

  useEffect(() => {
    if (msgListRef.current) {
      msgListRef.current.scrollTop = msgListRef.current.scrollHeight;
    }
  }, [messages]);

  if (!messages) {
    return <p>...</p>;
  }

  return (
    <div className={`${styles.msgList}`}>
      <ul ref={msgListRef}>
        {messages.map((message) => (
          <MsgItem
            key={message.id}
            message={message}
            showUserInfos={showUserInfos}
          />
        ))}
      </ul>
      <form onSubmit={(evt) => handleSubmit(evt)}>
        <input
          type="text"
          name="textInput"
          value={textInput}
          onChange={(evt) => handleChange(evt)}
        ></input>
      </form>
    </div>
  );
}
