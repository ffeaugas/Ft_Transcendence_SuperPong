import styles from "@/styles/Chat/Toast.module.css";
import { useRouter } from "next/navigation";

type ToastProps = {
  gameRequests: Toast[];
  deleteGameInvitation: (senderUsername: string) => void;
};

export default function Toast({
  gameRequests,
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
          <li key={request.id} className={styles.toast}>
            <h3>{request.sender.username} invited you in game !</h3>
            <button onClick={() => goToGame(request)}>Accept</button>
            <p onClick={() => deleteGameInvitation(request.sender.username)}>
              X
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
