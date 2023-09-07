"use client";

import Header from "@/components/Header";
import ProfileEditor from "@/components/ProfileEditor/ProfileEditor";
import styles from "../../styles/page.module.css";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../GlobalRedux/store";

export default function Profile() {
  const username = useSelector((state: RootState) => state.user.username);
  const link = "/profile/" + username;

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
