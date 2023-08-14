/* eslint-disable @next/next/no-img-element */
"use client";

import axios from "axios";
import styles from "../../styles/Chat/TargetUserMenu.module.css";
import { useEffect, useState } from "react";

type ProfileDatas = {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  bio: string;
  winCount?: number;
  loseCount?: number;
  profilePicture?: string;
  eloMatchMaking?: number;
  userId: number;
};

type TargetUserMenuProps = {
  targetUser: string;
  closeUserInfos: () => void;
};

export default function TargetUserMenu({
  targetUser,
  closeUserInfos,
}: TargetUserMenuProps) {
  const [profileDatas, setProfileDatas] = useState<ProfileDatas | undefined>(
    undefined
  );

  async function getProfileDatas(): Promise<ProfileDatas | undefined> {
    try {
      const res = await axios.get("http://10.5.0.3:3001/profiles", {
        params: { username: targetUser },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(res.data);
      const profileDatas = res.data;
      return profileDatas;
    } catch (error) {
      console.error("Error fetching profile datas", error);
      return undefined;
    }
  }

  useEffect(() => {
    if (targetUser) {
      getProfileDatas().then((datas) => setProfileDatas(datas));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUser]);

  if (!profileDatas) {
    return <>...</>;
  }

  return (
    <div className={styles.targetUserMenu}>
      <div className={styles.closeTargetUserMenu}>
        <p onClick={closeUserInfos}>X</p>
      </div>
      <div className={styles.imgDiv}>
        <img
          src={`http://10.5.0.3:3001/uploads/avatar/${profileDatas["profilePicture"]}`}
          alt={`${targetUser} profile picture`}
        />
      </div>
      <h1>{targetUser}</h1>
      <button>Profile</button>
      {/* {profileDatas.isKickable ? <button>kick</button> : undefined} */}
      <button>Invite in game</button>
      <button>Add friend</button>
    </div>
  );
}
