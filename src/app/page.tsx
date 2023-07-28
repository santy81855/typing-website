"use client";
import React, { useState, useEffect, useRef, MutableRefObject } from "react";
import { english } from "@/lib/words";
import styles from "./page.module.css";
import Rain from "@/components/Rain";
import TypingSection, { TypingSectionRef } from "@/components/TypingSection";
import TypingOptions from "@/components/TypingOptions";
import TestInformation from "@/components/TestInformation";
import { useSession } from "next-auth/react";

export default function Home() {
    const { data: session } = useSession();
    const [isComplete, setIsComplete] = useState(false);
    const [passage, setPassage] = useState([""]);
    const [testType, setTestType] = useState("time"); // "time" or "wordCount"
    const [wordCount, setWordCount] = useState(50); // number of words to type
    const [time, setTime] = useState(60); // number of seconds to type for
    const [wpm, setWpm] = useState(0); // words per minute
    const [numChars, setNumChars] = useState(0); // number of characters to type
    const [totalCharsTyped, setTotalCharsTyped] = useState(0); // total number of characters typed
    const [numWordsTyped, setNumWordsTyped] = useState(0); // total number of words typed
    const [numCorrectWords, setNumCorrectWords] = useState(0); // total number of correct words typed
    const [numErrors, setNumErrors] = useState(0); // number of errors made while typing
    const [accuracy, setAccuracy] = useState(""); // accuracy of typing
    const [startTime, setStartTime] = useState(0); // time when the user starts typing
    const [endTime, setEndTime] = useState(0); // time when the user finishes typing
    const [wordFile, setWordFile] = useState(english); // the file of words to use for the test
    var timer: string | number | NodeJS.Timeout | undefined;

    // create a reference for the main typing area
    const typingAreaRef = useRef<HTMLDivElement>(null);
    // reference to the passage
    const passageRef = useRef<HTMLDivElement>(null);
    // create a reference for the typing component
    const typingSectionRef = useRef<TypingSectionRef>(null);

    useEffect(() => {
        // set focus to the main typing area and fade it in
        if (passageRef.current !== null) {
            passageRef.current.style.opacity = "0";
            passageRef.current.style.top = "0";
        }
        setTimeout(() => {
            const randomPassage = [];
            // if the user is taking a word count test, then create a random assortment of words from the 'english' array
            if (testType === "wordCount") {
                for (let i = 0; i < wordCount; i++) {
                    randomPassage.push(getRandomWordLower());
                }
            }
            // if the user is taking a time test, then create enough words to ensure they don't run out of words to type
            else if (testType === "time") {
                // since the longest test is 300 seconds (5 minutes), we'll create 2000 words
                for (let i = 0; i < 100; i++) {
                    randomPassage.push(getRandomWordLower());
                }
            }
            setPassage(randomPassage);
            // get the length of the characters in the passage
            const numChars = randomPassage.join("").length;
            if (passageRef.current !== null) {
                passageRef.current.style.opacity = "1";
            }
            focusTypingArea();
        }, 300);
        // create a random assortment of 100 words from the 'english' array that will be loaded by default
        setNumErrors(0);
        setNumChars(numChars);
        stopTimer();
    }, [testType, wordCount, time]);

    useEffect(() => {
        setAccuracy(
            `${(((numChars - numErrors) / numChars) * 100).toFixed(2)}%`
        );
        setWpm(
            Math.round(
                ((numChars / 5) * 60) / ((endTime - startTime) / 1000)
            ) || 0
        );
    }, [isComplete]);

    const startTimer = () => {
        stopTimer();
        timer = setTimeout(() => {
            if (typingSectionRef.current) {
                typingSectionRef.current.testFinished();
            }
        }, time * 1000);
    };

    const stopTimer = () => {
        clearTimeout(timer);
    };

    const getRandomWordLower = () => {
        const randomIndex = Math.floor(Math.random() * wordFile.length);
        return wordFile[randomIndex].toLocaleLowerCase();
    };

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
                time={time}
                setWordCount={setWordCount}
                wordCount={wordCount}
                setTime={setTime}
                focusTypingArea={focusTypingArea}
                setIsComplete={setIsComplete}
                stopTimer={stopTimer}
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
                        ref={typingSectionRef}
                        areaRef={typingAreaRef}
                        passageRef={passageRef}
                        setIsComplete={setIsComplete}
                        passage={passage}
                        setNumErrors={setNumErrors}
                        focusTypingArea={focusTypingArea}
                        setStartTime={setStartTime}
                        setEndTime={setEndTime}
                        testType={testType}
                        getRandomWordLower={getRandomWordLower}
                        time={time}
                        startTimer={startTimer}
                    />
                </div>
            )}
            {JSON.stringify(session, null, 2)}
            <Rain />
        </main>
    );
}
