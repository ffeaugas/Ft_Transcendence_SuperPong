import styles from "@/styles/FriendList/FriendItem.module.css";

type FriendItem = {
  id: string;
  name: string;
  profilePicture: string;
  status: string;
};

type FriendDatasProps = {
  friendDatas: FriendItem;
};

export default function FriendItem({ friendDatas }: FriendDatasProps) {
  let status = friendDatas.status;
  let dynamicClassName = `${styles[status]}`;
  console.log(status, dynamicClassName);
  return (
    <div className={styles.friendItem}>
      <img
        className={`${styles[status]}`}
        src={friendDatas["profilePicture"]}
      />
      <p>{friendDatas.name}</p>
    </div>
  );
}
