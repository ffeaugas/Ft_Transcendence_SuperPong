import { useEffect, useState } from "react";
import styles from "@/styles/FriendRequests/FriendRequestList.module.css";
import FriendRequestItem from "./FriendRequestItem";

type FriendRequest = {
  id: string;
  senderId: string;
};

export default function FriendRequestList() {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  async function getFriendRequests() {
    try {
      const res = await fetch(
        `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/getfriendrequests`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const requests = res.json();
      return requests;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async function acceptRequest(senderId: string) {
    console.log("REJEECTTTT REQUEST : ", senderId);

    try {
      const res = await fetch(
        `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/acceptFriendRequest`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ senderId: senderId }),
        }
      );
    } catch (error) {
      console.log(error);
    }
    return;
  }

  async function rejectRequest(senderId: string) {
    try {
      const res = await fetch(
        `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/rejectFriendRequest`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ senderId: senderId }),
        }
      );
    } catch (error) {
      console.log(error);
    }
    return;
  }

  useEffect(() => {
    getFriendRequests().then((res) => {
      setFriendRequests(res);
      console.log("FRIENDS REQUES T :: ", res);
    });
  }, []);

  return (
    <div className={styles.requestList}>
      <h3>Requests :</h3>
      <ul>
        {friendRequests.map((request) => (
          <FriendRequestItem
            key={request.id}
            request={request}
            acceptRequest={acceptRequest}
            rejectRequest={rejectRequest}
          />
        ))}
      </ul>
    </div>
  );
}
