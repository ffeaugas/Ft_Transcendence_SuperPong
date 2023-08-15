"use client";

import { useState, useEffect } from "react";
import styles from "../../styles/Chat/Chat.module.css";
import MsgList from "./MsgList";
import TargetUserMenu from "./TargetUserMenu";
import MenuSelector from "./MenuSelector";
import Menu from "./Menu";

type Message = {
  id: number;
  createdAt: string;
  updatedAt: string;
  content: string;
  senderId: number;
  channelId: number;
};

enum MenuType {
  CHANNEL_SELECTOR = "CHANNEL_SELECTOR",
  USER_SELECTOR = "USER_SELECTOR",
  CHANNEL_CREATION = "CHANNEL_CREATION",
  CHANNEL_ADMINISTRATION = "CHANNEL_ADMINISTRATION",
}

type ChannelItem = {
  id: string;
  channelName: string;
};

type UserItem = {
  id: string;
  username: string;
};

enum ActiveChannelOption {
  PRIV_MSG = "PRIV_MSG",
  CHANNEL = "CHANNEL",
}

export default function Chat() {
  const [targetUser, setTargetUser] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<MenuType>(
    MenuType.CHANNEL_SELECTOR
  );
  const [activeChannel, setActiveChannel] = useState<string>("General");
  const [activeChannelOption, setActiveChannelOption] =
    useState<ActiveChannelOption>(ActiveChannelOption.CHANNEL);

  function changeMenu(menu: MenuType) {
    setSelectedMenu(menu);
  }

  function switchChannel(channelName: string): void {
    setActiveChannel(channelName);
  }

  function showUserInfos(username: string | null): void {
    setTargetUser(username);
  }

  function closeUserInfos(): void {
    setTargetUser(null);
  }

  return (
    <div className={`${styles.chat}`}>
      <MenuSelector selectedMenu={selectedMenu} changeMenu={changeMenu} />
      <Menu
        selectedMenu={selectedMenu}
        activeChannel={activeChannel}
        switchChannel={switchChannel}
        changeMenu={changeMenu}
      />
      <MsgList
        activeChannel={activeChannel}
        activeChannelOption={activeChannelOption}
        showUserInfos={showUserInfos}
      />
      {targetUser ? (
        <TargetUserMenu
          targetUser={targetUser}
          closeUserInfos={closeUserInfos}
        />
      ) : undefined}
    </div>
  );
}
