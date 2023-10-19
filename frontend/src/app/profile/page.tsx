"use client";

import Header from "@/components/Header";
import styles from "../../styles/page.module.css";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../GlobalRedux/store";
import { useEffect, useState } from "react";

export default function Profile() {
  const [link, setLink] = useState<string>("");

  async function getUsername(): Promise<string | undefined> {
    const res = await fetch(
      `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/me`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (res.ok) {
      const user = await res.json();
      return user["username"];
    }
  }

  useEffect(() => {
    getUsername().then((username) => {
      if (username) {
        setLink("/profile/" + username);
      }
    });
  }, []);

  return (
    <div className={styles.profilePage}>
      <Header />
      <h1>Welcome !</h1>
      <h2>Edit your profile !</h2>
      <div className={styles.customProfilePage}>
        <Link href={link}>Go to profile editor</Link>
      </div>
    </div>
  );
}
