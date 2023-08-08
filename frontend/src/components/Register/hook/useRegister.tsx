"use-client";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

export const useRegister = () => {
    const router = useRouter();

    const initialValues = {
        username: "",
        password: "",
        confirmPassword: "",
    };

    const handleRegister = async (values: any, { resetForm }: any) => {
        console.log("ALOALOALOALOALOALOALO");
        const { username, password } = values;
        const registeredUser = { username, password };
        const res = await fetch(`http://10.5.0.3:3001/auth/register`, {
            method: "POST",
            body: JSON.stringify(registeredUser),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (res.ok) {
            // A CHANGER
            setTimeout(() => {
                router.push(`/login`);
            }, 1000);
        }
        await resetForm();
    };

    return { initialValues, handleRegister };
};
