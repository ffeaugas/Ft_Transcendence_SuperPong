import styles from "../../styles/Chat/AdministrateChannel.module.css";

enum ChannelMode {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
  PROTECTED = "PROTECTED",
}

type ChannelAdminFormDatas = {
  password: "";
  channelMode: ChannelMode;
  userToInvite: string;
  userToKick: string;
  userToAddAdmin: string;
  userToRemoveAdmin: string;
};

enum UpdateType {
  KICK_PLAYER = "KICK_PLAYER",
  INVITE_PLAYER = "INVITE_PLAYER",
  SET_PLAYER_ADMIN = "SET_PLAYER_ADMIN",
  UNSET_PLAYER_ADMIN = "UNSET_PLAYER_ADMIN",
}

type AdministrateChannelFormProps = {
  handleUpdate: (
    evt: any,
    targetUser: string | undefined,
    updateType: UpdateType
  ) => void;
  handleChangeForm: (evt: any) => void;
  updateType: UpdateType;
  formOption: string;
  formDatas: ChannelAdminFormDatas;
  optionUsers: User[] | undefined;
  label: string;
};

export default function AdministrateChannelForm({
  handleUpdate,
  handleChangeForm,
  formOption,
  formDatas,
  optionUsers,
  label,
}: AdministrateChannelFormProps) {
  return (
    <form
      onSubmit={(evt) =>
        handleUpdate(
          evt,
          formDatas.userToRemoveAdmin,
          UpdateType.UNSET_PLAYER_ADMIN
        )
      }
    >
      <div className={styles.subform}>
        <label htmlFor={formOption}>{label}</label>
        <select
          name={formOption}
          id={formOption}
          value={formDatas.userToRemoveAdmin}
          onChange={(evt) => handleChangeForm(evt)}
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
      <input type="submit" value="Remove" />
    </form>
  );
}
