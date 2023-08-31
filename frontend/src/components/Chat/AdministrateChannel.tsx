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
  BAN_PLAYER = "BAN_PLAYER",
  DEBAN_PLAYER = "DEBAN_PLAYER",
}

enum ActiveDiscussionType {
  PRIV_MSG = "PRIV_MSG",
  CHANNEL = "CHANNEL",
}

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
    console.log("UPDATE : ", updateType, " on : ", targetUser);
    if (!targetUser) return;
    try {
      const res = await fetch("http://10.5.0.3:3001/channels/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          channelName: activeDiscussion,
          targetUser: targetUser,
          updateType: updateType,
        }),
      });
      if (res.ok) {
        setFeedbackMessage({
          success: "Update successful!",
          failure: undefined,
        });
        setTimeout(() => {
          getChannelInfos().then((channelInfos) => {
            setChannelInfos(channelInfos);
          });
        }, 300);
      } else {
        const errorResponse = await res.json();
        setFeedbackMessage({
          success: undefined,
          failure: errorResponse.message,
        });
      }
    } catch (error: any) {
      setFeedbackMessage({
        success: undefined,
        failure: "Error when trying to update channel",
      });
    }
  }

  async function handleUpdateMode(evt: any): Promise<void> {
    evt.preventDefault();
    try {
      const res = await axios.patch(
        "http://10.5.0.3:3001/channels/change-mode",
        {
          channelName: activeDiscussion,
          mode: formDatas.channelMode,
          password: formDatas.password,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.status) {
        setTimeout(() => {
          getChannelInfos().then((channelInfos) => {
            setChannelInfos(channelInfos);
          });
        }, 300);
        setFormDatas({ ...formDatas, password: "" });
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

  function isInvited(user: User, invitedUsers: User[] | undefined) {
    if (!invitedUsers) return;
    for (let i = 0; i < invitedUsers.length; i++) {
      if (user.username === invitedUsers[i].username) return true;
    }
    return false;
  }

  function isAdmin(user: User, adminUsers: User[] | undefined) {
    if (!adminUsers) return;
    for (let i = 0; i < adminUsers.length; i++) {
      if (user.username === adminUsers[i].username) return true;
    }
    return false;
  }

  function isBannable(
    user: User,
    banUsers: User[] | undefined,
    adminUsers: User[] | undefined
  ) {
    if (!banUsers || !adminUsers) return;
    for (let i = 0; i < banUsers.length; i++) {
      if (user.username === banUsers[i].username) return false;
    }
    for (let i = 0; i < adminUsers.length; i++) {
      if (user.username === adminUsers[i].username) return false;
    }
    return true;
  }

  async function getChannelInfos(): Promise<any> {
    const res = await axios.get("http://10.5.0.3:3001/channels/infos", {
      params: { channelName: activeDiscussion },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    console.log("Updated infos : ", res.data);
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
        <form onSubmit={(evt) => handleUpdateMode(evt)}>
          <div className={styles.subform}>
            <label htmlFor="channelMode">Change mode :</label>
            <select
              name="channelMode"
              id="channelMode"
              value={formDatas.channelMode}
              onChange={(evt) => handleChangeForm(evt)}
            >
              <option value=""></option>
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

        {channelInfos.mode === ChannelMode.PRIVATE ? (
          <>
            <AdministrateChannelForm
              formLabel={"Invite to channel:"}
              formOption={"userToInvite"}
              submitMessage={"Invite"}
              updateType={UpdateType.INVITE_PLAYER}
              optionUsers={users?.filter(
                (user) => !isInvited(user, channelInfos.invitedUsers)
              )}
              handleUpdate={handleUpdate}
            />
            <AdministrateChannelForm
              formLabel={"Kick from channel:"}
              formOption={"userToKick"}
              submitMessage={"Kick"}
              updateType={UpdateType.KICK_PLAYER}
              optionUsers={channelInfos?.invitedUsers}
              handleUpdate={handleUpdate}
            />
          </>
        ) : undefined}

        <AdministrateChannelForm
          formLabel={"Set new admin:"}
          formOption={"userToAddAdmin"}
          submitMessage={"Promote"}
          updateType={UpdateType.SET_PLAYER_ADMIN}
          optionUsers={users?.filter(
            (user) => !isAdmin(user, channelInfos.adminUsers)
          )}
          handleUpdate={handleUpdate}
        />
        <AdministrateChannelForm
          formLabel={"Remove admin"}
          formOption={"userToRemoveAdmin"}
          submitMessage={"Demote"}
          updateType={UpdateType.UNSET_PLAYER_ADMIN}
          optionUsers={channelInfos?.adminUsers}
          handleUpdate={handleUpdate}
        />

        <AdministrateChannelForm
          formLabel={"Ban user:"}
          formOption={"userToBan"}
          submitMessage={"Ban"}
          updateType={UpdateType.BAN_PLAYER}
          optionUsers={users?.filter((user) =>
            isBannable(user, channelInfos.banUsers, channelInfos.adminUsers)
          )}
          handleUpdate={handleUpdate}
        />
        <AdministrateChannelForm
          formLabel={"Deban user"}
          formOption={"userToDeban"}
          submitMessage={"Deban"}
          updateType={UpdateType.DEBAN_PLAYER}
          optionUsers={channelInfos?.banUsers}
          handleUpdate={handleUpdate}
        />

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
