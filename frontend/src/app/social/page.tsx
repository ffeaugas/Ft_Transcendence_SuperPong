"use client";

import Header from "@/components/Header";
import styles from "../../styles/page.module.css";

import Chat from "@/components/Chat/Chat";
import { useEffect, useState } from "react";

export default function Social() {
  const [auth, setAuth] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuth(localStorage?.getItem("Authenticate") === "true" ? true : false);
    }
  }, []);

  return (
    <section className={`${styles.page}`}>
      <Header />
      <h1>Social</h1>
      {auth ? <Chat /> : <h4>Your are not authenticated</h4>}
    </section>
  );
}
