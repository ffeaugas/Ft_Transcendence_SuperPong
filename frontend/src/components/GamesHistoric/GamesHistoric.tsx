import styles from "@/styles/GamesHistoric/GamesHistoric.module.css";
import { useEffect, useState } from "react";
import GameHistoricItem from "./GameHistoricItem";
import axios from "axios";

type GamesHistoricProps = {
    username: string;
};

type GameHistoricItem = {
    id: number;
    // winner: string;
    // looser: string;
    // leftScore: number;
    // rightScore: number;
};

export default function GamesHistoric({ username }: GamesHistoricProps) {
    const [games, setGames] = useState([]);

    async function getGames(): Promise<any> {
        try {
            const res = await axios.get(
                `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/games`,
                {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            const games = res.data;
            return games;
        } catch (error) {
            console.error("Error fetching games", error);
            return undefined;
        }
    }

    useEffect(() => {
        getGames().then((games) => {
            setGames(games);
            console.log(games);
        });
    }, []);

    return (
        <div className={styles.gamesHistoric}>
            <h3>{username}'s game historic :</h3>
            <ul>
                {games.map((game) => (
                    <GameHistoricItem
                        key={game.id}
                        username={username}
                        game={game}
                    />
                ))}
            </ul>
        </div>
    );
}
