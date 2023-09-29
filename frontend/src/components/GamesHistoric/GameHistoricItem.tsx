import styles from "@/styles/GamesHistoric/GameHistoricItem.module.css";

type GameHistoricItem = {
  winner: { username: string };
  looser: { username: string };
  winnerScore: number;
  looserScore: number;
};

type GameHistoricItemProps = {
  username: string;
  game: GameHistoricItem;
};

export default function GameHistoricItem({
  username,
  game,
}: GameHistoricItemProps) {
  return (
    <div className={styles.gameHistoricItem}>
      {username === game.winner.username && <h2 className={styles.win}>Win</h2>}
      {username === game.looser.username && (
        <h2 className={styles.loose}>Loose</h2>
      )}
      <div className={styles.infos}>
        <p>{game.winner.username}</p>
        <p>
          <b>{game.winnerScore}</b>
        </p>
        <p>
          <b>{game.looserScore}</b>
        </p>
        <p>{game.looser.username}</p>
      </div>
    </div>
  );
}
