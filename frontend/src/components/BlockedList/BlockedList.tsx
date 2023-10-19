import axios from "axios";
import { useEffect, useState } from "react";
import styles from "@/styles/BlockedList/BlockedList.module.css";

enum RelationType {
  FRIEND = "FRIEND",
  BLOCK = "BLOCK",
}

type BlockedUser = {
  id: number;
  username: string;
};

export default function BlockedList() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[] | undefined>(
    undefined
  );
  const [userToDeblock, setUserToDeblock] = useState<string>("");

  async function getBlockedUsers(): Promise<BlockedUser[] | undefined> {
    try {
      const res = await fetch(
        `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/blockeds`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          cache: "no-store",
        }
      );
      const blocked = await res.json();
      return blocked;
    } catch (error) {
      console.error("Error fetching blocked users", error);
      return undefined;
    }
  }

  const handleRelationChange = async (evt: any) => {
    evt.preventDefault();
    if (userToDeblock === "") return undefined;
    try {
      const res = await axios.patch(
        `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/changeRelation`,
        {
          targetUsername: userToDeblock,
          relationType: RelationType.BLOCK,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const profileDatas = res.data;
      setTimeout(() => {
        getBlockedUsers().then((res) => setBlockedUsers(res));
      }, 300);
      return profileDatas;
    } catch (error) {
      console.error("Error fetching profile datas", error);
      return undefined;
    }
  };

  function handleChange(evt: any): void {
    const { name, value } = evt.target;
    setUserToDeblock(value);
  }

  useEffect(() => {
    getBlockedUsers().then((res) => setBlockedUsers(res));
  }, []);
  return (
    <form onSubmit={(evt) => handleRelationChange(evt)}>
      <div className={styles.subform}>
        <label htmlFor="deblock">Deblock user :</label>
        <select
          name="deblock"
          id="deblock"
          value={userToDeblock}
          onChange={handleChange}
        >
          <option value=""></option>
          {blockedUsers
            ? blockedUsers.map((optionUser: BlockedUser) => (
                <option key={optionUser.id} value={optionUser.username}>
                  {optionUser.username}
                </option>
              ))
            : undefined}
        </select>
        <input type="submit" value="Deblock" />
      </div>
    </form>
  );
}
