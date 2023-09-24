import styles from "@/styles/FriendRequests/FriendRequestItem.module.css";
import axios from "axios";
import { useEffect, useState } from "react";

type FriendRequest = {
  id: string;
  senderId: string;
};

interface ProfileDatas {
  user: any;
}

type FriendRequestItemProps = {
  request: FriendRequest;
  acceptRequest: (senderId: string) => Promise<void>;
  rejectRequest: (senderId: string) => Promise<void>;
};

export default function FriendRequestItem({
  request,
  acceptRequest,
  rejectRequest,
}: FriendRequestItemProps) {
  const [profile, setProfile] = useState<ProfileDatas | undefined>(undefined);

  async function getProfile(id: string): Promise<ProfileDatas | undefined> {
    try {
      const res = await axios.get(
        `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/profiles`,
        {
          params: { id: id },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const profileDatas = res.data;
      return profileDatas;
    } catch (error) {
      console.error("Error fetching profile datas", error);
      return undefined;
    }
  }

  useEffect(() => {
    getProfile(request.senderId).then((res) => {
      setProfile(res);
      console.log("PROFILE DU KEUMee : ", res);
    });
  }, []);

  if (!profile) return;

  return (
    <li className={styles.requestItem}>
      <p>{profile?.user?.username}</p>
      <img
        className={`${styles.rounded}`}
        src={`http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/uploads/avatar/${profile?.profilePicture}`}
      />
      <div className={styles.buttons}>
        <button onClick={() => acceptRequest(request.senderId)}>O</button>
        <button onClick={() => rejectRequest(request.senderId)}>N</button>
      </div>
    </li>
  );
}
