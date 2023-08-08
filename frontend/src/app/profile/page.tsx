"use client";

import Header from "@/components/Header";
import styles from "../../styles/page.module.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [username, setUsername] = useState("wfwefe");
  const [userPicture, setUserPicture] = useState("");

  async function getUsername() {
    const res = await fetch("http://10.5.0.3:3001/users/me", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const user = await res.json();
    return user["username"];
  }

  async function getUserPicture(user: string) {
    try {
      const res = await axios.get("http://10.5.0.3:3001/users", {
        params: { username: user },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(res.data.url_picture);
      const userPictureUrl = res.data.url_picture;
      return userPictureUrl;
    } catch (error) {
      console.error("Error fetching user picture:", error);
      return null;
    }
  }

  useEffect(() => {
    getUsername().then((user) => {
      setUsername(user);
      getUserPicture(user).then((userPictureUrl) => {
        setUserPicture(userPictureUrl);
      });
    });
  }, []);

  return (
    <section className={`${styles.page}`}>
      <Header />
      <h3>PROFILE </h3>
      <div className={`${styles.profile}`}>
        <div className={`${styles.userInfos}`}>
          <h2>{username}</h2>
          <img className={`${styles.rounded}`} src={`${userPicture}`} />
        </div>
        <div className={`${styles.stats}`}>
          <p>defwregregreghrehrehrgrehrehrehe</p>
        </div>
      </div>
    </section>
  );
}
