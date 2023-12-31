"use client";

import styles from "../../styles/Chat/MsgItem.module.css";

type MsgItemProps = {
  message: Message;
  showUserInfos: (username: string | null) => void;
};

const regex = /:\d{2}.\d{3}Z/g; //Format Date

export default function MsgItem({ message, showUserInfos }: MsgItemProps) {
  return (
    <li className={styles.msg}>
      <div className={styles.divInfos}>
        <p
          className={styles.author}
          onClick={() => showUserInfos(message.sender.username)}
        >
          <a data-id={message.sender.username}>{message.sender.username} </a>
        </p>
        <p className={styles.date}>
          {message.createdAt.toString().replace("T", " ").replace(regex, "")}
        </p>
      </div>
      <p>{message.content}</p>
    </li>
  );
}
