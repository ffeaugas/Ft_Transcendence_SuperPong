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

enum UserStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

type User = {
  id: string;
  username: string;
  status: UserStatus;
};

type MenuProps = {
  selectedMenu: number;
  activeChannel: string;
  switchChannel: (channelName: string) => void;
};

type Channels = {
  publics: ChannelItem[];
  privates: ChannelItem[];
  protecteds: ChannelItem[];
};

export default function Menu({
  selectedMenu,
  activeChannel,
  switchChannel,
}: MenuProps) {
  const [channels, setChannels] = useState<Channels>();
  const [users, setUsers] = useState<User[]>();

  async function getChannels(): Promise<Channels | undefined> {
    try {
      const res = await axios.get("http://10.5.0.3:3001/channels/all", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const channels = res.data;
      return channels;
    } catch (error) {
      console.error("Error fetching public channel list", error);
      return undefined;
    }
  }

  async function getUsers(): Promise<User[] | undefined> {
    try {
      const res = await axios.get("http://10.5.0.3:3001/users/all", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const users = res.data;
      return users;
    } catch (error) {
      console.error("Error fetching user list", error);
      return undefined;
    }
  }

  useEffect(() => {
    if (selectedMenu === 0) {
      getChannels().then((channels) => setChannels(channels));
    } else if (selectedMenu === 1) {
      getUsers().then((users) => setUsers(users));
    }
  }, [selectedMenu]);

  if ((selectedMenu === 0 && !channels) || (selectedMenu === 1 && !users)) {
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
          <UserList
            users={users}
            activeChannel={activeChannel}
            switchChannel={switchChannel}
          />
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
