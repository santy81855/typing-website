"use client";
import styles from "@/styles/Register.module.css";
import React, { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

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
            <div className={styles.container}>
                <div className={`${styles.circle} ${styles.topLeft}`}></div>
                <div className={`${styles.circle} ${styles.bottomLeft}`}></div>
                <div className={styles.content}>
                    <h1 className={styles.title}>Login</h1>
                    <div className={styles.providerContainer}>
                        <button
                            className={styles.button}
                            onClick={() => signIn("google")}
                        >
                            <div className={styles.logoContainer}>
                                <Image
                                    className={styles.googleLogo}
                                    src="/images/google-logo.png"
                                    width={25}
                                    height={25}
                                    alt="google"
                                    unoptimized={true}
                                />
                                Login with Google
                            </div>
                        </button>
                    </div>
                    <div className={styles.line}>
                        <hr />
                        OR
                        <hr />
                    </div>
                    <form className={styles.form} onSubmit={loginUser}>
                        <div className={styles.inputContainer}>
                            <Image
                                className={styles.image}
                                src="/images/envelope.png"
                                width={25}
                                height={25}
                                alt="envelope"
                                unoptimized={true}
                            />
                            <input
                                id="email"
                                name="email"
                                type="text"
                                required
                                value={data.email}
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        email: e.target.value,
                                    });
                                }}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <Image
                                className={styles.image}
                                src="/images/password.png"
                                width={20}
                                height={20}
                                alt="password"
                                unoptimized={true}
                            />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={data.password}
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        password: e.target.value,
                                    });
                                }}
                            />
                        </div>
                        <button
                            className={`${styles.button} ${styles.submit}`}
                            type="submit"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default Login;
