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
    const res = await fetch(`http://10.5.0.3:3001/auth/register`, {
      method: "POST",
      body: JSON.stringify(registeredUser),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const json = await res.json();
      console.log(json);
      localStorage.setItem("Authenticate", "true");
      localStorage.setItem("token", json.access_token);
      setCookie("Authenticate", "true");
      setTimeout(() => {
        router.push(`/profile`);
      }, 300);
    }
    await resetForm();
  };

  return { initialValues, handleRegister };
};
