"use client";

import styles from "../../styles/Chat/ChannelList.module.css";
import ChannelItem from "./ChannelItem";

type ChannelItem = {
  id: string;
  channelName: string;
};

type ChannelListProps = {
  channels: ChannelItem[];
  addChannel: () => void;
};

export default function ChannelList({
  channels,
  addChannel,
}: ChannelListProps) {
  return (
    <div className={`${styles.channelList}`}>
      <h2>Channels :</h2>
      <ul>
        {channels.map((channel) => (
          <ChannelItem key={channel.id} {...channel} />
        ))}
      </ul>
    </div>
  );
}
