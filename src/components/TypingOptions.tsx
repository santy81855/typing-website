import React, { useState, useRef } from "react";
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
    const wordButtonRef = useRef<HTMLButtonElement>(null);
    const timeButtonRef = useRef<HTMLButtonElement>(null);
    const timeButton1Ref = useRef<HTMLButtonElement>(null);
    const timeButton2Ref = useRef<HTMLButtonElement>(null);
    const timeButton3Ref = useRef<HTMLButtonElement>(null);
    const timeButton4Ref = useRef<HTMLButtonElement>(null);
    const timeButton5Ref = useRef<HTMLButtonElement>(null);
    const wordButton1Ref = useRef<HTMLButtonElement>(null);
    const wordButton2Ref = useRef<HTMLButtonElement>(null);
    const wordButton3Ref = useRef<HTMLButtonElement>(null);
    const wordButton4Ref = useRef<HTMLButtonElement>(null);
    const wordButton5Ref = useRef<HTMLButtonElement>(null);
    // put all the time refs in a timeRefArary
    // put all the word refs in a wordRefArray
    const [timeRefArray, setTimeRefArray] = useState([
        timeButton1Ref,
        timeButton2Ref,
        timeButton3Ref,
        timeButton4Ref,
        timeButton5Ref,
    ]);
    const [wordRefArray, setWordRefArray] = useState([
        wordButton1Ref,
        wordButton2Ref,
        wordButton3Ref,
        wordButton4Ref,
        wordButton5Ref,
    ]);

    const focusButton = (
        refArray: React.MutableRefObject<HTMLButtonElement | null>[],
        index: number
    ) => {
        refArray[index].current?.classList.add(`${styles.activeSubButton}`);
        refArray[index].current?.classList.remove(`${styles.subButton}`);

        for (let i = 0; i < refArray.length; i++) {
            if (i !== index) {
                refArray[i].current?.classList.remove(
                    `${styles.activeSubButton}`
                );
                refArray[i].current?.classList.add(`${styles.subButton}`);
            }
        }
    };

    return (
        <>
            <main className={styles.main} onClick={focusTypingArea}>
                <div className={styles.mainOptions}>
                    <button
                        className={styles.activeButton}
                        onClick={() => {
                            wordButtonRef.current?.classList.remove(
                                `${styles.activeButton}`
                            );
                            timeButtonRef.current?.classList.add(
                                `${styles.activeButton}`
                            );
                            setTestType("time");
                        }}
                        ref={timeButtonRef}
                    >
                        time
                    </button>
                    <button
                        onClick={() => {
                            timeButtonRef.current?.classList.remove(
                                `${styles.activeButton}`
                            );
                            wordButtonRef.current?.classList.add(
                                `${styles.activeButton}`
                            );
                            setTestType("wordCount");
                        }}
                        ref={wordButtonRef}
                    >
                        words
                    </button>
                </div>

                <div className={styles.subOptions}>
                    {testType === "time" && (
                        <>
                            <button
                                className={`${styles.subButton}`}
                                onClick={() => {
                                    setTime(15);
                                    focusButton(timeRefArray, 0);
                                }}
                                ref={timeButton1Ref}
                            >
                                15
                            </button>
                            <button
                                className={`${styles.subButton}`}
                                onClick={() => {
                                    setTime(30);
                                    focusButton(timeRefArray, 1);
                                }}
                                ref={timeButton2Ref}
                            >
                                30
                            </button>
                            <button
                                className={`${styles.activeSubButton}`}
                                onClick={() => {
                                    setTime(60);
                                    focusButton(timeRefArray, 2);
                                }}
                                ref={timeButton3Ref}
                            >
                                60
                            </button>
                            <button
                                className={`${styles.subButton}`}
                                onClick={() => {
                                    setTime(120);
                                    focusButton(timeRefArray, 3);
                                }}
                                ref={timeButton4Ref}
                            >
                                120
                            </button>
                            <button
                                className={`${styles.subButton}`}
                                onClick={() => {
                                    setTime(300);
                                    focusButton(timeRefArray, 4);
                                }}
                                ref={timeButton5Ref}
                            >
                                300
                            </button>
                        </>
                    )}
                    {testType === "wordCount" && (
                        <>
                            <button
                                className={`${styles.subButton}`}
                                onClick={() => {
                                    setWordCount(10);
                                    focusButton(wordRefArray, 0);
                                }}
                                ref={wordButton1Ref}
                            >
                                10
                            </button>
                            <button
                                className={`${styles.subButton}`}
                                onClick={() => {
                                    setWordCount(25);
                                    focusButton(wordRefArray, 1);
                                }}
                                ref={wordButton2Ref}
                            >
                                25
                            </button>
                            <button
                                className={`${styles.activeSubButton}`}
                                onClick={() => {
                                    setWordCount(50);
                                    focusButton(wordRefArray, 2);
                                }}
                                ref={wordButton3Ref}
                            >
                                50
                            </button>
                            <button
                                className={`${styles.subButton}`}
                                onClick={() => {
                                    setWordCount(100);
                                    focusButton(wordRefArray, 3);
                                }}
                                ref={wordButton4Ref}
                            >
                                100
                            </button>
                            <button
                                className={`${styles.subButton}`}
                                onClick={() => {
                                    setWordCount(200);
                                    focusButton(wordRefArray, 4);
                                }}
                                ref={wordButton5Ref}
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
