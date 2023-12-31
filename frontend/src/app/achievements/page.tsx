import styles from "@/styles/page.module.css";
import Header from "@/components/Header";
import AchievementItem from "@/components/Achievements/AchievementItem";

type Achievement = {
    id: number;
    title: string;
    description: string;
    picture: string;
};

export default async function Achievements() {
    const achievements: Achievement[] | undefined = await getAchievements();

    async function getAchievements(): Promise<Achievement[] | undefined> {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/achievement/all`,
            {
                cache: "no-store",
            }
        );
        if (!res.ok) {
            throw new Error("Failed fetching achievements");
        }
        const response = await res.json();
        return response;
    }

    if (!achievements) {
        return <p>...</p>;
    }

    return (
        <section className={styles.page}>
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
