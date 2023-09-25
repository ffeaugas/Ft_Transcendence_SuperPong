/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import styles from "../styles/Header.module.css";
import Link from "next/link";
import axios from "axios";
import { usePathname } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { RootState } from "@/app/GlobalRedux/store";
import { useSelector, useDispatch } from "react-redux";
import { setUsername } from "@/app/GlobalRedux/Features/user/userSlice";

async function getProfileDatas(
  username: string | undefined
): Promise<ProfileDatas | undefined> {
  if (username) {
    try {
      const res = await axios.get(
        `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/profiles`,
        {
          params: { username: username },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const profileDatas = res.data;
      return profileDatas;
    } catch (error) {
      console.error("Error fetching profile datas", error);
      return undefined;
    }
  }
}

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [profileDatas, setProfileDatas] = useState<ProfileDatas | undefined>(
    undefined
  );
  const username = useSelector((state: RootState) => state.user.username);

  async function getUsername(): Promise<string> {
    const res = await fetch(
      `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/me`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const user = await res.json();
    return user["username"];
  }

  const pathname: string | null = usePathname();

  const handleLogout = () => {
    setAuth(localStorage.getItem("Authenticate") !== "true");
    localStorage.setItem("Authenticate", "false");
    localStorage.removeItem("Authenticate");
    localStorage.removeItem("token");
    deleteCookie("Authenticate");
    router.push("/");
  };

  async function updateStatus() {
    if (localStorage.getItem("Authenticate") !== "true") return;
    try {
      const updatedStatus = await fetch(
        `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/updatestatus`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setInterval(() => {
      updateStatus();
    }, 1000);
    const auth = localStorage.getItem("Authenticate") === "true";
    setAuth(auth);
    if (auth) {
      getUsername().then((username) => {
        dispatch(setUsername(username));
        getProfileDatas(username).then((profileDatas) => {
          setProfileDatas(profileDatas);
        });
      });
    }
  }, []);

  return (
    <div className={`${styles.header}`}>
      <div className={`${styles.subdiv}`}>
        <h1
          onClick={() => {
            router.push("/");
          }}
        >
          Super<b>Pong</b>
        </h1>
        <ul className={styles.menu}>
          <li>
            <Link href="/" className={pathname == "/" ? styles.isActive : ""}>
              Home
            </Link>
          </li>
          {auth && (
            <li>
              <Link
                href="/game"
                className={pathname == "/game" ? styles.isActive : ""}
              >
                Game
              </Link>
            </li>
          )}
          {auth && (
            <li>
              <Link
                href="/social"
                className={pathname == "/social" ? styles.isActive : ""}
              >
                Social
              </Link>
            </li>
          )}
          <li>
            <Link
              href="/achievements"
              className={pathname == "/achievements" ? styles.isActive : ""}
            >
              Achievements
            </Link>
          </li>
          <li>
            <Link
              href="/leaderboard"
              className={pathname == "/leaderboard" ? styles.isActive : ""}
            >
              Leaderboard
            </Link>
          </li>
        </ul>
        <ul>
          {!auth ? (
            <li>
              <Link href="/login">Login </Link>
              <span> | </span>
              <Link href="/register"> Register</Link>
            </li>
          ) : (
            <li className={styles.authenticatedUser}>
              <div className={styles.userContainer}>
                {!profileDatas ? (
                  <p>...</p>
                ) : (
                  <img
                    className={`${styles.rounded}`}
                    src={`http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/uploads/avatar/${profileDatas["profilePicture"]}`}
                  />
                )}
                <div className={styles.userInfo}>
                  <span>{` Hi ${username}`}</span>
                  <div className={styles.loggedOptions}>
                    <button className={styles.button} onClick={handleLogout}>
                      Logout
                    </button>
                    <Link
                      className={styles.button}
                      href={`http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/profiles?username=${username}`}
                      as={`/profile/${username}`}
                    >
                      Profile
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
