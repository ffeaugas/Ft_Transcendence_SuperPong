import styles from "@/styles/FriendList/FriendItem.module.css";

type FriendItem = {
    id: string;
    username: string;
    profile: any;
    status: string;
};

type FriendDatasProps = {
    friendDatas: FriendItem;
};

export default function FriendItem({ friendDatas }: FriendDatasProps) {
    let status = friendDatas.status;
    let dynamicClassName = `${styles[status]}`;
    return (
        <div className={styles.friendItem}>
            <img
                className={`${styles[status]}`}
                src={`http://10.5.0.3:3001/uploads/avatar/${friendDatas.profile["profilePicture"]}`}
            />
            <p>{friendDatas.username}</p>
        </div>
    );
}
