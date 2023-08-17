import styles from "@/styles/Achievements/Achievements.module.css";
import AchievementItem from "./AchievementItem";
import { useEffect, useState } from "react";

type AchievementsProps = {
  username: string;
};

type Achievement = {
  id: number;
  title: string;
  description: string;
  picture: string;
};

export default function Achievements({ username }: AchievementsProps) {
  const [achievements, setAchievements] = useState<Achievement[] | undefined>(
    undefined
  );

  async function getAchievements(): Promise<Achievement[] | undefined> {
    const res = await fetch("http://10.5.0.3:3001/achievement/all");
    if (!res.ok) {
      console.log(res);
      throw new Error("Failed fetching achievements");
    }
    const response = await res.json();
    return response;
  }

  useEffect(() => {
    getAchievements().then((achievements) => setAchievements(achievements));
  }, []);

  if (!achievements) {
    return <p>...</p>;
  }

  return (
    <div className={styles.achievements}>
      <h3>{username}'s achievements :</h3>
      <ul>
        {achievements.map((achievement) => (
          <AchievementItem
            key={achievement.id}
            achievement={achievement}
            isPageDisplay={false}
          />
        ))}
      </ul>
    </div>
  );
}
