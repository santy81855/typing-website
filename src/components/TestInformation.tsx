import React from "react";
import styles from "@/styles/TestInformation.module.css";

type props = {
    accuracy: string;
    wpm: number;
    numChars: number;
    numErrors: number;
};

const TestInformation = ({ accuracy, wpm, numChars, numErrors }: props) => {
    return (
        <main>
            <div className={styles.main}>Accuracy: {accuracy}</div>
            <div className={styles.main}>WPM: {wpm}</div>
        </main>
    );
};

export default TestInformation;
