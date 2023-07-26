"use client";
import styles from "@/styles/Register.module.css";
import React, { useState, FormEvent } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";

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
            <form className={styles.form} onSubmit={registerUser}>
                <div className={styles.inputContainer}>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={data.username}
                        onChange={(e) => {
                            setData({ ...data, username: e.target.value });
                        }}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
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
                <div className={styles.inputContainer}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
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
                    />
                </div>
                <button className={styles.submitButton} type="submit">
                    Submit
                </button>
            </form>
        </main>
    );
};

export default Register;
