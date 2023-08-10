"use client";

import Header from "@/components/Header";
import styles from "../../styles/page.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import FriendList from "@/components/FriendList/FriendList";
import GamesHistoric from "@/components/GamesHistoric/GamesHistoric";
import Achievements from "@/components/Achievements/Achievements";

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

export default function Profile() {
  const [username, setUsername] = useState<string>("");
  const [profileDatas, setProfileDatas] = useState<ProfileDatas | undefined>(
    undefined
  );

  async function getUsername(): Promise<string> {
    const res = await fetch("http://10.5.0.3:3001/users/me", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const user = await res.json();
    return user["username"];
  }

  async function getProfileDatas(
    username: string
  ): Promise<ProfileDatas | undefined> {
    try {
      const res = await axios.get("http://10.5.0.3:3001/users/profile", {
        params: { username: username },
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
    getUsername().then((username) => {
      setUsername(username);
      getProfileDatas(username).then((datas) => {
        setProfileDatas(datas);
      });
    });
  }, []);

  if (profileDatas === undefined) {
    return (
      <section className={`${styles.page}`}>
        <Header />
        <p>...</p>;
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <Header />
      <h3>PROFILE </h3>
      <div className={styles.profile}>
        <div className={styles.userInfos}>
          <h2>{username}</h2>
          <img
            className={styles.rounded}
            src={profileDatas["profilePicture"]}
          />
          <div className={styles.winslooses}>
            <h4 className={styles.wins}>W : {profileDatas["winCount"]}</h4>
            <h4 className={styles.looses}>L : {profileDatas["loseCount"]}</h4>
            <h4> Elo : {profileDatas["eloMatchMaking"]}</h4>
          </div>
        </div>
        <div className={styles.stats}>
          <FriendList username={username} />
          <GamesHistoric username={username} />
          <Achievements username={username} />
        </div>
      </div>
    </section>
  );
}
