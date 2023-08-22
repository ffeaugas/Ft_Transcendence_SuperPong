"use client";

import Header from "@/components/Header";
import ProfileEditor from "@/components/ProfileEditor/ProfileEditor";
import styles from "../../styles/page.module.css";

export default function Profile() {
  return (
    <div className={styles.profilePage}>
      <Header />
      <h1>Welcome !</h1>
      <h2>Edit your profile</h2>
      <div className={styles.customProfilePage}>
        <ProfileEditor />;
      </div>
    </div>
  );
}
