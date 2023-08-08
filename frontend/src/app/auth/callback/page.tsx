"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Callback() {
    const router = useRouter();
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        // if (state !== "a_very_long_random_string_witchmust_be_unguessable") {
        //   // Handle error - states don't match
        //   return;
        // }
        console.log("JE SUIS LE CALLBACK DU FRONT");
        const redirectUri = "http://localhost:3000/auth/callback";
        axios
            .post("http://10.5.0.3:3001/api/exchange-code", {
                code,
                redirectUri,
            })
            .then((response) => {
                console.log("Access token:", response.data.access_token);
                localStorage.setItem("token", response.data.access_token);
                localStorage.setItem("Authenticate", "true");
                router.push("/");
            })
            .catch((error) => {
                console.error("Error exchanging code for access token:", error);
            });
    }, []);
}
