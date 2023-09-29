import styles from "@/styles/FriendList/FriendItem.module.css";

type FriendItem = {
  id: string;
  username: string;
  profile: any;
};

type FriendDatasProps = {
  friendDatas: FriendItem;
  isOnline: boolean;
  isPlaying: boolean;
};

export default function FriendItem({
  friendDatas,
  isOnline,
  isPlaying,
}: FriendDatasProps) {
  return (
    <div className={styles.friendItem}>
      <img
        className={
          !isOnline
            ? styles.OFFLINE
            : isPlaying
            ? styles.PLAYING
            : styles.ONLINE
        }
        src={`http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/uploads/avatar/${friendDatas.profile["profilePicture"]}`}
      />
      <p>{friendDatas.username}</p>
    </div>
  );
}
