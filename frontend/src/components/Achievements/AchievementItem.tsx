import styles from "@/styles/Achievements/AchievementItem.module.css";

type AchievementItem = {
    title: string;
    description: string;
    picture: string;
};

type AchievementItemProps = {
    achievement: AchievementItem;
    isPageDisplay: boolean;
};

export default function AchievementItem({
    achievement,
    isPageDisplay,
}: AchievementItemProps) {
    return (
        <div
            className={`${styles.achievement} ${
                isPageDisplay ? styles.pageStyle : undefined
            }`}
        >
            <img
                src={`http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/uploads/avatar/${achievement.picture}`}
                alt={`${achievement.title} profile picture`}
            />
            <h3>{achievement.title}</h3>
            <p>{achievement.description}</p>
        </div>
    );
}
