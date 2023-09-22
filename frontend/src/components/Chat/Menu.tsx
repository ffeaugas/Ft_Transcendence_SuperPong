"use client";

import { useEffect, useState } from "react";
import styles from "../../styles/Chat/Menu.module.css";
import ChannelList from "./ChannelList";
import CreateChannel from "./CreateChannel";
import UserList from "./UserList";
import AdministrateChannel from "./AdministrateChannel";
import { useSelector } from "react-redux";
import { RootState } from "@/app/GlobalRedux/store";
import { getOtherUsers } from "./actions";

enum MenuType {
  CHANNEL_SELECTOR = "CHANNEL_SELECTOR",
  USER_SELECTOR = "USER_SELECTOR",
  CHANNEL_CREATION = "CHANNEL_CREATION",
  CHANNEL_ADMINISTRATION = "CHANNEL_ADMINISTRATION",
}

enum ActiveDiscussionType {
  PRIV_MSG = "PRIV_MSG",
  CHANNEL = "CHANNEL",
}

type MenuProps = {
  selectedMenu: MenuType;
  activeDiscussion: string | undefined;
  activeDiscussionType: ActiveDiscussionType;
  channels: Channels;
  switchChannel: (
    discussionName: string,
    discussionType: ActiveDiscussionType
  ) => void;
  changeMenu: (menu: MenuType) => void;
};

export default function Menu({
  selectedMenu,
  activeDiscussion,
  activeDiscussionType,
  channels,
  switchChannel,
  changeMenu,
}: MenuProps) {
  const [users, setUsers] = useState<User[]>();
  const username = useSelector((state: RootState) => state.user.username);

  useEffect(() => {
    getOtherUsers(username).then((users) => setUsers(users));
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
            activeDiscussionType={activeDiscussionType}
            activeDiscussion={activeDiscussion}
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
            activeDiscussion={activeDiscussion}
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
          {
            <AdministrateChannel
              activeDiscussion={activeDiscussion}
              users={users}
              changeMenu={changeMenu}
              switchChannel={switchChannel}
            />
          }
        </div>
      );
  }
}
