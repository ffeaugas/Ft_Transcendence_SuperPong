"use client";

import { useState } from "react";
import styles from "../../styles/Chat/CreateChannel.module.css";

type CreateChannelProps = {
  createChannel: (evt: any) => void;
};

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

export default function ChannelList({ createChannel }: CreateChannelProps) {
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

  function handleSubmit(evt: any): void {
    evt.preventDefault();
    createChannel(channelInfos);
    setChannelInfos({
      channelName: "",
      password: "",
      mode: ChannelMode.PUBLIC,
    });
    setFeedbackMessage("Channel successfully created!");
  }

  return (
    <div className={styles.createChannel}>
      <h2>Create Channel</h2>
      <form onSubmit={(evt) => handleSubmit(evt)}>
        <div className={styles.subform}>
          <label htmlFor="channelname">Name :</label>
          <input
            type="text"
            name="channelName"
            id="channelname"
            value={channelInfos.channelName}
            onChange={(evt) => handleChange(evt)}
          />
        </div>
        <div className={styles.subform}>
          <label htmlFor="channelmode">Mode :</label>
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
            <label htmlFor="password">Password :</label>
            <input
              type="text"
              name="password"
              id="password"
              value={channelInfos.password}
              onChange={(evt) => handleChange(evt)}
            />
          </div>
        ) : undefined}
        <input type="submit" value="Create" />
      </form>
      <p>{feedbackMessage}</p>
    </div>
  );
}
