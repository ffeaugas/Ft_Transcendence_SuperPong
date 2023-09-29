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
            .post(
                `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/api/exchange-code`,
                {
                    code,
                    redirectUri,
                }
            )
            .then((response) => {
                localStorage.setItem(
                    "token",
                    response.data.access_token.access_token
                );
                localStorage.setItem("Authenticate", "true");
                if (response.data.isFirstConnection) router.push("/profile");
                else router.push("/");
            })
            .catch((error) => {
                console.error("Error exchanging code for access token:", error);
            });
    }, []);
}
