"use client";

import { useState } from "react";
import styles from "../../styles/Chat/AdministrateChannel.module.css";
import axios from "axios";

enum ChannelMode {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
  PROTECTED = "PROTECTED",
}

type ChannelInfos = {
  channelName: string;
  password?: string;
  mode: ChannelMode;
};

type AdministrateChannelProps = {
  activeChannel: string;
};

export default function AdministrateChannel({
  activeChannel,
}: AdministrateChannelProps) {
  const [channelInfos, setChannelInfos] = useState<ChannelInfos>({
    channelName: "",
    password: "",
    mode: ChannelMode.PUBLIC,
  });
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  function handleChange(evt: any): void {
    const { name, value } = evt.target;
    setChannelInfos({ ...channelInfos, [name]: value });
  }

  async function handleSubmit(evt: any): Promise<void> {
    evt.preventDefault();

    try {
      const data = {
        channelName: channelInfos.channelName,
        mode: channelInfos.mode,
        // password: channelInfos.password,
      };
      const res = await fetch("http://10.5.0.3:3001/channels/change-mode", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const channelName = channelInfos.channelName;
        setChannelInfos({
          channelName: "",
          password: "",
          mode: ChannelMode.PUBLIC,
        });
        setFeedbackMessage("Channel update success!");
      } else {
        setFeedbackMessage("Channel update failed.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.adminChannel}>
      <h2>
        Manage Channel<br></br>
        <b>{activeChannel}</b>
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
      <p>{feedbackMessage}</p>
    </div>
  );
}
