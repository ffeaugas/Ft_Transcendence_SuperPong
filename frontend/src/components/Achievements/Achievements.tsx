import styles from "@/styles/Achievements/Achievements.module.css";
import AchievementItem from "./AchievementItem";

type AchievementsProps = {
  username: string;
};

type AchievementItem = {
  title: string;
  description: string;
  picture: string;
};

export default function Achievements({ username }: AchievementsProps) {
  const achievements = [
    {
      title: "Gros naze",
      description: "Etre un gros gros nullos",
      picture: "sadnessAchievement.png",
    },
    {
      title: "Gros naze",
      description: "Etre un gros gros nullos",
      picture: "sadnessAchievement.png",
    },
    {
      title: "Gros naze",
      description: "Etre un gros gros nullos",
      picture: "sadnessAchievement.png",
    },
    {
      title: "Gros naze",
      description: "Etre un gros gros nullos",
      picture: "sadnessAchievement.png",
    },
    {
      title: "Gros naze",
      description: "Etre un gros gros nullos",
      picture: "sadnessAchievement.png",
    },
    {
      title: "Gros naze",
      description: "Etre un gros gros nullos",
      picture: "sadnessAchievement.png",
    },
    {
      title: "Gros naze",
      description: "Etre un gros gros nullos",
      picture: "sadnessAchievement.png",
    },
    {
      title: "Gros naze",
      description: "Etre un gros gros nullos",
      picture: "sadnessAchievement.png",
    },
    {
      title: "Gros naze",
      description: "Etre un gros gros nullos",
      picture: "sadnessAchievement.png",
    },
  ];

  return (
    <div className={styles.achievements}>
      <h3>{username}'s achievements :</h3>
      <ul>
        {achievements.map((achievement) => (
          <AchievementItem achievement={achievement} />
        ))}
      </ul>
    </div>
  );
}
