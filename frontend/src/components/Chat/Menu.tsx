"use client";

import { useEffect, useState } from "react";
import styles from "../../styles/Chat/Menu.module.css";
import ChannelList from "./ChannelList";
import CreateChannel from "./CreateChannel";
import UserList from "./UserList";
import axios from "axios";
import AdministrateChannel from "./AdministrateChannel";

type ChannelItem = {
  id: string;
  channelName: string;
};

enum UserStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

enum MenuType {
  CHANNEL_SELECTOR = "CHANNEL_SELECTOR",
  USER_SELECTOR = "USER_SELECTOR",
  CHANNEL_CREATION = "CHANNEL_CREATION",
  CHANNEL_ADMINISTRATION = "CHANNEL_ADMINISTRATION",
}

type User = {
  id: string;
  username: string;
  status: UserStatus;
};

type MenuProps = {
  selectedMenu: MenuType;
  activeChannel: string;
  switchChannel: (channelName: string) => void;
  changeMenu: (menu: MenuType) => void;
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
  changeMenu,
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
    if (selectedMenu === MenuType.CHANNEL_SELECTOR) {
      getChannels().then((channels) => setChannels(channels));
    } else if (selectedMenu === MenuType.USER_SELECTOR) {
      getUsers().then((users) => setUsers(users));
    }
  }, [selectedMenu]);

  if (
    (selectedMenu === MenuType.CHANNEL_SELECTOR && !channels) ||
    (selectedMenu === MenuType.USER_SELECTOR && !users)
  ) {
    return <p>channel loading...</p>;
  }

  switch (selectedMenu) {
    case MenuType.CHANNEL_SELECTOR:
      return (
        <div className={`${styles.menu}`}>
          <ChannelList
            channels={channels}
            activeChannel={activeChannel}
            switchChannel={switchChannel}
            changeMenu={changeMenu}
          />
        </div>
      );
    case MenuType.USER_SELECTOR:
      return (
        <div className={`${styles.menu}`}>
          <UserList
            users={users}
            activeChannel={activeChannel}
            switchChannel={switchChannel}
          />
        </div>
      );
    case MenuType.CHANNEL_CREATION:
      return (
        <div className={`${styles.menu}`}>
          <CreateChannel />
        </div>
      );
    case MenuType.CHANNEL_ADMINISTRATION:
      return (
        <div className={`${styles.menu}`}>
          {<AdministrateChannel activeChannel={activeChannel} />}
        </div>
      );
  }
  return <div className={`${styles.menu}`}></div>;
}
