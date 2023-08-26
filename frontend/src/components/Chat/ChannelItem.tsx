"use client";

import styles from "../../styles/Chat/ChannelItem.module.css";

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
  async function tryJoinChannel(channelName: string) {
    if (channelType === ChannelType.PUBLIC) switchChannel(channelName);
    else {
      console.log("PRIVER OU PROTECTED");
      try {
        const canJoinChannel = await fetch(
          "http://10.5.0.3:3001/channel/join",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const user = await canJoinChannel.json();
        if (canJoinChannel) switchChannel(channelName);
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <div
      className={isActive ? styles.activeChannelItem : styles.channelItem}
      onClick={() => tryJoinChannel(channelName)}
    >
      <p>{channelName}</p>
    </div>
  );
}
