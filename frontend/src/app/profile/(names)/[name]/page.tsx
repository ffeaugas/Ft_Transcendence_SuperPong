"use client";

import Header from "@/components/Header";
import styles from "@/styles/page.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import FriendList from "@/components/FriendList/FriendList";
import GamesHistoric from "@/components/GamesHistoric/GamesHistoric";
import Achievements from "@/components/Achievements/Achievements";
import ProfileEditor from "@/components/ProfileEditor/ProfileEditor";
import { useSelector } from "react-redux";
import { RootState } from "@/app/GlobalRedux/store";

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

export default function Profile({ params }: { params: { name: string } }) {
  const [profileDatas, setProfileDatas] = useState<ProfileDatas | undefined>(
    undefined
  );
  const username = useSelector((state: RootState) => state.user.username);

  async function getProfileDatas(): Promise<ProfileDatas | undefined> {
    try {
      const res = await axios.get(
        `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/profiles`,
        {
          params: { username: params.name },
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

  function isYourProfile(): boolean {
    if (username === params.name) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (username) {
      getProfileDatas().then((datas) => {
        setProfileDatas(datas);
      });
    }
  }, [username]);

  if (!profileDatas) {
    return (
      <section className={`${styles.page}`}>
        <Header />
        <p>...</p>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <Header />
      <h3>Profile </h3>
      <div className={styles.profile}>
        <div className={styles.userInfos}>
          {isYourProfile() ? (
            <ProfileEditor />
          ) : (
            <>
              <h2>{params.name}</h2>
              <img
                className={styles.rounded}
                src={`http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/uploads/avatar/${profileDatas.profilePicture}`}
              />
              <p>"{profileDatas.bio}"</p>
            </>
          )}
          <div className={styles.winslooses}>
            <h4 className={styles.wins}>W : {profileDatas["winCount"]}</h4>
            <h4 className={styles.looses}>L : {profileDatas["loseCount"]}</h4>
            <h4 className={styles.elo}>
              {" "}
              Elo : {profileDatas["eloMatchMaking"]}
            </h4>
          </div>
        </div>
        <div className={styles.stats}>
          <FriendList username={params.name} />
          <GamesHistoric username={params.name} />
          <Achievements username={params.name} />
        </div>
      </div>
    </section>
  );
}
