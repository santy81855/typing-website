"use client";
import React, { useState, useEffect, useRef, MutableRefObject } from "react";
import { english } from "@/lib/words";
import styles from "./page.module.css";
import TypingSection from "@/components/TypingSection";
import TypingOptions from "@/components/TypingOptions";
import TestInformation from "@/components/TestInformation";
import { useSession } from "next-auth/react";

export default function Home() {
    const { data: session } = useSession();
    const [isComplete, setIsComplete] = useState(false);
    const [passage, setPassage] = useState([""]);
    const [testType, setTestType] = useState("wordCount"); // "time" or "wordCount"
    const [wordCount, setWordCount] = useState(50); // number of words to type
    const [time, setTime] = useState(60); // number of seconds to type for
    const [wpm, setWpm] = useState(0); // words per minute
    const [numChars, setNumChars] = useState(0); // number of characters to type
    const [numErrors, setNumErrors] = useState(0); // number of errors made while typing
    const [accuracy, setAccuracy] = useState(""); // accuracy of typing

    // create a reference for the main typing area
    const typingAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // create a random assortment of 100 words from the 'english' array that will be loaded by default
        setNumErrors(0);
        const randomPassage = [];
        // if the user is taking a word count test, then create a random assortment of words from the 'english' array
        if (testType === "wordCount") {
            for (let i = 0; i < wordCount; i++) {
                const randomIndex = Math.floor(Math.random() * english.length);
                randomPassage.push(english[randomIndex].toLocaleLowerCase());
            }
        }
        // if the user is taking a time test, then create enough words to ensure they don't run out of words to type
        else if (testType === "time") {
            // since the longest test is 300 seconds (5 minutes), we'll create 2000 words
            for (let i = 0; i < 2000; i++) {
                const randomIndex = Math.floor(Math.random() * english.length);
                randomPassage.push(english[randomIndex].toLocaleLowerCase());
            }
        }
        setPassage(randomPassage);
        // get the length of the characters in the passage
        const numChars = randomPassage.join("").length;
        setNumChars(numChars);
        // set focus to the main typing area
        focusTypingArea();
    }, [testType, wordCount, time]);

    useEffect(() => {
        setAccuracy(
            `${(((numChars - numErrors) / numChars) * 100).toFixed(2)}%`
        );
    }, [isComplete]);

    const focusTypingArea = () => {
        // set focus to the main typing area
        if (typingAreaRef.current !== null) {
            const typingArea = typingAreaRef.current as HTMLDivElement;
            typingArea.focus();
        }
    };

    return (
        <main className={styles.main}>
            <TypingOptions
                testType={testType}
                setTestType={setTestType}
                setWordCount={setWordCount}
                setTime={setTime}
                focusTypingArea={focusTypingArea}
            />
            {isComplete ? (
                <TestInformation
                    wpm={wpm}
                    numChars={numChars}
                    numErrors={numErrors}
                    accuracy={accuracy}
                />
            ) : (
                <div className={styles.typingContainer}>
                    <TypingSection
                        areaRef={typingAreaRef}
                        isComplete={isComplete}
                        setIsComplete={setIsComplete}
                        passage={passage}
                        setNumErrors={setNumErrors}
                        focusTypingArea={focusTypingArea}
                    />
                </div>
            )}
            {JSON.stringify(session, null, 2)}
        </main>
    );
}
