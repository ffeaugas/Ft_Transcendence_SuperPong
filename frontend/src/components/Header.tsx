"use client";

import styles from "../styles/Header.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Header() {
  const router = useRouter();

  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [userProfilePicture, setUserProfilePicture] = useState("");

  async function getUsername() {
    const res = await fetch("http://10.5.0.3:3001/users/me", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const user = await res.json();
    return user["username"];
  }

  async function getUserPicture(user: string) {
    try {
      const res = await axios.get("http://10.5.0.3:3001/users", {
        params: { username: user },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(res.data.url_picture);
      const userPictureUrl = res.data.url_picture;
      return userPictureUrl;
    } catch (error) {
      console.error("Error fetching user picture:", error);
      return null;
    }
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

  useEffect(() => {
    const auth = localStorage.getItem("Authenticate") === "true";
    setAuth(auth);
    if (auth) {
      getUsername().then((user) => {
        setUsername(user);
        getUserPicture(user).then((userProfilePicture) => {
          setUserProfilePicture(userProfilePicture);
        });
      });
    }
  }, []);

  return (
    <div className={`${styles.header}`}>
      <div className={`${styles.subdiv}`}>
        <h1>
          Super<b>Pong</b>
        </h1>
        <ul>
          <li>
            <Link href="/" className={pathname == "/" ? styles.isActive : ""}>
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/game"
              className={pathname == "/game" ? styles.isActive : ""}
            >
              Game
            </Link>
          </li>
          <li>
            <Link
              href="/social"
              className={pathname == "/social" ? styles.isActive : ""}
            >
              Social
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
                <img
                  className={`${styles.rounded}`}
                  src={`${userProfilePicture}`}
                />
                <div className={styles.userInfo}>
                  <span>{`Bonjour ${username}`}</span>
                  <div className={styles.loggedOptions}>
                    <button className={styles.button} onClick={handleLogout}>
                      Logout
                    </button>
                    <Link className={styles.button} href="/profile">
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
