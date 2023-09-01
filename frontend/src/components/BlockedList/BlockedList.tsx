import styles from "@/styles/BlockedList/BlockedList.module.css";
import BlockedItem from "./BlockedItem";
import { useEffect, useState } from "react";
import axios from "axios";

type BlockedListProps = {
  username: string;
};

type BlockedItem = {
  id: string;
  username: string;
  profile: any;
  status: string;
};

export default function BlockedList({ username }: BlockedListProps) {
  const [blockeds, setFriends] = useState<BlockedItem[] | undefined>(undefined);

  async function getFriends(): Promise<BlockedItem[] | undefined> {
    try {
      const res = await axios.get("http://10.5.0.3:3001/users/blockeds", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const blockeds = res.data;
      console.log(blockeds);
      return blockeds;
    } catch (error) {
      console.error("Error fetching user blockeds", error);
      return undefined;
    }
  }

  useEffect(() => {
    getFriends().then((blockeds) => {
      setFriends(blockeds);
    });
  }, []);

  if (!blockeds) return <p>...</p>;
  return (
    <div className={styles.blockedList}>
      <h3>{username}'s blocked list :</h3>
      <ul>
        {blockeds.map((blocked) => (
          <BlockedItem key={blocked.id} blockedDatas={blocked} />
        ))}
      </ul>
    </div>
  );
}
