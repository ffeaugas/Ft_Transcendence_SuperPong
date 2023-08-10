import styles from "@/styles/Achievements/AchievementItem.module.css";

type AchievementItem = {
  title: string;
  description: string;
  picture: string;
};

type AchievementItemProps = {
  achievement: AchievementItem;
};

export default function AchievementItem({ achievement }: AchievementItemProps) {
  return (
    <div className={styles.achievement}>
      <img src={achievement.picture} />
      <h3>{achievement.title}</h3>
      <p>{achievement.description}</p>
    </div>
  );
}
