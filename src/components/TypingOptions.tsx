import React, { useState, useRef } from "react";
import styles from "@/styles/TypingOptions.module.css";

type props = {
    testType: string;
    setTestType: (testType: string) => void;
    setWordCount: (wordCount: number) => void;
    setTime: (time: number) => void;
    focusTypingArea: () => void;
    time: number;
    wordCount: number;
    setIsComplete: (isComplete: boolean) => void;
    stopTimer: () => void;
};

const TypingOptions = ({
    testType,
    setTestType,
    setWordCount,
    setTime,
    focusTypingArea,
    time,
    wordCount,
    setIsComplete,
    stopTimer,
}: props) => {
    const [options, setOptions] = useState([
        {
            name: "time",
            testType: "time",
            sub: [15, 30, 60, 120, 300],
        },
        {
            name: "words",
            testType: "wordCount",
            sub: [10, 25, 50, 100, 200],
        },
    ]);

    const Menu = () => {
        return (
            <>
                <div id="mainOptions" className={styles.mainOptions}>
                    {options.map((option, index) => {
                        return (
                            <button
                                key={index}
                                className={`${
                                    option.testType === testType
                                        ? styles.activeButton
                                        : styles.inactiveButton
                                }`}
                                onClick={() => {
                                    setTestType(option.testType);
                                    stopTimer();
                                    setIsComplete(false);
                                }}
                            >
                                {option.name}
                            </button>
                        );
                    })}
                </div>
                <p className={styles.divider}>|</p>
                <div className={styles.subOptions}>
                    {options.map((option, index) => {
                        return (
                            option.testType === testType &&
                            option.sub.map((subOption, index) => {
                                var isActive = false;
                                if (option.testType === testType) {
                                    if (testType === "time") {
                                        isActive = subOption === time;
                                    }
                                    if (testType === "wordCount") {
                                        isActive = subOption === wordCount;
                                    }
                                }
                                return (
                                    <button
                                        key={index}
                                        className={`${
                                            isActive
                                                ? styles.activeSubButton
                                                : styles.inactiveSubButton
                                        }`}
                                        onClick={() => {
                                            testType === "time"
                                                ? setTime(subOption)
                                                : setWordCount(subOption);
                                            stopTimer();
                                            setIsComplete(false);
                                        }}
                                    >
                                        {subOption}
                                    </button>
                                );
                            })
                        );
                    })}
                </div>
            </>
        );
    };

    return (
        <>
            <main className={styles.main} onClick={focusTypingArea}>
                <Menu />
            </main>
        </>
    );
};

export default TypingOptions;
