"use client";

import { useState, useEffect } from "react";
import styles from "../../styles/Chat/Chat.module.css";
import MsgList from "./MsgList";
import TargetUserMenu from "./TargetUserMenu";
import MenuSelector from "./MenuSelector";
import Menu from "./Menu";
import axios from "axios";

type Message = {
  id: number;
  createdAt: string;
  updatedAt: string;
  content: string;
  senderId: number;
  channelId: number;
};

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
  const [targetUser, setTargetUser] = useState("joe");
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [activeChannel, setActiveChannel] = useState<string>("General");
  const [activeChannelOption, setActiveChannelOption] =
    useState<ActiveChannelOption>(ActiveChannelOption.CHANNEL);

  function changeMenu(menuId: number) {
    setSelectedMenu(menuId);
  }

  function switchChannel(channelName: string): void {
    setActiveChannel(channelName);
    console.log("SWITCHING CHANNEL TO :", channelName);
  }

  return (
    <div className={`${styles.chat}`}>
      <MenuSelector selectedMenu={selectedMenu} changeMenu={changeMenu} />
      <Menu
        selectedMenu={selectedMenu}
        activeChannel={activeChannel}
        switchChannel={switchChannel}
      />
      <MsgList
        activeChannel={activeChannel}
        activeChannelOption={activeChannelOption}
      />
      {targetUser ? <TargetUserMenu targetUser={targetUser} /> : undefined}
    </div>
  );
}
