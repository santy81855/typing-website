"use client";
import styles from "@/styles/Register.module.css";
import React, { useState, FormEvent } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import Image from "next/image";

const Register = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
    });

    const registerUser = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // post request with axios
        axios
            .post("/api/register", data)
            .then(() => {
                alert("User has been registered");
                // log in the user
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
            })
            .catch((res) => alert(res));
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={`${styles.circle} ${styles.topLeft}`}></div>
                <div className={`${styles.circle} ${styles.bottomLeft}`}></div>
                <div className={styles.content}>
                    <h1 className={styles.title}>Create Account</h1>
                    <form className={styles.form} onSubmit={registerUser}>
                        <div className={styles.inputContainer}>
                            <Image
                                className={styles.image}
                                src="/images/username.png"
                                width={25}
                                height={25}
                                alt="password"
                                unoptimized={true}
                            />
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={data.username}
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        username: e.target.value,
                                    });
                                }}
                                placeholder="Username: "
                            />
                        </div>
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
                                type="email"
                                required
                                value={data.email}
                                onChange={(e) => {
                                    setData({ ...data, email: e.target.value });
                                }}
                                placeholder="Email: "
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
                                placeholder="Password: "
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
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={data.confirmPassword}
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        confirmPassword: e.target.value,
                                    });
                                }}
                                placeholder="Confirm Password: "
                            />
                        </div>
                        <button
                            className={`${styles.button} ${styles.submit}`}
                            type="submit"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default Register;
