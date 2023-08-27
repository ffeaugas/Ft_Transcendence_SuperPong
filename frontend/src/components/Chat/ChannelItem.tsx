"use client";

import axios from "axios";
import styles from "../../styles/Chat/ChannelItem.module.css";
import { useEffect, useState } from "react";

enum ChannelType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  PROTECTED = "PROTECTED",
}

type ChannelItemProps = {
  channelName: string;
  channelType: ChannelType;
  isActive: boolean;
  switchChannel: (discussionName: string) => void;
};

export default function ChannelItem({
  channelName,
  channelType,
  isActive,
  switchChannel,
}: ChannelItemProps) {
  const [feedbackMessage, setFeedbackMessage] = useState<String | undefined>(
    undefined
  );
  async function tryJoinChannel(channelName: string) {
    if (channelType === ChannelType.PUBLIC) switchChannel(channelName);
    else {
      try {
        const res = await axios.patch(
          "http://10.5.0.3:3001/channels/get-authorization",
          {
            channelName: channelName,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        console.log(res);
        if (res.data) switchChannel(channelName);
        else setFeedbackMessage("Can't join channel");
      } catch (e) {
        console.log("JOINING CHANNEL FAILED", e);
      }
    }
  }

  useEffect(() => {
    if (feedbackMessage) {
      setTimeout(() => {
        setFeedbackMessage(undefined);
      }, 3000);
    }
  }, [feedbackMessage]);

  return (
    <div
      className={isActive ? styles.activeChannelItem : styles.channelItem}
      onClick={() => tryJoinChannel(channelName)}
    >
      <p>{channelName}</p>
      {feedbackMessage ? (
        <p className={styles.feedbackMessage}>{feedbackMessage}</p>
      ) : undefined}
    </div>
  );
}
