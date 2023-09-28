/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/Chat/Chat.module.css";
import MsgList from "./MsgList";
import TargetUserMenu from "./TargetUserMenu";
import MenuSelector from "./MenuSelector";
import Menu from "./Menu";
import {
  acceptFriendRequest,
  addMessage,
  getChannels,
  getFriendRequests,
  getGameRequests,
  getMessages,
  getUserInfos,
  isBlocked,
  rejectFriendRequest,
  rejectGameRequest,
  removeBlockedMessages,
} from "./actions";
import { Socket, io } from "socket.io-client";
import Toast from "./Toast";
import { json } from "stream/consumers";

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
  const [user, setUser] = useState<User | undefined>(undefined);
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<Channels>();
  const [targetUser, setTargetUser] = useState<string | null>(null);
  const [gameRequests, setGameRequests] = useState<Toast[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
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
    setTargetUser(null);
  }

  function switchChannel(
    discussionName: string,
    discussionType: ActiveDiscussionType
  ): void {
    setActiveDiscussion(discussionName);
    setActiveDiscussionType(discussionType);
  }

  function showUserInfos(username: string | null): void {
    setTargetUser(username);
  }

  function closeUserInfos() {
    setTargetUser(null);
  }

  function deleteGameInvitation(senderUsername: string) {
    rejectGameRequest(senderUsername);
    setTimeout(() => {
      getGameRequests().then((request) => setGameRequests(request));
    }, 150);
  }

  function deleteFriendInvitation(senderId: string) {
    rejectFriendRequest(senderId);
    setTimeout(() => {
      getFriendRequests().then((request) => setFriendRequests(request));
    }, 150);
  }

  function acceptFriendInvitation(senderId: string) {
    acceptFriendRequest(senderId);
    setTimeout(() => {
      getFriendRequests().then((request) => setFriendRequests(request));
    }, 150);
  }

  function handleGameInvitation() {
    getGameRequests().then((request) => {
      setGameRequests(request);
    });
  }

  //---------------------------------------------------------------------------
  // SOCKET ACTIONS   ---------------------------------------------------------
  //---------------------------------------------------------------------------

  async function socketInitializer(): Promise<any> {
    const socket = io(`http://${process.env.NEXT_PUBLIC_DOMAIN}:3001`);

    socket?.on("connect", () => {
      console.log("connected");
    });
    setSocket(socket);
  }

  function sendMessage(data: string) {
    socket?.emit("NEW_MESSAGE", data);
  }

  useEffect(() => {
    socketInitializer();
  }, [setSocket]);

  function submitNewMessage(textInput: string) {
    addMessage(textInput, activeDiscussionType, activeDiscussion);
    sendMessage(textInput);
  }

  function listenFriendInvitation() {
    getFriendRequests().then((request) => setFriendRequests(request));
  }

  function updateChannelList() {
    getChannels().then((channels) => setChannels(channels));
  }

  function activeChannelReset(channelName: string) {
    if (
      channelName === activeDiscussion &&
      activeDiscussionType === ActiveDiscussionType.CHANNEL
    )
      setActiveDiscussion("General");
  }

  //Redirect yourself on general if you where on a channel where you were just kicked
  function kickedFromChannel(channelName: string, kickedUser: string) {
    if (
      activeDiscussionType === ActiveDiscussionType.CHANNEL &&
      activeDiscussion === channelName &&
      kickedUser === user?.username
    )
      setActiveDiscussion("General");
  }

  function messageListner(message: Message) {
    getMessages(activeDiscussionType, activeDiscussion).then((messages) => {
      setMessages(messages);
    });
    return;
  }

  useEffect((): any => {
    socket?.on("NEW_MESSAGE", messageListner);
    socket?.on("CHANNEL_DELETE", activeChannelReset);
    socket?.on("CHANNEL_UPDATE", updateChannelList);
    socket?.on("KICKED_FROM_CHANNEL", kickedFromChannel);
    socket?.on("GAME_INVITATION", handleGameInvitation);
    socket?.on("FRIEND_INVITATION", listenFriendInvitation);

    return () => {
      socket?.off("NEW_MESSAGE", messageListner);
      socket?.off("CHANNEL_DELETE", activeChannelReset);
      socket?.off("CHANNEL_UPDATE", updateChannelList);
      socket?.off("KICKED_FROM_CHANNEL", kickedFromChannel);
      socket?.off("GAME_INVITATION", handleGameInvitation);
      socket?.off("FRIEND_INVITATION", listenFriendInvitation);
    };
  }, [messageListner]);

  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------

  useEffect(() => {
    getUserInfos().then((infos) => setUser(infos));
    getGameRequests().then((request) => setGameRequests(request));
    getFriendRequests().then((request) => setFriendRequests(request));
  }, []);

  useEffect(() => {
    getChannels().then((channels) => setChannels(channels));
  }, [selectedMenu]);

  useEffect(() => {
    getMessages(activeDiscussionType, activeDiscussion).then((messages) => {
      setMessages(messages);
    });
  }, [activeDiscussion]);

  if (!user) return <p>...</p>;

  return (
    <>
      <Toast
        gameRequests={gameRequests}
        friendRequests={friendRequests}
        deleteGameInvitation={deleteGameInvitation}
        deleteFriendInvitation={deleteFriendInvitation}
        acceptFriendInvitation={acceptFriendInvitation}
      />
      <div className={`${styles.chat}`}>
        <MenuSelector selectedMenu={selectedMenu} changeMenu={changeMenu} />
        <Menu
          selectedMenu={selectedMenu}
          activeDiscussionType={activeDiscussionType}
          activeDiscussion={activeDiscussion}
          channels={channels}
          switchChannel={switchChannel}
          changeMenu={changeMenu}
        />
        <MsgList
          activeDiscussion={activeDiscussion}
          activeDiscussionType={activeDiscussionType}
          showUserInfos={showUserInfos}
          submitNewMessage={submitNewMessage}
          messages={removeBlockedMessages(messages, user.blockedUsers)}
        />
        {targetUser ? (
          <TargetUserMenu
            targetUser={targetUser}
            closeUserInfos={closeUserInfos}
          />
        ) : undefined}
      </div>
    </>
  );
}
