/* eslint-disable @next/next/no-img-element */
"use client";

import styles from "../../styles/Chat/UserItem.module.css";

type UserItem = {
  id: string;
  username: string;
  profilePicture: string;
};

type UserItemProps = {
  user: UserItem;
  isActive: boolean;
};

export default function UserItem({ user, isActive }: UserItemProps) {
  function handleUserChannelSelect(username: string) {
    console.log(username);
  }

  if (isActive) {
    return (
      <div className={`${styles.userItem} ${styles.isActive}`}>
        <div className={`${styles.imgDiv}`}>
          <img
            src={user.profilePicture}
            alt={`${user.username} profile picture`}
          />
        </div>
        <p>{user.username}</p>
      </div>
    );
  }

  return (
    <div
      onClick={() => handleUserChannelSelect(user.username)}
      className={`${styles.userItem}`}
    >
      <div className={`${styles.imgDiv}`}>
        <img
          src={user.profilePicture}
          alt={`${user.username} profile picture`}
        />
      </div>
      <p>{user.username}</p>
    </div>
  );
}
