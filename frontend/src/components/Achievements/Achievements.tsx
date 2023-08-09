import styles from "@/styles/Achievements/Achievements.module.css";

type AchievementsProps = {
  username: string;
};

export default function Achievements({ username }: AchievementsProps) {
  return (
    <div className={styles.achievements}>
      <p>{username}'s achievements :</p>
    </div>
  );
}
