"use client";

import Header from "@/components/Header";
import styles from "../../styles/page.module.css";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../GlobalRedux/store";
import { useEffect, useState } from "react";

export default function Profile() {
  const [link, setLink] = useState<string>("");
  const username = useSelector((state: RootState) => state.user.username);

  useEffect(() => {
    setLink("/profile/" + username);
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
