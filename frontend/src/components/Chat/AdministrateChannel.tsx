"use client";

import { useState } from "react";
import styles from "../../styles/Chat/AdministrateChannel.module.css";
import axios from "axios";

enum ChannelMode {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
  PROTECTED = "PROTECTED",
}

type AdministrateChannelProps = {
  activeDiscussion: string | undefined;
  users: User[] | undefined;
};

export default function AdministrateChannel({
  activeDiscussion,
  users,
}: AdministrateChannelProps) {
  const [channelInfos, setChannelInfos] = useState<ChannelInfos>({
    channelName: "",
    password: "",
    mode: ChannelMode.PUBLIC,
  });
  const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>({
    success: undefined,
    failure: undefined,
  });
  const [invitedUser, setInvitedUser] = useState<string | undefined>(undefined);

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

  function handleChange(evt: any): void {
    const { name, value } = evt.target;
    setChannelInfos({ ...channelInfos, [name]: value });
  }

  function handleChangeInvitation(evt: any): void {
    const { name, value } = evt.target;
    setInvitedUser(value);
    console.log(invitedUser);
  }

  async function handleInvitation(evt: any): Promise<void> {
    evt.preventDefault();
    try {
      const res = await axios.patch(
        "http://10.5.0.3:3001/channels/invite",
        {
          channelName: activeDiscussion,
          invitedUser: invitedUser,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.status) {
        setFeedbackMessage({
          success: "User successfully invited!",
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
        failure: "Error occured when trying to invite user",
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
          mode: channelInfos.mode,
          password: "",
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.status) {
        const channelName = channelInfos.channelName;
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

  return (
    <div className={styles.adminChannel}>
      <h2>
        Manage Channel<br></br>
        <b>{activeDiscussion}</b>
      </h2>
      <form onSubmit={(evt) => handleSubmit(evt)}>
        <div className={styles.subform}>
          <label htmlFor="channelmode">Change mode :</label>
          <select
            name="mode"
            id="channelmode"
            value={channelInfos.mode}
            onChange={(evt) => handleChange(evt)}
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
            <option value="PROTECTED">Protected</option>
          </select>
        </div>
        {channelInfos.mode === ChannelMode.PROTECTED ? (
          <div className={styles.subform}>
            <label htmlFor="password">Change password :</label>
            <input
              type="text"
              name="password"
              id="password"
              value={channelInfos.password}
              onChange={(evt) => handleChange(evt)}
            />
          </div>
        ) : undefined}
        <input type="submit" value="Update" />
      </form>

      {channelInfos.mode === ChannelMode.PRIVATE ? (
        <form onSubmit={(evt) => handleInvitation(evt)}>
          <div className={styles.subform}>
            <label htmlFor="invitation">Invite to channel:</label>
            <select
              name="mode"
              id="invitation"
              value={invitedUser}
              onChange={(evt) => handleChangeInvitation(evt)}
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
      ) : undefined}

      <button onClick={deleteChannel}>Delete</button>
      {feedbackMessage.success ? (
        <p className={styles.success}>{feedbackMessage.success}</p>
      ) : undefined}
      {feedbackMessage.failure ? (
        <p className={styles.failure}>{feedbackMessage.failure}</p>
      ) : undefined}
    </div>
  );
}
