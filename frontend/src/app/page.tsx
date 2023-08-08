import type { Metadata } from "next";
import styles from "../styles/page.module.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
    title: "Home",
};

export default function Home() {
    return (
        <section className={`${styles.page}`}>
            <Header />
            <h1>Home</h1>
        </section>
    );
}
