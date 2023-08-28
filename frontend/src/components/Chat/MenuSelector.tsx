"use client";

import styles from "../../styles/Chat/MenuSelector.module.css";
import Image from "next/image";

enum MenuType {
  CHANNEL_SELECTOR = "CHANNEL_SELECTOR",
  USER_SELECTOR = "USER_SELECTOR",
  CHANNEL_CREATION = "CHANNEL_CREATION",
  CHANNEL_ADMINISTRATION = "CHANNEL_ADMINISTRATION",
}

type MenuSelectorProps = {
  selectedMenu: MenuType;
  changeMenu: (menu: MenuType) => void;
};

export default function MenuSelector({
  selectedMenu,
  changeMenu,
}: MenuSelectorProps) {
  return (
    <div className={`${styles.menuSelector}`}>
      <button
        onClick={() => changeMenu(MenuType.CHANNEL_SELECTOR)}
        className={
          selectedMenu === MenuType.CHANNEL_SELECTOR ? styles.isActive : ""
        }
      >
        <Image
          className={styles.icon}
          src="/channels-icon.png"
          width={20}
          height={20}
          alt="Channels icon"
        />
      </button>
      <button
        onClick={() => changeMenu(MenuType.USER_SELECTOR)}
        className={
          selectedMenu === MenuType.USER_SELECTOR ? styles.isActive : ""
        }
      >
        <Image
          className={styles.icon}
          src="/privmsg-icon.png"
          width={20}
          height={20}
          alt="Channels icon"
        />
      </button>
      <button
        onClick={() => changeMenu(MenuType.CHANNEL_CREATION)}
        className={
          selectedMenu === MenuType.CHANNEL_CREATION ? styles.isActive : ""
        }
      >
        <Image
          className={styles.icon}
          src="/newchannel-icon.png"
          width={20}
          height={20}
          alt="Channels icon"
        />
      </button>
    </div>
  );
}
