"use client";

import styles from "../../styles/Chat/UserItem.module.css";

enum UserStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

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
