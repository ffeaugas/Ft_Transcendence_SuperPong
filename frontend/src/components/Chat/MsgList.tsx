"use client";

import MsgItem from "./MsgItem";
import styles from "../../styles/Chat/MsgList.module.css";

//---------[TYPES]------------//

type MsgItemProps = {
  id: string;
  author: string;
  date: string;
  content: string;
};

type MsgListProps = {
  msgArray: MsgItemProps[];
};

//---------------------------//

export default function MsgList({ msgArray }: MsgListProps) {
  return (
    <div className={`${styles.msgList}`}>
      <h2>Chat :</h2>
      <ul>
        {msgArray.map((msg) => (
          <MsgItem key={msg.id} {...msg} />
        ))}
      </ul>
      <input type="text" placeholder="Your message"></input>
    </div>
  );
}
