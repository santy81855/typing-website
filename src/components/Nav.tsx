"use client";
import styles from "@/styles/Nav.module.css";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import settings from "@/lib/settings.json";

const Nav = () => {
    const { data: session, status } = useSession();
    const [userName, setUserName] = useState("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [userText, setUserText] = useState("");
    const [results, setResults] = useState<string[]>([]);
    const resultsRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        // check if the typed text is part of any settings
        const set = JSON.parse(JSON.stringify(settings) || "{}");
        const keys = Object.keys(set);
        console.log(keys);
        const tempResults: string[] = [];
        if (userText !== "") {
            if (resultsRef.current) resultsRef.current.style.display = "flex";
            keys.forEach((key) => {
                if (key.includes(userText)) {
                    tempResults.push(key);
                }
            });
        } else {
            if (resultsRef.current) resultsRef.current.style.display = "none";
        }
        setResults(tempResults);
    }, [userText]);

    return (
        <main className={styles.main}>
            {isSettingsOpen && (
                <div className={styles.settingsContainer}>
                    <input
                        className={styles.settingsInput}
                        type="text"
                        placeholder="Settings"
                        value={userText}
                        onChange={(e) => {
                            setUserText(e.target.value);
                        }}
                    />
                    <div ref={resultsRef} className={styles.resultsContainer}>
                        <div className={styles.result}>All settings</div>
                        {results.map((result, index) => {
                            console.log(result);
                            return (
                                <div key={index} className={styles.result}>
                                    <p>{result}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            <div className={styles.navContainer}>
                <div className={styles.container}>
                    <Link href="/" className={styles.leftContainer}>
                        <Image
                            className={styles.logo}
                            src="/images/logo-magical-2-circle.png"
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
                            <Link
                                className={styles.profileLink}
                                href={"/profile"}
                            >
                                {session?.user?.image && (
                                    <Image
                                        className={styles.userImage}
                                        src={session?.user?.image}
                                        width={30}
                                        height={30}
                                        alt="user"
                                        unoptimized={true}
                                    />
                                )}
                                <p className={styles.appName}>{userName}</p>
                            </Link>
                            <i
                                className={`fas fa-fw fa-cog ${styles.settingsIcon}`}
                                onClick={() => {
                                    setIsSettingsOpen(!isSettingsOpen);
                                    setUserText("");
                                }}
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
