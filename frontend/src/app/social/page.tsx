"use client";

import Header from "@/components/Header";
import styles from "../../styles/page.module.css";

import Chat from "@/components/Chat/Chat";

export default function Game() {
  let auth = false;
  if (typeof window !== "undefined") {
    auth = localStorage?.getItem("Authenticate") === "true" ? true : false;
  }
  return (
    <section className={`${styles.page}`}>
      <Header />
      <h1>Social</h1>
      {auth ? <Chat /> : <p>Your are not Auth</p>}
    </section>
  );
}
