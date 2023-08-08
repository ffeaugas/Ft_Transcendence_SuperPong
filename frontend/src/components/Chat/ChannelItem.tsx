"use client";

import styles from "../../styles/Chat/ChannelItem.module.css";

type ChannelItemProps = {
  channelName: string;
};

export default function ChannelItem({ channelName }: ChannelItemProps) {
  return (
    <div className={`${styles.channelItem}`}>
      <p>{channelName}</p>
    </div>
  );
}
