"use client";

import styles from "../../styles/Chat/UserItem.module.css";

enum ActiveDiscussionType {
  PRIV_MSG = "PRIV_MSG",
  CHANNEL = "CHANNEL",
}

type UserItemProps = {
  user: User;
  isActive: boolean;
  switchChannel: (
    discussionName: string,
    discussionType: ActiveDiscussionType
  ) => void;
};

export default function UserItem({
  user,
  isActive,
  switchChannel,
}: UserItemProps) {
  return (
    <div
      className={isActive ? styles.activeUserItem : styles.userItem}
      onClick={() =>
        switchChannel(user.username, ActiveDiscussionType.PRIV_MSG)
      }
    >
      <p>{user.username}</p>
    </div>
  );
}
