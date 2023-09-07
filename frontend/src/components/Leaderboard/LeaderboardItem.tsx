import styles from "@/styles/Leaderboard/LeaderboardItem.module.css";
import Link from "next/link";

type Profile = {
    id: number;
    profilePicture: string;
    eloMatchMaking: number;
    winCount: number;
    loseCount: number;
    username: string;
};

type LeaderboardItemProps = {
    rank: number;
    profile: Profile;
};

export default function LeaderboardItem({
    rank,
    profile,
}: LeaderboardItemProps) {
    return (
        <div className={styles.leaderboardItem}>
            <div className={styles.rank}>
                <h3>{rank}</h3>
            </div>
            <div className={styles.player}>
                <img
                    className={`${styles.rounded}`}
                    src={`http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/uploads/avatar/${profile.profilePicture}`}
                />
                <Link href={`/profile/${profile.username}`}>
                    {profile.username}
                </Link>
            </div>
            <div className={styles.wins}>
                <h3>{profile.winCount}</h3>
            </div>
            <div className={styles.looses}>
                <h3>{profile.loseCount}</h3>
            </div>
            <div className={styles.elo}>
                <h3>{profile.eloMatchMaking}</h3>
            </div>
        </div>
    );
}
