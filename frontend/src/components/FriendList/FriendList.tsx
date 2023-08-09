import styles from "@/styles/FriendList/FriendList.module.css";
import FriendItem from "./FriendItem";

type FriendListProps = {
  username: string;
};

type FriendItem = {
  id: string;
  name: string;
  profilePicture: string;
  status: string;
};

export default function FriendList({ username }: FriendListProps) {
  const friends: FriendItem[] = [
    {
      id: "fefwe",
      name: "fewfwe",
      profilePicture: "catProfilePicture.jpg",
      status: "online",
    },
    {
      id: "aaaaaa",
      name: "aaaaaaaaaaaa",
      profilePicture: "catProfilePicture.jpg",
      status: "online",
    },
    {
      id: "aaaaaa",
      name: "aaaaaaaaaaaa",
      profilePicture: "catProfilePicture.jpg",
      status: "offline",
    },
    {
      id: "aaaaaa",
      name: "aaaaaaaaaaaa",
      profilePicture: "catProfilePicture.jpg",
      status: "offline",
    },
    {
      id: "aaaaaa",
      name: "aaaaaaaaaaaa",
      profilePicture: "catProfilePicture.jpg",
      status: "online",
    },
    {
      id: "aaaaaa",
      name: "aaaaaaaaaaaa",
      profilePicture: "catProfilePicture.jpg",
      status: "waiting",
    },
    {
      id: "aaaaaa",
      name: "aaaaaaaaaaaa",
      profilePicture: "catProfilePicture.jpg",
      status: "online",
    },
    {
      id: "aaaaaa",
      name: "aaaaaaaaaaaa",
      profilePicture: "catProfilePicture.jpg",
      status: "waiting",
    },
    {
      id: "aaaaaa",
      name: "aaaaaaaaaaaa",
      profilePicture: "catProfilePicture.jpg",
      status: "online",
    },
    {
      id: "aaaaaa",
      name: "aaaaaaaaaaaa",
      profilePicture: "catProfilePicture.jpg",
      status: "online",
    },
  ];

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
