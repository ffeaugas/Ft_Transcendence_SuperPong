"use client";

import { useEffect, useState } from "react";
import styles from "../../styles/Chat/Menu.module.css";
import ChannelList from "./ChannelList";
import CreateChannel from "./CreateChannel";
import UserList from "./UserList";
import axios from "axios";

type ChannelItem = {
  id: string;
  channelName: string;
};

type UserItem = {
  id: string;
  username: string;
  profilePicture: string;
};

type MenuProps = {
  selectedMenu: number;
  activeChannel: string;
  switchChannel: (channelName: string) => void;
};

export default function Menu({
  selectedMenu,
  activeChannel,
  switchChannel,
}: MenuProps) {
  const [channels, setChannels] = useState<ChannelItem[]>();

  async function getChannels(): Promise<ChannelItem[] | undefined> {
    try {
      const res = await axios.get("http://10.5.0.3:3001/channels/publics", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(res.data);
      const channels = res.data;
      return channels;
    } catch (error) {
      console.error("Error fetching public channel list", error);
      return undefined;
    }
  }

  useEffect(() => {
    if (selectedMenu === 0) {
      getChannels().then((channels) => setChannels(channels));
    }
  }, [selectedMenu]);

  if (channels === undefined) {
    return <p>channel loading...</p>;
  }

  switch (selectedMenu) {
    case 0:
      return (
        <div className={`${styles.menu}`}>
          <ChannelList
            channels={channels}
            activeChannel={activeChannel}
            switchChannel={switchChannel}
          />
        </div>
      );
    case 1:
      return (
        <div className={`${styles.menu}`}>
          <UserList users={users} />
        </div>
      );
    case 2:
      return (
        <div className={`${styles.menu}`}>
          <CreateChannel />
        </div>
      );
  }
  return <div className={`${styles.menu}`}></div>;
}
