"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import React from "react";
import { useRegister } from "./hook/useRegister";
import styles from "@/styles/Login.module.css";
import { object, string, ref } from "yup";

export default function Register() {
    const { initialValues, handleRegister } = useRegister();

    const formSchema = object().shape({
        username: string().min(2).required("Required"),
        password: string().min(8).required("Required"),
        confirmPassword: string().oneOf(
            [ref("password")],
            "Passwords do not match"
        ),
    });
    return (
        <div className={styles.login}>
            <Formik
                initialValues={initialValues}
                validationSchema={formSchema}
                onSubmit={handleRegister}
            >
                <Form>
                    <h1 className={styles.fieldName}>Username</h1>
                    <div className={styles.fieldContainer}>
                        <Field
                            type="text"
                            name="username"
                            id="username"
                            className={styles.fieldInput}
                        />
                        <ErrorMessage
                            name="username"
                            component="div"
                            className={styles.fieldError}
                        />
                    </div>
                    <h1 className={styles.fieldName}>Password</h1>
                    <div className={styles.fieldContainer}>
                        <Field
                            type="password"
                            name="password"
                            id="password"
                            className={styles.fieldInput}
                        />
                        <ErrorMessage
                            name="password"
                            component="div"
                            className={styles.fieldError}
                        />
                    </div>
                    <h1 className={styles.fieldName}>Confirm Password</h1>
                    <div className={styles.fieldContainer}>
                        <Field
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            className={styles.fieldInput}
                        />

                        <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className={styles.fieldError}
                        />
                    </div>
                    <div className={styles.buttonContainer}>
                        <ul>
                            <button type="submit" className={styles.button}>
                                Register
                            </button>
                        </ul>
                    </div>
                </Form>
            </Formik>
        </div>
    );
}
