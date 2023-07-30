"use client";
import React, { useState, useEffect } from "react";
import styles from "@/styles/CreateUsername.module.css";
import axios from "axios";
import { useRouter } from "next/navigation";

const CreateUsername = () => {
    const router = useRouter();
    const [usernames, setUsernames] = useState<string[]>([]);
    const [userText, setUserText] = useState("");
    const [showLabel, setShowLabel] = useState(false);
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
            setShowLabel(true);
        } else {
            setShowLabel(false);
        }
    }, [userText]);

    const submitUsername = async () => {
        if (showLabel) {
            alert("Username is taken");
        } else {
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
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <h2 className={styles.title}>Create your username</h2>
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
                    {showLabel && (
                        <p className={styles.label}>username is taken</p>
                    )}
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

export default CreateUsername;
