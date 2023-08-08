"use client";

import styles from "../../styles/Chat/UserList.module.css";
import UserItem from "./UserItem";

type UserItem = {
  id: string;
  username: string;
  profilePicture: string;
};

type UserListProps = {
  users: UserItem[];
  activeUser: string;
};

export default function UserList({ users, activeUser }: UserListProps) {
  return (
    <div className={`${styles.userList}`}>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <UserItem
            key={user.id}
            user={user}
            isActive={user.username === activeUser ? true : false}
          />
        ))}
      </ul>
    </div>
  );
}
