"use client";

import styles from "../../styles/Chat/MsgItem.module.css";

type Sender = {
  id: number;
  createdAt: string;
  updatedAt: string;
  role: string;
  username: string;
  status: string;
  user42: boolean;
};

type Message = {
  id: number;
  createdAt: string;
  updatedAt: string;
  content: string;
  senderId: number;
  channelId: number;
  sender: Sender;
};

type MsgItemProps = {
  message: Message;
  showUserInfos: (username: string | null) => void;
};

export default function MsgItem({ message, showUserInfos }: MsgItemProps) {
  return (
    <li className={`${styles.msg}`}>
      <div className={`${styles.divInfos}`}>
        <p
          className={`${styles.author}`}
          onClick={() => showUserInfos(message.sender.username)}
        >
          <a data-id={message.sender.username}>{message.sender.username} </a>
        </p>
        <p className={`${styles.date}`}>{message.createdAt}</p>
      </div>
      <p>{message.content}</p>
    </li>
  );
}
