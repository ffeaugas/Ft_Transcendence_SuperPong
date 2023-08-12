"use client";

import styles from "../../styles/Chat/ChannelList.module.css";
import ChannelItem from "./ChannelItem";

type ChannelItem = {
  id: string;
  channelName: string;
};

type ChannelListProps = {
  channels: ChannelItem[];
  activeChannel: string;
  switchChannel: (channelName: string) => void;
};

export default function ChannelList({
  channels,
  activeChannel,
  switchChannel,
}: ChannelListProps) {
  function isActive(channelName: string): boolean {
    if (channelName === activeChannel) {
      return true;
    }
    return false;
  }

  return (
    <div className={`${styles.channelList}`}>
      <h2>Channels :</h2>
      <ul>
        {channels.map((channel) => (
          <ChannelItem
            key={channel.id}
            {...channel}
            isActive={isActive(channel.channelName) ? true : false}
            switchChannel={switchChannel}
          />
        ))}
      </ul>
    </div>
  );
}
