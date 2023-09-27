import styles from "@/styles/Chat/Toast.module.css";
import { useRouter } from "next/navigation";

type ToastProps = {
  gameRequests: Toast[];
  deleteGameInvitation: () => void;
};

export default function Toast({
  gameRequests,
  deleteGameInvitation,
}: ToastProps) {
  const router = useRouter();

  function goToGame(roomId: number) {
    router.push(
      `http://${process.env.NEXT_PUBLIC_DOMAIN}:3000/game/${roomId.toString()}`
    );
  }

  return (
    <div className={styles.toasts}>
      <ul>
        {gameRequests.map((request) => (
          <li key={request.id} className={styles.toast}>
            <h3>{request.sender} invited you in game !</h3>
            <button onClick={() => goToGame(request.roomId)}>Accept</button>
            <p onClick={deleteGameInvitation}>X</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
