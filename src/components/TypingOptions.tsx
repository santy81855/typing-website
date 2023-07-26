import React, { useState } from "react";
import styles from "@/styles/TypingOptions.module.css";

type props = {
    testType: string;
    setTestType: (testType: string) => void;
    setWordCount: (wordCount: number) => void;
    setTime: (time: number) => void;
    focusTypingArea: () => void;
};

const TypingOptions = ({
    testType,
    setTestType,
    setWordCount,
    setTime,
    focusTypingArea,
}: props) => {
    return (
        <>
            <main className={styles.main} onClick={focusTypingArea}>
                <div className={styles.mainOptions}>
                    <button
                        onClick={() => {
                            setTestType("time");
                        }}
                    >
                        time
                    </button>
                    <button
                        onClick={() => {
                            setTestType("wordCount");
                        }}
                    >
                        words
                    </button>
                </div>
                <div className={styles.subOptions}>
                    {testType === "time" && (
                        <>
                            <button
                                onClick={() => {
                                    setTime(15);
                                }}
                            >
                                15
                            </button>
                            <button
                                onClick={() => {
                                    setTime(30);
                                }}
                            >
                                30
                            </button>
                            <button
                                onClick={() => {
                                    setTime(60);
                                }}
                            >
                                60
                            </button>
                            <button
                                onClick={() => {
                                    setTime(120);
                                }}
                            >
                                120
                            </button>
                            <button
                                onClick={() => {
                                    setTime(300);
                                }}
                            >
                                300
                            </button>
                        </>
                    )}
                    {testType === "wordCount" && (
                        <>
                            <button
                                onClick={() => {
                                    setWordCount(10);
                                }}
                            >
                                10
                            </button>
                            <button
                                onClick={() => {
                                    setWordCount(25);
                                }}
                            >
                                25
                            </button>
                            <button
                                onClick={() => {
                                    setWordCount(50);
                                }}
                            >
                                50
                            </button>
                            <button
                                onClick={() => {
                                    setWordCount(100);
                                }}
                            >
                                100
                            </button>
                            <button
                                onClick={() => {
                                    setWordCount(200);
                                }}
                            >
                                200
                            </button>
                        </>
                    )}
                </div>
            </main>
        </>
    );
};

export default TypingOptions;
