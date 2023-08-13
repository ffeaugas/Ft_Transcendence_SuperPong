"use client";

import { useState } from "react";
import styles from "../../styles/Chat/ChannelList.module.css";
import ChannelItem from "./ChannelItem";

enum ChannelMode {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
  PROTECTED = "PROTECTED",
}

type ChannelItem = {
  id: string;
  channelName: string;
};

type ChannelListProps = {
  channels: ChannelItem[];
  activeChannel: string;
  switchChannel: (channelName: string) => void;
};

type ChannelDisplay = {
  publicChannels: boolean;
  privateChannels: boolean;
  protectedChannels: boolean;
};

export default function ChannelList({
  channels,
  activeChannel,
  switchChannel,
}: ChannelListProps) {
  const [channelDisplay, setChannelDisplay] = useState<ChannelDisplay>({
    publicChannels: true,
    privateChannels: false,
    protectedChannels: false,
  });

  function toggleChannelDisplay(channelMode: keyof ChannelDisplay): void {
    setChannelDisplay((prevState) => ({
      ...prevState,
      [channelMode]: !prevState[channelMode],
    }));
  }

  function isActive(channelName: string): boolean {
    if (channelName === activeChannel) {
      return true;
    }
    return false;
  }

  return (
    <div className={`${styles.channelList}`}>
      <h2>Channels :</h2>
      <div
        className={
          channelDisplay.publicChannels ? styles.displayedChannels : undefined
        }
        onClick={() => {
          toggleChannelDisplay("publicChannels");
        }}
      >
        <h4>Public :</h4>
        <s></s>
      </div>
      {channelDisplay.publicChannels ? (
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
      ) : undefined}
      <div
        className={
          channelDisplay.privateChannels ? styles.displayedChannels : undefined
        }
        onClick={() => {
          toggleChannelDisplay("privateChannels");
        }}
      >
        <h4>Private :</h4>
      </div>
      <div
        className={
          channelDisplay.protectedChannels
            ? styles.displayedChannels
            : undefined
        }
        onClick={() => {
          toggleChannelDisplay("protectedChannels");
        }}
      >
        <h4>Protected :</h4>
      </div>
    </div>
  );
}
