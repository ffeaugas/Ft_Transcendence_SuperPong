"use client";

import styles from "../../styles/Chat/ChannelItem.module.css";

type ChannelItemProps = {
  channelName: string;
  isActive: boolean;
  switchChannel: (channelName: string) => void;
};

export default function ChannelItem({
  channelName,
  isActive,
  switchChannel,
}: ChannelItemProps) {
  return (
    <div
      className={isActive ? styles.activeChannelItem : styles.channelItem}
      onClick={() => switchChannel(channelName)}
    >
      <p>{channelName}</p>
    </div>
  );
}
