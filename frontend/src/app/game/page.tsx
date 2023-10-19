"use client";

import Header from "@/components/Header";
import styles from "../../styles/page.module.css";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getCookie } from "cookies-next";

const DynamicComponentWithNoSSR = dynamic(
  () => import("@/components/game/index"),
  {
    ssr: false,
  }
);

const Game = () => {
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuth(localStorage?.getItem("Authenticate") === "true" ? true : false);
    }
  }, []);

  return (
    <section className={`${styles.page}`}>
      <Header />
      <h1>GAME</h1>
      <div key={Math.random()} id="game"></div>
      {loading && auth ? (
        <DynamicComponentWithNoSSR />
      ) : (
        <h4>Your are not authenticated</h4>
      )}
    </section>
  );
};

export default Game;
