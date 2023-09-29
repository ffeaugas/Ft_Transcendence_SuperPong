"use client";

import axios from "axios";
import styles from "../../styles/Chat/TargetUserMenu.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

enum RelationType {
  FRIEND = "FRIEND",
  BLOCK = "BLOCK",
}

type TargetUserMenuProps = {
  username: string;
  targetUser: string;
  isFriend: boolean;
  isBlocked: boolean;
  closeUserInfos: () => void;
  handleRelationChange: (
    relationType: RelationType,
    targetUsername: string
  ) => void;
};

export default function TargetUserMenu({
  username,
  targetUser,
  isFriend,
  isBlocked,
  closeUserInfos,
  handleRelationChange,
}: TargetUserMenuProps) {
  const route = useRouter();
  const [profileDatas, setProfileDatas] = useState<ProfileDatas | undefined>(
    undefined
  );

  async function getProfileDatas(): Promise<ProfileDatas | undefined> {
    try {
      const res = await axios.get(
        `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/profiles`,
        {
          params: { username: targetUser },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const profileDatas = res.data;
      return profileDatas;
    } catch (error) {
      console.error("Error fetching profile datas", error);
      return undefined;
    }
  }

  async function goToProfile() {
    route.push("/profile/" + targetUser);
  }

  async function goToGame() {
    const data = {
      receiver: targetUser,
      roomId: Math.round(Math.random() * 1000000),
    };
    try {
      const res = await fetch(
        `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/inviteingame`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(data),
        }
      );
    } catch (error) {
      console.log(error);
    }
    route.push("/game/" + data.roomId);
  }

  useEffect(() => {
    if (targetUser) {
      getProfileDatas().then((datas) => setProfileDatas(datas));
    }
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
          src={`http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/uploads/avatar/${profileDatas["profilePicture"]}`}
          alt={`${targetUser} profile picture`}
        />
      </div>
      <h1>{targetUser}</h1>
      <button onClick={goToProfile}>Profile</button>
      {username === targetUser ? undefined : (
        <>
          <button onClick={goToGame}>Invite in game</button>
          <button
            onClick={() =>
              handleRelationChange(RelationType.FRIEND, targetUser)
            }
          >
            {isFriend ? "Remove friend" : "Add friend"}
          </button>
          <button
            onClick={() => handleRelationChange(RelationType.BLOCK, targetUser)}
          >
            {isBlocked ? "Deblock" : "Block"}
          </button>
        </>
      )}
    </div>
  );
}
