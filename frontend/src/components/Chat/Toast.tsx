import styles from "@/styles/Chat/Toast.module.css";
import { useRouter } from "next/navigation";

type ToastProps = {
  gameRequests: Toast[];
  friendRequests: FriendRequest[];
  deleteGameInvitation: (senderUsername: string) => void;
  deleteFriendInvitation: (senderId: string) => void;
  acceptFriendInvitation: (senderId: string) => void;
};

export default function Toast({
  gameRequests,
  friendRequests,
  deleteFriendInvitation,
  acceptFriendInvitation,
  deleteGameInvitation,
}: ToastProps) {
  const router = useRouter();

  function goToGame(request: Toast) {
    deleteGameInvitation(request.sender.username);
    router.push(
      `http://${
        process.env.NEXT_PUBLIC_DOMAIN
      }:3000/game/${request.roomId.toString()}`
    );
  }

  return (
    <div className={styles.toasts}>
      <ul>
        {gameRequests.map((request) => (
          <li key={request.id} className={styles.gameToast}>
            <h4>{request.sender.username} invited you in a game !</h4>
            <button onClick={() => goToGame(request)}>Accept</button>
            <button
              onClick={() => deleteGameInvitation(request.sender.username)}
            >
              Decline
            </button>
          </li>
        ))}
        {friendRequests.map((request) => (
          <li key={request.id} className={styles.friendToast}>
            <h4>{request.sender.username} wants to be friend with you !</h4>
            <button onClick={() => acceptFriendInvitation(request.sender.id)}>
              Accept
            </button>
            <button onClick={() => deleteFriendInvitation(request.sender.id)}>
              Decline
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
