"use client";

import { useEffect, useState } from "react";
import styles from "../../styles/Chat/AdministrateChannel.module.css";
import axios from "axios";
import AdministrateChannelForm from "./AdministrateChannelForm";

enum ChannelMode {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
  PROTECTED = "PROTECTED",
}

enum MenuType {
  CHANNEL_SELECTOR = "CHANNEL_SELECTOR",
  USER_SELECTOR = "USER_SELECTOR",
  CHANNEL_CREATION = "CHANNEL_CREATION",
  CHANNEL_ADMINISTRATION = "CHANNEL_ADMINISTRATION",
}

enum UpdateType {
  KICK_PLAYER = "KICK_PLAYER",
  INVITE_PLAYER = "INVITE_PLAYER",
  SET_PLAYER_ADMIN = "SET_PLAYER_ADMIN",
  UNSET_PLAYER_ADMIN = "UNSET_PLAYER_ADMIN",
}

enum ActiveDiscussionType {
  PRIV_MSG = "PRIV_MSG",
  CHANNEL = "CHANNEL",
}

type ChannelAdminFormDatas = {
  password: "";
  channelMode: ChannelMode;
  userToInvite: string;
  userToKick: string;
  userToAddAdmin: string;
  userToRemoveAdmin: string;
};

type AdministrateChannelProps = {
  activeDiscussion: string | undefined;
  users: User[] | undefined;
  changeMenu: (menu: MenuType) => void;
  switchChannel: (
    discussionName: string,
    discussionType: ActiveDiscussionType
  ) => void;
};

export default function AdministrateChannel({
  activeDiscussion,
  users,
  changeMenu,
  switchChannel,
}: AdministrateChannelProps) {
  const [channelInfos, setChannelInfos] = useState<ChannelInfos | undefined>(
    undefined
  );

  const [formDatas, setFormDatas] = useState<ChannelAdminFormDatas>({
    password: "",
    channelMode: ChannelMode.PUBLIC,
    userToInvite: "",
    userToKick: "",
    userToAddAdmin: "",
    userToRemoveAdmin: "",
  });

  const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>({
    success: undefined,
    failure: undefined,
  });

  async function deleteChannel() {
    try {
      const response = await fetch(
        `http://10.5.0.3:3001/channels/${activeDiscussion}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (response.ok) {
        setFeedbackMessage({
          success: "Channel successfully deleted!",
          failure: undefined,
        });
        switchChannel("General", ActiveDiscussionType.CHANNEL);
        setTimeout(() => changeMenu(MenuType.CHANNEL_SELECTOR), 1000);
      } else {
        setFeedbackMessage({
          success: undefined,
          failure: "Problem occured when trying to delete channel!",
        });
      }
    } catch (error) {
      alert("lol");
      setFeedbackMessage({
        success: undefined,
        failure: "You can't delete this channel!",
      });
      console.error(error);
    }
  }

  function handleChangeForm(evt: any): void {
    const { name, value } = evt.target;
    setFormDatas({ ...formDatas, [name]: value });
  }

  async function handleUpdate(
    evt: any,
    targetUser: string | undefined,
    updateType: UpdateType
  ): Promise<void> {
    evt.preventDefault();
    if (!targetUser) return;
    try {
      const res = await axios.patch(
        "http://10.5.0.3:3001/channels/update",
        {
          channelName: activeDiscussion,
          targetUser: targetUser,
          updateType: updateType,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.status) {
        setFeedbackMessage({
          success: "Update successful!",
          failure: undefined,
        });
        getChannelInfos().then((channelInfos) => {
          setChannelInfos(channelInfos);
          console.log("CHANNNEEEEL INFOS :      ", channelInfos);
        });
      } else {
        setFeedbackMessage({
          success: undefined,
          failure: res.data.message,
        });
      }
    } catch (error: any) {
      setFeedbackMessage({
        success: undefined,
        failure: `Request ${updateType} failed`,
      });
    }
  }

  async function handleSubmit(evt: any): Promise<void> {
    evt.preventDefault();
    try {
      const res = await axios.patch(
        "http://10.5.0.3:3001/channels/change-mode",
        {
          channelName: activeDiscussion,
          mode: formDatas.channelMode,
          password: "",
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.status) {
        setChannelInfos({
          channelName: "",
          password: "",
          mode: ChannelMode.PUBLIC,
        });
        setFeedbackMessage({
          success: "Channel update success!",
          failure: undefined,
        });
      } else {
        setFeedbackMessage({
          success: undefined,
          failure: res.data.message,
        });
      }
    } catch (error: any) {
      setFeedbackMessage({
        success: undefined,
        failure: "Error occured during channel update",
      });
    }
  }

  async function getChannelInfos(): Promise<any> {
    const res = await axios.get("http://10.5.0.3:3001/channels/infos", {
      params: { channelName: activeDiscussion },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    console.log(res.data);
    return res.data;
  }

  useEffect(() => {
    getChannelInfos().then((channelInfos) => {
      setChannelInfos(channelInfos);
    });
  }, []);

  if (!channelInfos) return <p>...</p>;

  return (
    <div className={styles.adminChannel}>
      <h2>
        Manage Channel<br></br>
        <b>{activeDiscussion}</b>
      </h2>
      <div className={styles.forms}>
        <form onSubmit={(evt) => handleSubmit(evt)}>
          <div className={styles.subform}>
            <label htmlFor="channelMode">Change mode :</label>
            <select
              name="channelMode"
              id="channelMode"
              value={formDatas.channelMode}
              onChange={(evt) => handleChangeForm(evt)}
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
              <option value="PROTECTED">Protected</option>
            </select>
          </div>
          {formDatas.channelMode === ChannelMode.PROTECTED ? (
            <div className={styles.subform}>
              <label htmlFor="password">Change password :</label>
              <input
                type="text"
                name="password"
                id="password"
                value={formDatas.password}
                onChange={(evt) => handleChangeForm(evt)}
              />
            </div>
          ) : undefined}
          <input type="submit" value="Update" />
        </form>

        <form
          onSubmit={(evt) =>
            handleUpdate(
              evt,
              formDatas.userToAddAdmin,
              UpdateType.SET_PLAYER_ADMIN
            )
          }
        >
          <div className={styles.subform}>
            <label htmlFor="userToAddAdmin">Set new admin:</label>
            <select
              name="userToAddAdmin"
              id="userToAddAdmin"
              value={formDatas.userToAddAdmin}
              onChange={(evt) => handleChangeForm(evt)}
            >
              <option value=""></option>
              {users
                ? users.map((user) => (
                    <option key={user.id} value={user.username}>
                      {user.username}
                    </option>
                  ))
                : undefined}
            </select>
          </div>
          <input type="submit" value="Promote" />
        </form>

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
            <label htmlFor="userToRemoveAdmin">Remove admin:</label>
            <select
              name="userToRemoveAdmin"
              id="userToRemoveAdmin"
              value={formDatas.userToRemoveAdmin}
              onChange={(evt) => handleChangeForm(evt)}
            >
              <option value=""></option>
              {channelInfos?.invitedUsers
                ? channelInfos.invitedUsers.map((invitedUser) => (
                    <option key={invitedUser.id} value={invitedUser.username}>
                      {invitedUser.username}
                    </option>
                  ))
                : undefined}
            </select>
          </div>
          <input type="submit" value="Remove" />
        </form>

        <AdministrateChannelForm
          handleUpdate={handleUpdate}
          handleChangeForm={handleChangeForm}
          formOption={"userToRemoveAdmin"}
          formDatas={formDatas}
          optionUsers={channelInfos?.invitedUsers}
          label={"Remove admin"}
        />

        {formDatas.channelMode === ChannelMode.PRIVATE ? (
          <>
            <form
              onSubmit={(evt) =>
                handleUpdate(
                  evt,
                  formDatas.userToInvite,
                  UpdateType.INVITE_PLAYER
                )
              }
            >
              <div className={styles.subform}>
                <label htmlFor="userToInvite">Invite to channel:</label>
                <select
                  name="userToInvite"
                  id="userToInvite"
                  value={formDatas.userToInvite}
                  onChange={(evt) => handleChangeForm(evt)}
                >
                  <option value=""></option>
                  {users
                    ? users.map((user) => (
                        <option key={user.id} value={user.username}>
                          {user.username}
                        </option>
                      ))
                    : undefined}
                </select>
              </div>
              <input type="submit" value="Invite" />
            </form>
            <form
              onSubmit={(evt) =>
                handleUpdate(evt, formDatas.userToKick, UpdateType.KICK_PLAYER)
              }
            >
              <div className={styles.subform}>
                <label htmlFor="userToKick">Kick from channel:</label>
                <select
                  name="userToKick"
                  id="userToKick"
                  value={formDatas.userToKick}
                  onChange={(evt) => handleChangeForm(evt)}
                >
                  <option value=""></option>
                  {channelInfos?.invitedUsers
                    ? channelInfos.invitedUsers.map((invitedUser) => (
                        <option
                          key={invitedUser.id}
                          value={invitedUser.username}
                        >
                          {invitedUser.username}
                        </option>
                      ))
                    : undefined}
                </select>
              </div>
              <input type="submit" value="Kick" />
            </form>
          </>
        ) : undefined}

        <button onClick={deleteChannel}>Delete</button>
      </div>
      {feedbackMessage.success ? (
        <p className={styles.success}>{feedbackMessage.success}</p>
      ) : undefined}
      {feedbackMessage.failure ? (
        <p className={styles.failure}>{feedbackMessage.failure}</p>
      ) : undefined}
    </div>
  );
}
