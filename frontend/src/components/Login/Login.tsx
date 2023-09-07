"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import React from "react";
import { useLogin } from "./hook/useLogin";
import styles from "@/styles/Login.module.css";

const clientId = process.env.NEXT_PUBLIC_OAUTH42_UID as string;
const redirectUri = `http://${process.env.NEXT_PUBLIC_DOMAIN}:3000/auth/callback`;
const scope = "public";

export default function Login() {
    const { initialValues, handleLogin } = useLogin();

    const handleAuthorize = () => {
        const authorizeUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
            redirectUri
        )}&response_type=code&scope=${scope}`;
        window.location.href = authorizeUrl;
    };

    return (
        <div className={styles.login}>
            <Formik initialValues={initialValues} onSubmit={handleLogin}>
                <Form>
                    <h1 className={styles.fieldName}>Login</h1>
                    <div className={styles.fieldContainer}>
                        <Field
                            type="text"
                            name="login"
                            id="login"
                            className={styles.fieldInput}
                        />
                        <ErrorMessage name="login" component="div" />
                    </div>
                    <h1 className={styles.fieldName}>Password</h1>
                    <div className={styles.fieldContainer}>
                        <Field
                            type="password"
                            name="password"
                            id="password"
                            className={styles.fieldInput}
                        />
                        <ErrorMessage name="password" component="div" />
                    </div>
                    <div className={styles.buttonContainer}>
                        <ul>
                            <button type="submit" className={styles.button}>
                                Login
                            </button>
                        </ul>
                    </div>
                </Form>
            </Formik>
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
