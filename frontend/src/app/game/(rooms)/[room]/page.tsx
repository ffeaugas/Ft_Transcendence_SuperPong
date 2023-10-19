"use client";

import Header from "@/components/Header";
import styles from "../../../../styles/page.module.css";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getCookie } from "cookies-next";
import { usePathname } from "next/navigation";

const DynamicComponentWithNoSSR = dynamic(
  () => import("@/components/game/index"),
  {
    ssr: false,
  }
);
const Game = () => {
  const [loading, setLoading] = useState(false);
  const pathname: string | null = usePathname();
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
        <p>Your arent authenticated</p>
      )}
    </section>
  );
};

export default Game;
