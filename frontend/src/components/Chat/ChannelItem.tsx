"use client";

import axios from "axios";
import styles from "../../styles/Chat/ChannelItem.module.css";
import { useEffect, useState } from "react";
import userSlice from "@/app/GlobalRedux/Features/user/userSlice";
import { useRegister } from "../Register/hook/useRegister";

enum ChannelType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  PROTECTED = "PROTECTED",
}

enum ActiveDiscussionType {
  PRIV_MSG = "PRIV_MSG",
  CHANNEL = "CHANNEL",
}

type ChannelItemProps = {
  channelName: string;
  channelType: ChannelType;
  isActive: boolean;
  switchChannel: (
    discussionName: string,
    discussionType: ActiveDiscussionType
  ) => void;
};

export default function ChannelItem({
  channelName,
  channelType,
  isActive,
  switchChannel,
}: ChannelItemProps) {
  const [passwordDisplay, setPasswordDisplay] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const [feedbackMessage, setFeedbackMessage] = useState<String | undefined>(
    undefined
  );
  async function tryJoinChannel(evt: any, channelName: string) {
    evt.preventDefault();

    try {
      const res = await axios.patch(
        "http://10.5.0.3:3001/channels/get-authorization",
        {
          channelName: channelName,
          password: password,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      console.log(res);
      if (res.data.authorization)
        switchChannel(channelName, ActiveDiscussionType.CHANNEL);
      else setFeedbackMessage(res.data.reason);
    } catch (error) {
      console.log(error);
    }
    setPassword("");
    setPasswordDisplay(false);
  }

  function handleChangePassword(evt: any): void {
    const { name, value } = evt.target;
    setPassword(value);
  }

  useEffect(() => {
    if (feedbackMessage) {
      setTimeout(() => {
        setFeedbackMessage(undefined);
      }, 3000);
    }
  }, [feedbackMessage]);

  if (channelType === ChannelType.PROTECTED)
    return (
      <>
        <form
          className={isActive ? styles.activeChannelItem : styles.channelItem}
          onSubmit={(evt) => tryJoinChannel(evt, channelName)}
        >
          <p onClick={() => setPasswordDisplay(!passwordDisplay)}>
            {channelName}
          </p>
          {passwordDisplay && !isActive ? (
            <div className={styles.subform}>
              <label htmlFor="password">Password :</label>
              <input
                type="text"
                name="password"
                id="password"
                value={password}
                onChange={(evt) => handleChangePassword(evt)}
              />
            </div>
          ) : undefined}
          {feedbackMessage ? (
            <p className={styles.feedbackMessage}>{feedbackMessage}</p>
          ) : undefined}
        </form>
      </>
    );

  return (
    <div
      className={isActive ? styles.activeChannelItem : styles.channelItem}
      onClick={(evt) => tryJoinChannel(evt, channelName)}
    >
      <p>{channelName}</p>
      {feedbackMessage ? (
        <p className={styles.feedbackMessage}>{feedbackMessage}</p>
      ) : undefined}
    </div>
  );
}
