"use client";

import Header from "@/components/Header";
import styles from "../../styles/page.module.css";

import Chat from "@/components/Chat/Chat";

export default function Game() {
  return (
    <section className={`${styles.page}`}>
      <Header />
      <h1>Friend list</h1>
      <Chat />
    </section>
  );
}
