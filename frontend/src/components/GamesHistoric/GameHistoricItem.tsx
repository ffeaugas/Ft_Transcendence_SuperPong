import styles from "@/styles/GamesHistoric/GameHistoricItem.module.css";

type GameHistoricItem = {
    winner: string;
    looser: string;
    // leftScore: number;
    // rightScore: number;
};

type GameHistoricItemProps = {
    username: string;
    game: GameHistoricItem;
};

export default function GameHistoricItem({
    username,
    game,
}: GameHistoricItemProps) {
    // function isWinner() {
    //   if (
    //     (username === game.leftPlayer && game.leftScore === 5) ||
    //     (username === game.rightPlayer && game.rightScore === 5)
    //   )
    //     return true;
    //   return false;
    // }
    return (
        <div className={styles.gameHistoricItem}>
            {username === game.winner && <h2 className={styles.win}>Win</h2>}
            {username === game.looser && (
                <h2 className={styles.loose}>Loose</h2>
            )}
            <div className={styles.infos}>
                <p>{game.winner}</p>
                {/* <p>
          <b>{game.leftScore}</b>
        </p>
        <p>
          <b>{game.rightScore}</b>
        </p> */}
                <p>{game.looser}</p>
            </div>
        </div>
    );
}
