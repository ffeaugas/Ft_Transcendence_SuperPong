"use client";

import Header from "@/components/Header";
import styles from "../../styles/page.module.css";
import { useEffect, useState } from "react";

export default function Game() {
    return (
        <section className={`${styles.page}`}>
            <Header />
            <h1>GAME</h1>
        </section>
    );
}
