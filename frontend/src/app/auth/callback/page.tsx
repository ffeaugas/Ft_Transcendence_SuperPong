"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Callback() {
  const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const redirectUri = `http://${process.env.NEXT_PUBLIC_DOMAIN}:3000/auth/callback`;
    axios
      .post(`http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/api/exchange-code`, {
        code,
        redirectUri,
      })
      .then((response) => {
        if (response.data.access_token.codeRequire) {
          localStorage.setItem("tmpToken", response.data.access_token.tmpToken);
          localStorage.setItem("username", response.data.access_token.username);
          router.push("/login/checkin");
        } else {
          localStorage.setItem(
            "token",
            response.data.access_token.access_token
          );
          localStorage.setItem("Authenticate", "true");
          if (response.data.isFirstConnection) router.push("/profile");
          else router.push("/");
        }
      })
      .catch((error) => {
        console.error("Error exchanging code for access token:", error);
      });
  }, []);
}
