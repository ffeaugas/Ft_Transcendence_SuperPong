"use client";

import { useState, useEffect } from "react";
import styles from "../../styles/Chat/Chat.module.css";
import MsgList from "./MsgList";
import TargetUserMenu from "./TargetUserMenu";
import MenuSelector from "./MenuSelector";
import Menu from "./Menu";

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

export default function Chat() {
  const [targetUser, setTargetUser] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<MenuType>(
    MenuType.CHANNEL_SELECTOR
  );
  const [activeDiscussion, setActiveDiscussion] = useState<string | undefined>(
    "General"
  );
  const [activeDiscussionType, setActiveDiscussionType] =
    useState<ActiveDiscussionType>(ActiveDiscussionType.CHANNEL);

  function changeMenu(menu: MenuType) {
    setSelectedMenu(menu);
    setActiveDiscussion(activeDiscussion);
    setTargetUser(null);
  }

  function switchChannel(channelName: string): void {
    setActiveDiscussion(channelName);
  }

  function showUserInfos(username: string | null): void {
    setTargetUser(username);
  }

  function closeUserInfos(): void {
    setTargetUser(null);
  }

  if (!activeDiscussion) return <p>...</p>;

  return (
    <div className={`${styles.chat}`}>
      <MenuSelector selectedMenu={selectedMenu} changeMenu={changeMenu} />
      <Menu
        selectedMenu={selectedMenu}
        activeDiscussion={activeDiscussion}
        switchChannel={switchChannel}
        changeMenu={changeMenu}
      />
      <MsgList
        activeDiscussion={activeDiscussion}
        activeDiscussionType={activeDiscussionType}
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
