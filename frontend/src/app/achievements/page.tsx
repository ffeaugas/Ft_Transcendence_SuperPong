import styles from "@/styles/page.module.css";
import Header from "@/components/Header";
import AchievementItem from "@/components/Achievements/AchievementItem";
import axios from "axios";
import { useEffect, useState } from "react";

type Achievement = {
  id: number;
  title: string;
  description: string;
  picture: string;
};

async function getAchievements(): Promise<Achievement[] | undefined> {
  const res = await fetch("http://10.5.0.3:3001/achievement/all");
  if (!res.ok) {
    console.log(res);
    throw new Error("Failed fetching achievements");
  }
  const response = await res.json();
  return response;
}

export default async function Achievements() {
  const achievements: Achievement[] | undefined = await getAchievements();

  if (!achievements) {
    return <p>prout</p>;
  }

  return (
    <section className={`${styles.page}`}>
      <Header />
      <h1>Achievements</h1>
      <div className={styles.achievements}>
        <ul>
          {achievements.map((achievement) => (
            <AchievementItem
              key={achievement.id}
              achievement={achievement}
              isPageDisplay={true}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
