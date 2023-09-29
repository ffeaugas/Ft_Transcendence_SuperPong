"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/Chat/ChannelList.module.css";
import ChannelItem from "./ChannelItem";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/app/GlobalRedux/store";

enum MenuType {
    CHANNEL_SELECTOR = "CHANNEL_SELECTOR",
    USER_SELECTOR = "USER_SELECTOR",
    CHANNEL_CREATION = "CHANNEL_CREATION",
    CHANNEL_ADMINISTRATION = "CHANNEL_ADMINISTRATION",
}

enum ChannelType {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    PROTECTED = "PROTECTED",
}

enum ActiveDiscussionType {
    PRIV_MSG = "PRIV_MSG",
    CHANNEL = "CHANNEL",
}

type ChannelListProps = {
    channels: Channels | undefined;
    activeDiscussionType: ActiveDiscussionType;
    activeDiscussion: string | undefined;
    switchChannel: (
        discussionName: string,
        discussionType: ActiveDiscussionType
    ) => void;
    changeMenu: (menu: MenuType) => void;
};

export default function ChannelList({
    channels,
    activeDiscussionType,
    activeDiscussion,
    switchChannel,
    changeMenu,
}: ChannelListProps) {
    const [channelDisplay, setChannelDisplay] = useState<ChannelDisplay>({
        publicChannels: true,
        privateChannels: false,
        protectedChannels: false,
    });
    const [channelInfos, setChannelInfos] = useState<any>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const username = useSelector((state: RootState) => state.user.username);

    function toggleChannelDisplay(channelMode: keyof ChannelDisplay): void {
        setChannelDisplay((prevState) => ({
            ...prevState,
            [channelMode]: !prevState[channelMode],
        }));
    }

    function isActive(channelName: string): boolean {
        if (channelName === activeDiscussion) return true;
        return false;
    }

    function checkIfAdmin(adminUsers: User[]): boolean {
        for (let i = 0; i < adminUsers.length; i++) {
            if (adminUsers[i].username === username) return true;
        }
        return false;
    }

    async function leaveChannel() {
        const res = await axios.patch(
            `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/channels/leave-channel`,
            { channelName: activeDiscussion },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        );
        switchChannel("General", ActiveDiscussionType.CHANNEL);
        return res.data;
    }

    async function getChannelInfos(): Promise<any> {
        try {
            const res = await axios.get(
                `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/channels/infos`,
                {
                    params: { channelName: activeDiscussion },
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            return res.data;
        } catch (error) {
            switchChannel("General", ActiveDiscussionType.CHANNEL);
        }
        return undefined;
    }

    useEffect(() => {
        if (activeDiscussionType === ActiveDiscussionType.CHANNEL) {
            getChannelInfos().then((channelInfos) => {
                setChannelInfos(channelInfos);
                setIsAdmin(checkIfAdmin(channelInfos.adminUsers));
            });
        }
    }, [activeDiscussion]);

    if (!channels) {
        return undefined;
    }

    return (
        <div className={styles.channelList}>
            <div className={styles.channels}>
                <h2>Channels</h2>
                <br></br>
                <div
                    className={
                        channelDisplay.publicChannels
                            ? styles.displayedChannels
                            : undefined
                    }
                    onClick={() => {
                        toggleChannelDisplay("publicChannels");
                    }}
                >
                    <h4>Public :</h4>
                    <s></s>
                </div>
                {channelDisplay.publicChannels ? (
                    <ul>
                        {channels.publics.map((channel) => (
                            <ChannelItem
                                key={channel.id}
                                {...channel}
                                channelType={ChannelType.PUBLIC}
                                isActive={
                                    isActive(channel.channelName) ? true : false
                                }
                                switchChannel={switchChannel}
                            />
                        ))}
                    </ul>
                ) : undefined}
                <div
                    className={
                        channelDisplay.privateChannels
                            ? styles.displayedChannels
                            : undefined
                    }
                    onClick={() => {
                        toggleChannelDisplay("privateChannels");
                    }}
                >
                    <h4>Private :</h4>
                </div>
                {channelDisplay.privateChannels ? (
                    <ul>
                        {channels.privates.map((channel) => (
                            <ChannelItem
                                key={channel.id}
                                {...channel}
                                channelType={ChannelType.PRIVATE}
                                isActive={
                                    isActive(channel.channelName) ? true : false
                                }
                                switchChannel={switchChannel}
                            />
                        ))}
                    </ul>
                ) : undefined}
                <div
                    className={
                        channelDisplay.protectedChannels
                            ? styles.displayedChannels
                            : undefined
                    }
                    onClick={() => {
                        toggleChannelDisplay("protectedChannels");
                    }}
                >
                    <h4>Protected :</h4>
                </div>
                {channelDisplay.protectedChannels ? (
                    <ul>
                        {channels.protecteds.map((channel) => (
                            <ChannelItem
                                key={channel.id}
                                {...channel}
                                channelType={ChannelType.PROTECTED}
                                isActive={
                                    isActive(channel.channelName) ? true : false
                                }
                                switchChannel={switchChannel}
                            />
                        ))}
                    </ul>
                ) : undefined}
            </div>
            <div className={styles.channelButtons}>
                {channelInfos.mode === ChannelType.PRIVATE ? (
                    <button onClick={leaveChannel}>Leave Channel</button>
                ) : undefined}
                {channelInfos.mode === ChannelType.PRIVATE &&
                channelInfos?.owner?.username === username ? (
                    <p className={styles.warningMessage}>
                        Be careful : leaving channel as owner will destroy it
                    </p>
                ) : undefined}
                {channelInfos?.owner?.username === username || isAdmin ? (
                    <button
                        onClick={() =>
                            changeMenu(MenuType.CHANNEL_ADMINISTRATION)
                        }
                    >
                        Manage Channel
                    </button>
                ) : undefined}
            </div>
        </div>
    );
}
