"use client";

import styles from "../../styles/Chat/Menu.module.css";
import ChannelList from "./ChannelList";
import CreateChannel from "./CreateChannel";
import UserList from "./UserList";

type ChannelItem = {
  id: string;
  channelName: string;
};

type UserItem = {
  id: string;
  username: string;
  profilePicture: string;
};

enum ChannelMode {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
  PROTECTED = "PROTECTED",
}

type ChannelInfos = {
  channelName: string;
  password?: string;
  mode: ChannelMode;
};

type MenuProps = {
  channels: ChannelItem[];
  users: UserItem[];
  selectedMenu: number;
  createChannel: (channelInfos: ChannelInfos) => void;
};

export default function Menu({
  channels,
  users,
  selectedMenu,
  createChannel,
}: MenuProps) {
  switch (selectedMenu) {
    case 0:
      return (
        <div className={`${styles.menu}`}>
          <ChannelList channels={channels} />
        </div>
      );
    case 1:
      return (
        <div className={`${styles.menu}`}>
          <UserList users={users} activeUser={activeUser} />
        </div>
      );
    case 2:
      return (
        <div className={`${styles.menu}`}>
          <CreateChannel createChannel={createChannel} />
        </div>
      );
  }
  return <div className={`${styles.menu}`}></div>;
}
