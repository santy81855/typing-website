"use client";
import styles from "@/styles/Nav.module.css";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Nav = () => {
    const { data: session, status } = useSession();
    const [userName, setUserName] = useState("");

    useEffect(() => {
        // get the username
        const getUser = async () => {
            await axios
                .get("/api/user")
                .then((res) => {
                    // if the user does not have a username, just display their name
                    if (res.data.username === null) {
                        setUserName("");
                    } else {
                        setUserName(res.data.username);
                    }
                })
                .catch((err) => {
                    alert("Error Fetching User " + err.message);
                });
        };
        if (status === "authenticated") {
            getUser();
        }
    }, [session]);

    return (
        <main className={styles.main}>
            <div className={styles.navContainer}>
                <div className={styles.container}>
                    <Link href="/" className={styles.leftContainer}>
                        <Image
                            className={styles.logo}
                            src="/images/logo-circular.webp"
                            width={30}
                            height={30}
                            alt="logo"
                            unoptimized={true}
                        />
                        <p className={styles.appName}>Blah Type</p>
                    </Link>
                </div>
                <nav className={styles.container}>
                    {session === null ? (
                        <Link href="/login">login</Link>
                    ) : (
                        <>
                            {session?.user?.image ? (
                                <Image
                                    className={styles.userImage}
                                    src={session?.user?.image}
                                    width={30}
                                    height={30}
                                    alt="user"
                                    unoptimized={true}
                                />
                            ) : (
                                <Link href="/profile">Profile</Link>
                            )}
                            <p className={styles.appName}>{userName}</p>
                            <i
                                className={`fas fa-fw fa-cog ${styles.settingsIcon}`}
                            ></i>
                            <button
                                className={styles.signOutButton}
                                onClick={() => {
                                    signOut();
                                }}
                            >
                                <i className={`fa fa-sign-out`}></i>
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </main>
    );
};

export default Nav;
