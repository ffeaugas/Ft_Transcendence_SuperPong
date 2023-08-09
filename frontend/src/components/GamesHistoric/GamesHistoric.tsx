import styles from "@/styles/GamesHistoric/GamesHistoric.module.css";

type GamesHistoricProps = {
  username: string;
};

export default function GamesHistoric({ username }: GamesHistoricProps) {
  return (
    <div className={styles.gamesHistoric}>
      <p>{username}'s games historic : YA PAS ENCORE LES GAMES</p>
    </div>
  );
}
