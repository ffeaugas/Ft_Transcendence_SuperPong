/* eslint-disable @next/next/no-img-element */
"use client";

import styles from "../../styles/Chat/TargetUserMenu.module.css";
import { useEffect, useState } from "react";

type TargetUserMenuProps = {
  targetUser: string;
};

type UserInfos = {
  name: string;
  isKickable: boolean;
  profilePicture: string;
};

export default function TargetUserMenu({ targetUser }: TargetUserMenuProps) {
  const [userInfos, setUserInfos] = useState<UserInfos | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/api/userinfo")
      .then((res) => res.json())
      .then((userInfos) => {
        setUserInfos(userInfos);
        setLoading(false);
      });
  }, []);

  if (isLoading || !userInfos) {
    return;
  }

  return (
    <div className={`${styles.targetUserMenu}`}>
      <div className={`${styles.imgDiv}`}>
        <img
          src={userInfos.profilePicture}
          alt={`${userInfos.name} profile picture`}
        />
      </div>
      <h1>{userInfos.name}</h1>
      <button>Profile</button>
      {userInfos.isKickable ? <button>kick</button> : undefined}
      <button>Invite in game</button>
      <button>Add friend</button>
    </div>
  );
}
