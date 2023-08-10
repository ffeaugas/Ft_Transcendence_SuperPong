import styles from "@/styles/GamesHistoric/GameHistoricItem.module.css";

type GameHistoricItem = {
  leftPlayer: string;
  rightPlayer: string;
  leftScore: number;
  rightScore: number;
};

type GameHistoricItemProps = {
  username: string;
  game: GameHistoricItem;
};

export default function GameHistoricItem({
  username,
  game,
}: GameHistoricItemProps) {
  function isWinner() {
    if (
      (username === game.leftPlayer && game.leftScore === 5) ||
      (username === game.rightPlayer && game.rightScore === 5)
    )
      return true;
    return false;
  }
  return (
    <div className={styles.gameHistoricItem}>
      {isWinner() ? (
        <h2 className={styles.win}>Win</h2>
      ) : (
        <h2 className={styles.loose}>Loose</h2>
      )}
      <div className={styles.infos}>
        <p>{game.leftPlayer}</p>
        <p>
          <b>{game.leftScore}</b>
        </p>
        <p>
          <b>{game.rightScore}</b>
        </p>
        <p>{game.rightPlayer}</p>
      </div>
    </div>
  );
}
