"use client";

import styles from "../../styles/Chat/MsgItem.module.css";

type MsgItemProps = {
  author: string;
  date: string;
  content: string;
};

export default function MsgItem({ author, date, content }: MsgItemProps) {
  return (
    <li className={`${styles.msg}`}>
      <div className={`${styles.divInfos}`}>
        <p className={`${styles.author}`}>
          <a data-id={author}>{author}</a>
        </p>
        <p className={`${styles.date}`}>{date}</p>
      </div>
      <p>{content}</p>
    </li>
  );
}
