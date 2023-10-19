"use client";

import React, { useState } from "react";
import styles from "@/styles/Login.module.css";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

const clientId = process.env.NEXT_PUBLIC_OAUTH42_UID as string;
const redirectUri = `http://${process.env.NEXT_PUBLIC_DOMAIN}:3000/auth/callback`;
const scope = "public";

type LoginDatas = {
  username: string;
  password: string;
  code2fa: string;
};

export default function Login() {
  const [loginDatas, setLoginDatas] = useState<LoginDatas>({
    username: "",
    password: "",
    code2fa: "",
  });
  const [token2fa, setToken2fa] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  async function handleLogin(evt: any) {
    evt.preventDefault();

    const res = await fetch(
      `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/auth/login`,
      {
        method: "POST",
        body: JSON.stringify({
          login: loginDatas.username,
          password: loginDatas.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      const json = await res.json();
      if (json.codeRequire) {
        setToken2fa(json.tmpToken);
        return;
      }
      localStorage.setItem("Authenticate", "true");
      localStorage.setItem("token", json.access_token);
      setCookie("Authenticate", "true");
      setTimeout(() => {
        router.push(`/`);
      }, 400);
    } else {
      setTimeout(() => {
        setErrorMessage("Bad credentials");
      }, 400);
    }
    setLoginDatas({
      username: "",
      password: "",
      code2fa: "",
    });
  }

  async function check2faCode() {
    try {
      const res = await fetch(
        `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/auth/verif-otp?username=${loginDatas.username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            TwoFaCode: loginDatas.code2fa,
            TokenTmp: token2fa,
          }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("Authenticate", "true");
        localStorage.setItem("token", data.access_token);
        setCookie("Authenticate", "true");
        setTimeout(() => {
          router.push(`/`);
        }, 400);
      } else {
        setTimeout(() => {
          alert("Bad credentials");
        }, 400);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(evt: any): void {
    const { name, value } = evt.target;
    setLoginDatas({
      ...loginDatas,
      [name]: value,
    });
  }

  const handleAuthorize = () => {
    const authorizeUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scope}`;
    window.location.href = authorizeUrl;
  };

  return (
    <div className={styles.login}>
      {token2fa === null && (
        <form onSubmit={(evt) => handleLogin(evt)}>
          <h1 className={styles.fieldName}>Login</h1>
          <input
            type="text"
            name="username"
            value={loginDatas.username}
            onChange={(evt) => handleChange(evt)}
            className={styles.fieldInput}
          />
          <h1 className={styles.fieldName}>Password</h1>
          <input
            type="password"
            name="password"
            value={loginDatas.password}
            onChange={(evt) => handleChange(evt)}
            className={styles.fieldInput}
          />
          <button className={styles.button}>Login</button>
          <p className={styles.fieldError}>{errorMessage}</p>
        </form>
      )}
      {token2fa !== null && (
        <>
          <h1 className={styles.fieldName}>Enter the google auth code :</h1>
          <input
            type="text"
            id="code2fa"
            name="code2fa"
            value={loginDatas.code2fa}
            onChange={(evt) => handleChange(evt)}
            className={styles.fieldInput}
          />
          <button
            type="submit"
            onClick={check2faCode}
            className={styles.button}
          >
            send
          </button>
        </>
      )}
      <ul>
        <button className={styles.button} onClick={handleAuthorize}>
          <span className={styles.buttonContent}>
            <span>Sign with</span>
            <img
              src="https://etudestech.com/wp-content/uploads/2021/08/42_logo.png"
              alt="Icon"
              className={styles.buttonIcon}
            />
          </span>
        </button>
      </ul>
    </div>
  );
}
