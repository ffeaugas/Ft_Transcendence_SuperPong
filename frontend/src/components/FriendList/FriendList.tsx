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
};

export default function FriendList({ username }: FriendListProps) {
  const [friends, setFriends] = useState<FriendItem[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  async function getFriends(): Promise<FriendItem[]> {
    try {
      const res = await axios.get(
        `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/friends`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const friends = res.data;
      console.log(friends);
      return friends;
    } catch (error) {
      console.error("Error fetching user friends", error);
      return [];
    }
  }

  async function getOnlineUsers(): Promise<FriendItem[]> {
    try {
      const res = await axios.get(
        `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/onlineusers`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const onlineUsers: string[] = res.data;
      return onlineUsers;
    } catch (error) {
      console.error("Error fetching online users", error);
      return [];
    }
  }

  useEffect(() => {
    getFriends().then((friends) => {
      setFriends(friends);
    });
    getOnlineUsers().then((res) => {
      setOnlineUsers(res);
    });
  }, []);

  return (
    <div className={styles.friendList}>
      <h3>{username}'s friend list :</h3>
      <ul>
        {friends.map((friend) => (
          <FriendItem
            key={friend.id}
            friendDatas={friend}
            isOnline={onlineUsers.includes(friend.username) ? true : false}
          />
        ))}
      </ul>
    </div>
  );
}
