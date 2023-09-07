import styles from "@/styles/FriendList/FriendList.module.css";
import FriendItem from "./FriendItem";
import { useEffect, useState } from "react";
import axios from "axios";

type FriendListProps = {
    username: string;
};

type FriendItem = {
    id: string;
    username: string;
    profile: any;
    status: string;
};

export default function FriendList({ username }: FriendListProps) {
    const [friends, setFriends] = useState<FriendItem[] | undefined>(undefined);

    async function getFriends(): Promise<FriendItem[] | undefined> {
        try {
            const res = await axios.get(
                `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/friends`,
                {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            const friends = res.data;
            console.log(friends);
            return friends;
        } catch (error) {
            console.error("Error fetching user friends", error);
            return undefined;
        }
    }

    useEffect(() => {
        getFriends().then((friends) => {
            setFriends(friends);
        });
    }, []);

    if (!friends) return <p>...</p>;
    return (
        <div className={styles.friendList}>
            <h3>{username}'s friend list :</h3>
            <ul>
                {friends.map((friend) => (
                    <FriendItem key={friend.id} friendDatas={friend} />
                ))}
            </ul>
        </div>
    );
}
