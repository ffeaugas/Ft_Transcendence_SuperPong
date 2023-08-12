"use client";

import MsgItem from "./MsgItem";
import styles from "../../styles/Chat/MsgList.module.css";
import { useEffect, useState } from "react";
import axios from "axios";

//---------[TYPES]------------//

enum ActiveChannelOption {
  PRIV_MSG = "PRIV_MSG",
  CHANNEL = "CHANNEL",
}

type MsgListProps = {
  activeChannel: string;
  activeChannelOption: ActiveChannelOption;
};

//---------------------------//

export default function MsgList({
  activeChannel,
  activeChannelOption,
}: MsgListProps) {
  const [textInput, setTextInput] = useState<string>("");
  const [messages, setMessages] = useState<any[] | undefined>(undefined);

  async function addMessage(content: string) {
    try {
      const data = {
        channelName: activeChannel,
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
      console.log(res.data);
    } catch (error) {
      console.error("Error adding a new message", error);
    }
  }

  async function getMessages(): Promise<any | undefined> {
    if (activeChannelOption === ActiveChannelOption.CHANNEL) {
      try {
        const res = await axios.get("http://10.5.0.3:3001/channels/messages", {
          params: { channelName: activeChannel },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        console.log(res.data);
        const messages = res.data;
        return messages;
      } catch (error) {
        console.error("Error fetching channel messages", error);
        return undefined;
      }
    }
    return undefined;
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setTextInput(value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    console.log(textInput);
    addMessage(textInput);
    setTextInput("");
  }

  useEffect(() => {
    getMessages().then((messages) => setMessages(messages));
  }, [activeChannel]);

  if (!messages) {
    return <p>...</p>;
  }

  return (
    <div className={`${styles.msgList}`}>
      <h2>Chat :</h2>
      <ul>
        {messages.map((message) => (
          <MsgItem key={message.id} {...message} />
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
