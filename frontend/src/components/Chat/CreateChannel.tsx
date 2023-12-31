"use client";

import { useState } from "react";
import styles from "../../styles/Chat/CreateChannel.module.css";
import { useSelector } from "react-redux";
import { RootState } from "@/app/GlobalRedux/store";

enum ChannelMode {
    PRIVATE = "PRIVATE",
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
}

export default function ChannelList() {
    const [channelInfos, setChannelInfos] = useState<ChannelInfos>({
        channelName: "",
        password: "",
        mode: ChannelMode.PUBLIC,
    });
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>({
        success: undefined,
        failure: undefined,
    });
    const username = useSelector((state: RootState) => state.user.username);

    function handleChange(evt: any): void {
        const { name, value } = evt.target;
        setChannelInfos({ ...channelInfos, [name]: value });
    }

    async function handleSubmit(evt: any): Promise<void> {
        evt.preventDefault();

        try {
            const data = {
                channelName: channelInfos.channelName,
                ownerName: username,
                mode: channelInfos.mode,
                password: channelInfos.password,
            };
            const res = await fetch(
                `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/channels`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                    body: JSON.stringify(data),
                }
            );
            if (res.ok) {
                setChannelInfos({
                    channelName: "",
                    password: "",
                    mode: ChannelMode.PUBLIC,
                });
                setFeedbackMessage({
                    success: "Channel successfully created!",
                    failure: undefined,
                });
            } else {
                const errorResponse = await res.json();
                setFeedbackMessage({
                    success: undefined,
                    failure: errorResponse.message,
                });
            }
        } catch (error) {
            setFeedbackMessage({
                success: undefined,
                failure: "Error occured when trying to create channel",
            });
        }
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
            {feedbackMessage.success ? (
                <p className={styles.success}>{feedbackMessage.success}</p>
            ) : undefined}
            {feedbackMessage.failure ? (
                <p className={styles.failure}>{feedbackMessage.failure}</p>
            ) : undefined}
        </div>
    );
}
