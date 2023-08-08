"use client";

import styles from "../../styles/Chat/CreateChannel.module.css";

type CreateChannelProps = {
  addChannel: () => void;
};

export default function ChannelList({ addChannel }: CreateChannelProps) {
  return (
    <div>
      <h2>Create Channel</h2>
      <button onClick={addChannel}>lol</button>
    </div>
  );
}
