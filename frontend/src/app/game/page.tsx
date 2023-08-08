"use client";

import Header from "@/components/Header";
import styles from "../../styles/page.module.css";

// import type { Metadata } from "next";
import { useState, useEffect } from "react";

export default function Game() {
  // const { data: session, status } = useSession();

  // if (status === "authenticated") {
  return (
    <section className={`${styles.page}`}>
      <Header />
      <h1>GAME</h1>
      {/* <p>{JSON.stringify(session)}</p> */}
    </section>
  );
  // }
  // if (status === "loading") {
  //   return (
  //     <section className={`${styles.alternativePage}`}>
  //       <p>Loading...</p>
  //     </section>
  //   );
  // }
  // return (
  //   <section className={`${styles.alternativePage}`}>
  //     <p>You must be authenticated to access to this page</p>
  //   </section>
  // );
}
