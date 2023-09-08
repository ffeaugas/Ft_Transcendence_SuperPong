/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import MsgItem from "./MsgItem";
import styles from "../../styles/Chat/MsgList.module.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import React from "react";
import { Socket, io } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "@/app/GlobalRedux/store";

enum ActiveDiscussionType {
    PRIV_MSG = "PRIV_MSG",
    CHANNEL = "CHANNEL",
}

type MsgListProps = {
    activeDiscussion: string | undefined;
    activeDiscussionType: ActiveDiscussionType;
    showUserInfos: (username: string | null) => void;
};

export default function MsgList({
    activeDiscussion,
    activeDiscussionType,
    showUserInfos,
}: MsgListProps) {
    const [textInput, setTextInput] = useState<string>("");
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<Message[] | undefined>(undefined);
    const msgListRef = useRef(null);
    const username = useSelector((state: RootState) => state.user.username);

    async function socketInitializer(): Promise<any> {
        const socket = io(`http://${process.env.NEXT_PUBLIC_DOMAIN}:3001`);

        socket?.on("connect", () => {
            console.log("connected");
        });
        setSocket(socket);
    }

    function sendMessage(data: string) {
        socket?.emit("message", data);
    }

    useEffect(() => {
        socketInitializer();
    }, [setSocket]);

    async function addMessage(content: string) {
        let data;
        try {
            if (activeDiscussionType === ActiveDiscussionType.CHANNEL) {
                data = {
                    isPrivMessage: false,
                    channelName: activeDiscussion,
                    content: textInput,
                    receiver: "",
                };
            } else {
                data = {
                    isPrivMessage: true,
                    channelName: "",
                    content: textInput,
                    receiver: activeDiscussion,
                };
            }
            const res = await fetch(
                `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/message`,
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
        } catch (error) {
            console.error("Error adding a new message", error);
        }
    }

    async function getMessages(): Promise<Message[] | undefined> {
        if (activeDiscussionType === ActiveDiscussionType.CHANNEL) {
            try {
                const res = await axios.get(
                    `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/channels/messages`,
                    {
                        params: { channelName: activeDiscussion },
                        headers: {
                            Authorization:
                                "Bearer " + localStorage.getItem("token"),
                        },
                    }
                );
                const messages = res.data;
                return messages;
            } catch (error) {
                console.error("Error fetching channel messages", error);
                return undefined;
            }
        } else {
            try {
                const res = await axios.get(
                    `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/message/${activeDiscussion}`,
                    {
                        headers: {
                            Authorization:
                                "Bearer " + localStorage.getItem("token"),
                        },
                    }
                );
                const privMessages = res.data;
                return privMessages;
            } catch (error) {
                console.error("Error fetching private messages", error);
                return undefined;
            }
        }
    }

    function handleChange(evt: any) {
        const { name, value } = evt.target;
        setTextInput(value);
    }

    function handleSubmit(evt: any) {
        evt.preventDefault();
        addMessage(textInput);
        sendMessage(textInput);
        setTextInput("");
    }

    function messageListner(message: Message) {
        if (!messages) return;
        if (
            !message.isPrivMessage &&
            message.Channel.channelName === activeDiscussion
        )
            setMessages([...messages, message]);
        if (
            message.isPrivMessage &&
            ((message.receiver.username === activeDiscussion &&
                message.sender.username === username) ||
                (message.receiver.username === username &&
                    message.sender.username === activeDiscussion))
        )
            setMessages([...messages, message]);
        return;
    }

    useEffect((): any => {
        socket?.on("message", messageListner);
        return () => socket?.off("message", messageListner);
    }, [messageListner]);

    useEffect(() => {
        getMessages().then((messages) => {
            setMessages(messages);
        });
    }, [activeDiscussion]);

    useEffect(() => {
        if (msgListRef.current) {
            msgListRef.current.scrollTop = msgListRef.current.scrollHeight;
        }
    }, [messages]);

    if (!messages) {
        return <p>...</p>;
    }

    return (
        <div className={`${styles.msgList}`}>
            <ul ref={msgListRef}>
                {messages.map((message) => (
                    <MsgItem
                        key={message.id}
                        message={message}
                        showUserInfos={showUserInfos}
                    />
                ))}
            </ul>
            <form onSubmit={(evt) => handleSubmit(evt)}>
                <input
                    type="text"
                    name="textInput"
                    value={textInput}
                    onChange={(evt) => handleChange(evt)}
                ></input>
            </form>
        </div>
    );
}
