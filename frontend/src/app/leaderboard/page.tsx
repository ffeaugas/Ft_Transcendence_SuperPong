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
    const res = await fetch("http://10.5.0.3:3001/leaderboard/all", {
      cache: "no-store",
    });
    if (!res.ok) {
      console.log(res);
      throw new Error("Failed fetching profiles");
    }
    const profiles = await res.json();
    profiles.sort(function compareElo(a: Profile, b: Profile) {
      return a.eloMatchMaking - b.eloMatchMaking;
    });
    return profiles;
  }

  if (!profiles) {
    return <p>...</p>;
  }

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
          {profiles.map((profile, index) => (
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
