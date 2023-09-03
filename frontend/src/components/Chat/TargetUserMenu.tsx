/* eslint-disable @next/next/no-img-element */
"use client";

import axios from "axios";
import styles from "../../styles/Chat/TargetUserMenu.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/GlobalRedux/store";

enum RelationType {
  FRIEND = "FRIEND",
  BLOCK = "BLOCK",
}

type Relation = {
  isFriend: boolean;
  isBlocked: boolean;
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
  const [relationToTarget, setRelationToTarget] = useState<
    Relation | undefined
  >(undefined);
  const route = useRouter();
  const username = useSelector((state: RootState) => state.user.username);

  async function getRelationToTarget(): Promise<Relation | undefined> {
    try {
      const res = await axios.get("http://10.5.0.3:3001/users/relation", {
        params: { username: targetUser },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error fetching relations with target", error);
      return undefined;
    }
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

  const handleRelationChange = async (relationType: RelationType) => {
    try {
      const res = await axios.patch(
        "http://10.5.0.3:3001/users/changeRelation",
        {
          targetUsername: targetUser,
          relationType: relationType,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const profileDatas = res.data;
      setTimeout(() => {
        getRelationToTarget().then((relation) => {
          if (relation) setRelationToTarget(relation);
        });
      }, 300);
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
    getRelationToTarget().then((relation) => {
      if (relation) setRelationToTarget(relation);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUser]);

  if (!profileDatas || !relationToTarget) {
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
      {username === targetUser ? undefined : (
        <>
          <button>Invite in game</button>
          <button onClick={() => handleRelationChange(RelationType.FRIEND)}>
            {relationToTarget.isFriend ? "Remove friend" : "Add friend"}
          </button>
          <button onClick={() => handleRelationChange(RelationType.BLOCK)}>
            {relationToTarget.isBlocked ? "Deblock" : "Block"}
          </button>
        </>
      )}
    </div>
  );
}
