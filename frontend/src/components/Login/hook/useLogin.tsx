"use-client";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

export const useLogin = () => {
  const router = useRouter();

  const initialValues = {
    username: "",
    password: "",
  };
  const handleLogin = async (values: any, { resetForm }: any) => {
    const loggedUser = { ...values };
    const res = await fetch(`http://10.5.0.3:3001/auth/login`, {
      method: "POST",
      body: JSON.stringify(loggedUser),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const json = await res.json();
      localStorage.setItem("Authenticate", "true");
      localStorage.setItem("token", json.access_token);
      setCookie("Authenticate", "true");
      setTimeout(() => {
        router.push(`/`);
      }, 1000);
    } else {
      setTimeout(() => {
        alert("Bad credentials");
      }, 1000);
    }
    await resetForm();
  };

  return { initialValues, handleLogin };
};
