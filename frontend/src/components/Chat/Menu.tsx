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

type MenuProps = {
  channels: ChannelItem[];
  users: UserItem[];
  selectedMenu: number;
  addChannel: () => void;
};

export default function Menu({
  channels,
  users,
  selectedMenu,
  addChannel,
}: MenuProps) {
  switch (selectedMenu) {
    case 0:
      return (
        <div className={`${styles.menu}`}>
          <ChannelList channels={channels} addChannel={addChannel} />
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
          <CreateChannel addChannel={addChannel} />
        </div>
      );
  }
  return <div className={`${styles.menu}`}></div>;
}
