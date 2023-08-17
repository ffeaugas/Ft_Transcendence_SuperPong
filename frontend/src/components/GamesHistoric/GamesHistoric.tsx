import styles from "@/styles/GamesHistoric/GamesHistoric.module.css";
import GameHistoricItem from "./GameHistoricItem";

type GamesHistoricProps = {
  username: string;
};

type GameHistoricItem = {
  id: number;
  leftPlayer: string;
  rightPlayer: string;
  leftScore: number;
  rightScore: number;
};

export default function GamesHistoric({ username }: GamesHistoricProps) {
  const games: GameHistoricItem[] = [
    {
      id: 1,
      leftPlayer: "ffeaugas",
      rightPlayer: "Roger",
      leftScore: 5,
      rightScore: 1,
    },
    {
      id: 2,
      leftPlayer: "Roger",
      rightPlayer: "ffeaugas",
      leftScore: 2,
      rightScore: 5,
    },
    {
      id: 3,
      leftPlayer: "ffeaugas",
      rightPlayer: "Roger",
      leftScore: 0,
      rightScore: 5,
    },
    {
      id: 4,
      leftPlayer: "ffeaugas",
      rightPlayer: "Roger",
      leftScore: 0,
      rightScore: 5,
    },
    {
      id: 5,
      leftPlayer: "Bob",
      rightPlayer: "ffeaugas",
      leftScore: 1,
      rightScore: 5,
    },
    {
      id: 6,
      leftPlayer: "ffeaugas",
      rightPlayer: "Roger",
      leftScore: 0,
      rightScore: 5,
    },
  ];
  return (
    <div className={styles.gamesHistoric}>
      <h3>{username}'s game historic :</h3>
      <ul>
        {games.map((game) => (
          <GameHistoricItem key={game.id} username={username} game={game} />
        ))}
      </ul>
    </div>
  );
}
