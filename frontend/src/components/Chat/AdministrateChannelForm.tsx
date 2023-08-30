import { useState } from "react";
import styles from "../../styles/Chat/AdministrateChannel.module.css";

enum UpdateType {
  KICK_PLAYER = "KICK_PLAYER",
  INVITE_PLAYER = "INVITE_PLAYER",
  SET_PLAYER_ADMIN = "SET_PLAYER_ADMIN",
  UNSET_PLAYER_ADMIN = "UNSET_PLAYER_ADMIN",
  BAN_PLAYER = "BAN_PLAYER",
  DEBAN_PLAYER = "DEBAN_PLAYER",
}

type AdministrateChannelFormProps = {
  formLabel: string;
  formOption: string;
  submitMessage: string;
  updateType: UpdateType;
  optionUsers: User[] | undefined;
  handleUpdate: (
    evt: any,
    targetUser: string | undefined,
    updateType: UpdateType
  ) => void;
};

export default function AdministrateChannelForm({
  formLabel,
  formOption,
  submitMessage,
  updateType,
  optionUsers,
  handleUpdate,
}: AdministrateChannelFormProps) {
  const [targetUser, setTargetUser] = useState("");

  function handleChange(evt: any) {
    const { name, value } = evt.target;
    setTargetUser(value);
  }

  return (
    <form onSubmit={(evt) => handleUpdate(evt, targetUser, updateType)}>
      <div className={styles.subform}>
        <label htmlFor={formOption}>{formLabel}</label>
        <select
          name={formOption}
          id={formOption}
          value={targetUser}
          onChange={(evt) => handleChange(evt)}
        >
          <option value=""></option>
          {optionUsers
            ? optionUsers.map((optionUser: User) => (
                <option key={optionUser.id} value={optionUser.username}>
                  {optionUser.username}
                </option>
              ))
            : undefined}
        </select>
      </div>
      <input type="submit" value={submitMessage} />
    </form>
  );
}
