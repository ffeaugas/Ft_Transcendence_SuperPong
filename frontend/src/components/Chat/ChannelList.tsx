"use client";

import { useState } from "react";
import styles from "@/styles/Chat/ChannelList.module.css";
import ChannelItem from "./ChannelItem";

enum MenuType {
    CHANNEL_SELECTOR = "CHANNEL_SELECTOR",
    USER_SELECTOR = "USER_SELECTOR",
    CHANNEL_CREATION = "CHANNEL_CREATION",
    CHANNEL_ADMINISTRATION = "CHANNEL_ADMINISTRATION",
}

type ChannelItem = {
    id: string;
    channelName: string;
};

type Channels = {
    publics: ChannelItem[];
    privates: ChannelItem[];
    protecteds: ChannelItem[];
};

type ChannelDisplay = {
    publicChannels: boolean;
    privateChannels: boolean;
    protectedChannels: boolean;
};

type ChannelListProps = {
    channels: Channels | undefined;
    activeChannel: string;
    switchChannel: (channelName: string) => void;
    changeMenu: (menu: MenuType) => void;
};

export default function ChannelList({
    channels,
    activeChannel,
    switchChannel,
    changeMenu,
}: ChannelListProps) {
    const [channelDisplay, setChannelDisplay] = useState<ChannelDisplay>({
        publicChannels: true,
        privateChannels: false,
        protectedChannels: false,
    });

    function toggleChannelDisplay(channelMode: keyof ChannelDisplay): void {
        setChannelDisplay((prevState) => ({
            ...prevState,
            [channelMode]: !prevState[channelMode],
        }));
    }

    function isActive(channelName: string): boolean {
        if (channelName === activeChannel) {
            return true;
        }
        return false;
    }

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
                                isActive={
                                    isActive(channel.channelName) ? true : false
                                }
                                switchChannel={switchChannel}
                            />
                        ))}
                    </ul>
                ) : undefined}
            </div>
            <button onClick={() => changeMenu(MenuType.CHANNEL_ADMINISTRATION)}>
                Manage Channel
            </button>
        </div>
    );
}
