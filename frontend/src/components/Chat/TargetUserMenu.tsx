/* eslint-disable @next/next/no-img-element */
"use client";

import axios from "axios";
import styles from "../../styles/Chat/TargetUserMenu.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/GlobalRedux/store";

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
  const [friendship, setFrienship] = useState<boolean>(false);
  const route = useRouter();
  const username = useSelector((state: RootState) => state.user.username);

  async function getFriendship() {
    const userRes = await fetch("http://10.5.0.3:3001/users/me", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const user = await userRes.json();
    const friends = await axios.get("http://10.5.0.3:3001/users/friends", {
      params: { user: user.username },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const isFriend = friends.data.find(
      (friend: any) => friend.username === targetUser
    );
    if (isFriend) {
      console.log("FRIENDS : OUI");
      return true;
    }

    console.log("FRIENDS : ", " NON");
    return false;
  }

  async function getProfileDatas(): Promise<ProfileDatas | undefined> {
    try {
      const res = await axios.get("http://10.5.0.3:3001/profiles", {
        params: { username: targetUser },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const profileDatas = res.data;
      return profileDatas;
    } catch (error) {
      console.error("Error fetching profile datas", error);
      return undefined;
    }
  }

  const handleInvitFriend = async () => {
    try {
      const res = await axios.post(
        "http://10.5.0.3:3001/users/addOrRemoveFriend",
        {
          username: targetUser,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      console.log(res.data);
      const profileDatas = res.data;
      setFrienship(!friendship);
      return profileDatas;
    } catch (error) {
      console.error("Error fetching profile datas", error);
      return undefined;
    }
  };

  async function goToProfile() {
    route.push("/profile/" + targetUser);
  }

  useEffect(() => {
    if (targetUser) {
      getProfileDatas().then((datas) => setProfileDatas(datas));
    }
    getFriendship().then((friendship) => setFrienship(friendship));
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
      <button onClick={goToProfile}>Profile</button>
      {profileDatas.isKickable ? <button>kick</button> : undefined}
      {username === targetUser ? undefined : (
        <>
          <button>Invite in game</button>
          <button onClick={handleInvitFriend}>
            {friendship ? "Remove friend" : "Add friend"}
          </button>
        </>
      )}
    </div>
  );
}
