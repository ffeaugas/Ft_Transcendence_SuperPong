"use client";

import styles from "../../styles/Chat/UserItem.module.css";
import { useSelector } from "react-redux";
import { RootState } from "@/app/GlobalRedux/store";

enum UserStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

type UserItemProps = {
  user: User;
  isActive: boolean;
  switchChannel: (discussionName: string) => void;
};

export default function UserItem({
  user,
  isActive,
  switchChannel,
}: UserItemProps) {
  const username = useSelector((state: RootState) => state.user.username);

  if (username === user.username) return undefined;

  return (
    <div
      className={isActive ? styles.activeUserItem : styles.userItem}
      onClick={() => switchChannel(user.username)}
    >
      <p>
        {user.username}
        <b
          className={
            user.status === UserStatus.ONLINE ? styles.online : undefined
          }
        >
          &nbsp;&#8226;
        </b>
      </p>
    </div>
  );
}
