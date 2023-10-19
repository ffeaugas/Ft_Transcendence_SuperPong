"use client";

import MsgItem from "./MsgItem";
import styles from "../../styles/Chat/MsgList.module.css";
import { useEffect, useRef, useState } from "react";
import React from "react";

enum ActiveDiscussionType {
  PRIV_MSG = "PRIV_MSG",
  CHANNEL = "CHANNEL",
}

type MsgListProps = {
  activeDiscussion: string | undefined;
  activeDiscussionType: ActiveDiscussionType;
  showUserInfos: (username: string | null) => void;
  submitNewMessage: (textInput: string) => void;
  messages: Message[];
};

export default function MsgList({
  showUserInfos,
  submitNewMessage,
  messages,
}: MsgListProps) {
  const [textInput, setTextInput] = useState<string>("");
  const msgListRef = useRef(null);

  function handleSubmit(evt: any) {
    evt.preventDefault();
    if (textInput === "") return;
    submitNewMessage(textInput);
    setTextInput("");
  }

  useEffect(() => {
    if (msgListRef.current) {
      msgListRef.current.scrollTop = msgListRef.current.scrollHeight;
    }
  }, [messages]);

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
          onChange={(evt) => setTextInput(evt.target.value)}
        ></input>
      </form>
    </div>
  );
}
