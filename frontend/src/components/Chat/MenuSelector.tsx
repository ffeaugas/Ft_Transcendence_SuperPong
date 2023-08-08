"use client";

import styles from "../../styles/Chat/MenuSelector.module.css";

type MenuSelectorProps = {
  selectedMenu: number;
  changeMenu: (menuID: number) => void;
};

export default function MenuSelector({
  selectedMenu,
  changeMenu,
}: MenuSelectorProps) {
  return (
    <div className={`${styles.menuSelector}`}>
      <button
        onClick={() => changeMenu(0)}
        className={selectedMenu === 0 ? styles.isActive : ""}
      >
        &#x274B;
      </button>
      <button
        onClick={() => changeMenu(1)}
        className={selectedMenu === 1 ? styles.isActive : ""}
      >
        &#x2727;
      </button>
      <button
        onClick={() => changeMenu(2)}
        className={selectedMenu === 2 ? styles.isActive : ""}
      >
        &#x271A;
      </button>
    </div>
  );
}
