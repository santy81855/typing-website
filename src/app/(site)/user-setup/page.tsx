"use client";
import React, { useState, useEffect } from "react";
import styles from "@/styles/UserSetup.module.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
    RegExpMatcher,
    TextCensor,
    englishDataset,
    englishRecommendedTransformers,
} from "obscenity";

const UserSetup = () => {
    const matcher = new RegExpMatcher({
        ...englishDataset.build(),
        ...englishRecommendedTransformers,
    });
    const router = useRouter();
    const [usernames, setUsernames] = useState<string[]>([]);
    const [userText, setUserText] = useState("");
    const [showLabel, setShowLabel] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");
    useEffect(() => {
        const getUsernames = async () => {
            await axios
                .get("/api/get-all-usernames")
                .then((res) => {
                    setUsernames(
                        res.data.map(
                            (user: { username: string }) => user.username
                        )
                    );
                })
                .catch((err) => {
                    alert("Error Fetching Usernames " + err.message);
                });
        };
        getUsernames();
    }, []);

    // everytime that the user updates the text, check if the username is taken
    useEffect(() => {
        if (usernames.includes(userText)) {
            setWarningMessage("Username is taken.");
        } else if (matcher.hasMatch(userText)) {
            setWarningMessage("Username contains profanity.");
        } else {
            setWarningMessage("");
        }
    }, [userText]);

    const submitUsername = async () => {
        if (matcher.hasMatch(userText)) {
            return;
        }
        if (usernames.includes(userText)) {
            alert("Username is taken");
            return;
        }
        const data = { username: userText };
        // add the username to the user in the database
        await axios
            .post("/api/update-username", data)
            .then((res) => {
                router.push("/");
            })
            .catch((err) => {
                alert("Error Creating Usernames " + err.message);
            });
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.titleContainer}>
                    <h2 className={styles.title}>Setup your account</h2>
                    <div className={styles.horizontalLine}></div>
                </div>

                <div className={styles.inputContainer}>
                    <p className={styles.description}>
                        Your username will be public and used to show your
                        results on the leaderboards.
                    </p>
                    <input
                        type="text"
                        placeholder="username"
                        value={userText}
                        onChange={(e) => setUserText(e.target.value)}
                    />
                    <p className={styles.label}>{warningMessage}</p>
                </div>
                <button
                    onClick={() => {
                        submitUsername();
                    }}
                >
                    Continue
                </button>
            </div>
        </main>
    );
};

export default UserSetup;
