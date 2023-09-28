import styles from "@/styles/page.module.css";
import Header from "@/components/Header";
import LeaderboardItem from "@/components/Leaderboard/LeaderboardItem";

type Profile = {
    id: number;
    profilePicture: string;
    eloMatchMaking: number;
    winCount: number;
    loseCount: number;
    username: string;
};

export default async function Leaderboard() {
    const profiles: Profile[] | undefined = await getProfiles();

    async function getProfiles(): Promise<Profile[] | undefined> {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/leaderboard/all`,
            {
                cache: "no-store",
            }
        );
        if (!res.ok) {
            throw new Error("Failed fetching profiles");
        }
        const profiles = res.json();
        return profiles;
    }

    if (!profiles) {
        return <p>...</p>;
    }

    const sortedProfiles = [...profiles];
    sortedProfiles.sort((a, b) => b.eloMatchMaking - a.eloMatchMaking);

    return (
        <section className={styles.page}>
            <Header />
            <h1>Leaderboard</h1>
            <div className={styles.leaderboard}>
                <div className={styles.titles}>
                    <div className={styles.rankTitle}>
                        <h2>Rank</h2>
                    </div>
                    <div className={styles.playerTitle}>
                        <h2>Player</h2>
                    </div>
                    <div className={styles.winsTitle}>
                        <h2>Wins</h2>
                    </div>
                    <div className={styles.loosesTitle}>
                        <h2>Looses</h2>
                    </div>
                    <div className={styles.eloTitle}>
                        <h2>Elo</h2>
                    </div>
                </div>
                <ul>
                    {sortedProfiles.map((profile, index) => (
                        <LeaderboardItem
                            rank={index + 1}
                            key={profile.id}
                            profile={profile}
                        />
                    ))}
                </ul>
            </div>
        </section>
    );
}
