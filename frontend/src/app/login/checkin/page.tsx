"use client";

import Header from "@/components/Header";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "@/styles/page.module.css";

export default function Checkin() {
  const [code2fa, setCode2fa] = useState<string>("");
  const router = useRouter();

  async function check2faCode() {
    try {
      const res = await fetch(
        `http://${
          process.env.NEXT_PUBLIC_DOMAIN
        }:3001/auth/verif-otp?username=${localStorage.getItem("username")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            TwoFaCode: code2fa,
            TokenTmp: localStorage.getItem("tmpToken"),
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

  return (
    <section className={`${styles.page}`}>
      <Header />
      <div className={styles.auth}>
        <h4>Enter the google auth code :</h4>
        <input
          type="text"
          id="code2fa"
          name="code2fa"
          value={code2fa}
          onChange={(evt) => setCode2fa(evt.target.value)}
        />
        <button className={styles.button} type="submit" onClick={check2faCode}>
          send
        </button>
      </div>
    </section>
  );
}
