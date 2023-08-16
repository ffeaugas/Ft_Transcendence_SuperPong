"use client";

import Header from "@/components/Header";
import styles from "../../styles/page.module.css";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function Game() {
  let socket;
  const [input, setInput] = useState("");

  function socketInitializer() {
    socket = io("http://10.5.0.3:3001");

    socket.on("connect", () => {
      console.log("connected");
    });
  }

  useEffect(() => socketInitializer(), []);

  return (
    <section className={`${styles.page}`}>
      <Header />
      <h1>GAME</h1>
    </section>
  );
}
