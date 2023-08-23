import styles from "@/styles/Leaderboard/Leaderboard.module.css";

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
      <h2>{rank}</h2>
      <div>
        <img
          className={`${styles.rounded}`}
          src={`http://10.5.0.3:3001/uploads/avatar/${profile.profilePicture}`}
        />
        <h4>{profile.username}</h4>
      </div>
      <p className={styles.wins}>{profile.winCount}</p>
      <p className={styles.looses}>{profile.loseCount}</p>
      <p className={styles.elo}>{profile.eloMatchMaking}</p>
    </div>
  );
}
