"use client";

import Header from "@/components/Header";
import styles from "../../styles/page.module.css";

// export default function Game() {
//   return (
//     <section className={`${styles.page}`}>
//       <Header />
//       <h1>GAME</h1>
//     </section>
//   );
// }

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
  () => import("@/components/game/index"),
  {
    ssr: false,
  }
);

const Game = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
  }, []);

  //   const auth = localStorage.getItem("Authenticate") === "true";
  return (
    <section className={`${styles.page}`}>
      <Header />
      <h1>GAME</h1>
      <div key={Math.random()} id="game"></div>
      {loading /*&& auth*/ ? <DynamicComponentWithNoSSR /> : null}
    </section>
  );
};

export default Game;
