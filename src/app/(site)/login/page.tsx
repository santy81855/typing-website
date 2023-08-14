"use client";
import styles from "@/styles/Register.module.css";
import React, { FormEvent, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";

const Login = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            await axios
                .get("/api/user")
                .then((res) => {
                    // if the user does not have a username, redirect to the username page
                    if (res.data.username === null) {
                        router.push("/user-setup");
                    } else {
                        router.push("/");
                    }
                })
                .catch((err) => {
                    alert("Error Fetching User " + err.message);
                });
        };
        if (status === "authenticated") {
            // check if the user has been initialized properly with a username and settings file in the database
            // if the user is authenticated send them to the home page
            router.push("/");
            //getUser();
        }
    }, [status]);

    const [data, setData] = useState({
        email: "",
        password: "",
    });

    // not using credentials, only using google and github
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
                            onClick={() => {
                                signIn("google");
                            }}
                        >
                            <div className={styles.logoContainer}>
                                <i
                                    className={`fab fa-google ${styles.logo}`}
                                ></i>
                                Google
                            </div>
                        </button>
                        <button
                            className={styles.button}
                            onClick={() => {
                                signIn("github");
                            }}
                        >
                            <div className={styles.logoContainer}>
                                <i
                                    className={`fab fa-github ${styles.logo}`}
                                ></i>
                                Github
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Login;
