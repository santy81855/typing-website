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
import settings from "@/lib/settings.json";

const UserSetup = () => {
    const matcher = new RegExpMatcher({
        ...englishDataset.build(),
        ...englishRecommendedTransformers,
    });
    const router = useRouter();
    const [usernames, setUsernames] = useState<string[]>([]);
    const [userText, setUserText] = useState("");
    const [warningMessage, setWarningMessage] = useState("");
    const [step, setStep] = useState(0);

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

        // add the settings to the local storage if they are not already there
        if (localStorage.getItem("settings") === null) {
            localStorage.setItem("settings", JSON.stringify(settings));
        }
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

    const updateUser = async () => {
        const data = { username: userText, settings: settings };
        // add the username to the user in the database
        await axios
            .post("/api/update-user", data)
            .then((res) => {
                router.push("/");
            })
            .catch((err) => {
                alert("Error Updating User " + err.message);
            });
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.titleContainer}>
                    <h2 className={styles.title}>Setup your account</h2>
                    <div className={styles.horizontalLine}></div>
                </div>

                {step === 0 && (
                    <div className={styles.inputContainer}>
                        <p className={styles.stepTitle}>
                            Step 1 - Choose your username
                        </p>
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
                )}
                {step === 1 && (
                    <div className={styles.settingsContainer}>
                        <p className={styles.stepTitle}>
                            Step 2 - Choose your theme
                        </p>
                        <p className={styles.description}>
                            You can change your theme at any point by clicking
                            on the settings icon in the top right corner.
                        </p>
                        <div className={styles.presetContainer}>
                            ALL PRESETS
                            {settings.themes.map(
                                (preset: any, index: number) => {
                                    return (
                                        <div
                                            key={index}
                                            className={styles.preset}
                                        >
                                            <p>{preset.name}</p>
                                            {JSON.stringify(preset)}
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                )}
                <div className={styles.buttonContainer}>
                    {step === 1 && (
                        <button
                            onClick={() => {
                                if (step === 1) {
                                    setStep(0);
                                }
                            }}
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (step === 0) {
                                updateUser();
                            }
                            if (step === 1) {
                                updateUser();
                            }
                        }}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </main>
    );
};

export default UserSetup;
