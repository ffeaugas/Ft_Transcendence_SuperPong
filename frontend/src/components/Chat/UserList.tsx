"use client";

import styles from "../../styles/Chat/UserList.module.css";
import UserItem from "./UserItem";

enum UserStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

type UserListProps = {
  users: User[] | undefined;
  activeDiscussion: string | undefined;
  switchChannel: (discussionName: string) => void;
};

export default function UserList({
  users,
  activeDiscussion,
  switchChannel,
}: UserListProps) {
  function isActive(channelName: string): boolean {
    if (channelName === activeDiscussion) {
      return true;
    }
    return false;
  }

  if (!users) {
    return undefined;
  }

  return (
    <div className={`${styles.userList}`}>
      <h2>User List</h2>
      <br></br>
      <ul>
        {users.map((user) => (
          <UserItem
            key={user.id}
            user={user}
            isActive={isActive(user.username) ? true : false}
            switchChannel={switchChannel}
          />
        ))}
      </ul>
    </div>
  );
}
