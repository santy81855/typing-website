"use client";
import styles from "@/styles/Register.module.css";
import React, { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const loginUser = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        signIn("credentials", {
            ...data,
            redirect: false, // to prevent being redirected to one of the next auth default pages
        }).then((callback) => {
            if (callback?.error) {
                alert(callback.error);
            } else if (callback?.ok) {
                alert("User logged in!");
            }
        });
    };

    return (
        <main className={styles.main}>
            <div className={styles.providerContainer}>
                <button onClick={() => signIn("google")}>
                    Login with Google
                </button>
            </div>
            <form className={styles.form} onSubmit={loginUser}>
                <div className={styles.inputContainer}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="text"
                        required
                        value={data.email}
                        onChange={(e) => {
                            setData({ ...data, email: e.target.value });
                        }}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={data.password}
                        onChange={(e) => {
                            setData({ ...data, password: e.target.value });
                        }}
                    />
                </div>
                <button className={styles.submitButton} type="submit">
                    Login
                </button>
            </form>
        </main>
    );
};

export default Login;
