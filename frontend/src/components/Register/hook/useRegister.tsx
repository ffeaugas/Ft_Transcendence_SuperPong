"use-client";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

export const useRegister = () => {
    const router = useRouter();

    const initialValues = {
        login: "",
        password: "",
        confirmPassword: "",
    };

    const handleRegister = async (values: any, { resetForm }: any) => {
        const { login, password } = values;
        const registeredUser = { login, password };
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/auth/register`,
            {
                method: "POST",
                body: JSON.stringify(registeredUser),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (res.ok) {
            const json = await res.json();
            console.log(json);
            localStorage.setItem("Authenticate", "true");
            localStorage.setItem("token", json.access_token);
            setCookie("Authenticate", "true");
            setTimeout(() => {
                router.push(`/profile`);
            }, 1000);
        }
        await resetForm();
    };

    return { initialValues, handleRegister };
};
