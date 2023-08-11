"use client";

import { useState, useEffect } from "react";
import styles from "../../styles/Chat/Chat.module.css";
import MsgList from "./MsgList";
import TargetUserMenu from "./TargetUserMenu";
import MenuSelector from "./MenuSelector";
import Menu from "./Menu";

type ChatMsgItem = {
  id: string;
  author: string;
  date: string;
  content: string;
};

type ChannelItem = {
  id: string;
  channelName: string;
};

type UserItem = {
  id: string;
  username: string;
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

type ChatData = {
  messages: ChatMsgItem[];
  channels: ChannelItem[];
  users: UserItem[];
};

export default function Chat() {
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [targetUser, setTargetUser] = useState("joe");
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/api/chatdata")
      .then((res) => res.json())
      .then((chatData) => {
        setChatData(chatData);
        setLoading(false);
      });
  }, []);

  function createChannel(channelInfos: ChannelInfos): void {
    const newChannel = { channelName: channelInfos.channelName };
    //requete pour la db
    //...
    setChatData((chatData: ChatData | null) => {
      if (!chatData) {
        return null;
      }
      return {
        ...chatData,
        channels: [...chatData.channels, newChannel],
      };
    });
  }

  function changeMenu(menuId: number) {
    setSelectedMenu(menuId);
  }

  if (isLoading || !chatData) return <h1>...</h1>;

  return (
    <div className={`${styles.chat}`}>
      <MenuSelector selectedMenu={selectedMenu} changeMenu={changeMenu} />
      <Menu
        channels={chatData.channels}
        users={chatData.users}
        selectedMenu={selectedMenu}
        createChannel={createChannel}
      />
      <MsgList msgArray={chatData.messages} />
      {targetUser ? <TargetUserMenu targetUser={targetUser} /> : undefined}
    </div>
  );
}
