"use client";
import React, { useState, useEffect, useRef, MutableRefObject } from "react";
import { english100, english500, english1000 } from "@/lib/words";
import styles from "./page.module.css";
import Rain from "@/components/Rain";
import TypingSection, { TypingSectionRef } from "@/components/TypingSection";
import TypingOptions from "@/components/TypingOptions";
import RefreshTestButton from "@/components/RefreshTestButton";
import TestInformation from "@/components/TestInformation";
import { useSession } from "next-auth/react";
import axios from "axios";
import settings from "@/lib/settings.json";

export default function Home() {
    const { data: session, status } = useSession();
    const [isComplete, setIsComplete] = useState(false);
    const [passage, setPassage] = useState([""]);
    const [testType, setTestType] = useState("time"); // "time" or "wordCount"
    const [wordCount, setWordCount] = useState(50); // number of words to type
    const [time, setTime] = useState(60); // number of seconds to type for
    const [timeTaken, setTimeTaken] = useState(0); // number of seconds taken to type
    const [wpm, setWpm] = useState(0); // words per minute
    const [wordsTypedCorrectly, setWordsTypedCorrectly] = useState<string[]>(
        []
    ); // array of words typed correctly
    const [wpmRaw, setWpmRaw] = useState(0); // words per minute without accountinf for wrong words
    const [cpm, setCpm] = useState(0); // characters per minute
    const [totalCharsTyped, setTotalCharsTyped] = useState(0); // total number of characters typed
    const [numIncorrectWords, setNumIncorrectWords] = useState(0); // total number of words typed incorrectly
    const [numCorrectWords, setNumCorrectWords] = useState(0); // total number of correct words typed
    const [numErrors, setNumErrors] = useState(0); // number of errors made while typing
    const [wordAccuracy, setWordAccuracy] = useState(""); // accuracy of getting words correct
    const [characterAccuracy, setCharacterAccuracy] = useState(""); // accuracy of getting characters correct
    const [startTime, setStartTime] = useState(0); // time when the user starts typing
    const [endTime, setEndTime] = useState(0); // time when the user finishes typing
    const [wordFile, setWordFile] = useState(english100); // the file of words to use for the test
    const [restartTestState, setRestartTestState] = useState(false); // whether or not to restart the test
    const [curTime, setCurTime] = useState(0); // current time
    const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined); // timer for the test

    // create a reference for the main typing area
    const typingAreaRef = useRef<HTMLDivElement>(null);
    // reference to the passage
    const passageRef = useRef<HTMLDivElement>(null);
    // create a reference for the typing component
    const typingSectionRef = useRef<TypingSectionRef>(null);

    useEffect(() => {
        stopTimer();
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
                    randomPassage.push(getRandomWord());
                }
            }
            // if the user is taking a time test, then create enough words to ensure they don't run out of words to type
            else if (testType === "time") {
                // since the longest test is 300 seconds (5 minutes), we'll create 2000 words
                for (let i = 0; i < 100; i++) {
                    randomPassage.push(getRandomWord());
                }
            }
            setPassage(randomPassage);
            if (passageRef.current !== null) {
                passageRef.current.style.opacity = "1";
            }
            focusTypingArea();
        }, 300);
        // create a random assortment of 100 words from the 'english' array that will be loaded by default
        setNumErrors(0);
        setNumCorrectWords(0);
        setNumIncorrectWords(0);
        setTotalCharsTyped(0);
        setWordsTypedCorrectly([]);
    }, [testType, wordCount, time, restartTestState]);

    useEffect(() => {
        console.log(`startTime = ${startTime} and endTime = ${endTime} totalTime = ${
            endTime - startTime
        } numCorrectWords = ${numCorrectWords} numIncorrectWords = ${numIncorrectWords} numErrors = ${numErrors} totalCharsTyped = ${totalCharsTyped}
        `);
        var totalTime = 0;
        if (testType === "time") {
            setTimeTaken(endTime - startTime);
            totalTime = endTime - startTime;
        } else if (testType === "wordCount") {
            setTimeTaken((endTime - startTime) / 1000);
            totalTime = (endTime - startTime) / 1000;
        }
        console.log(totalTime);

        setWordAccuracy(
            `${(
                (numCorrectWords / (numCorrectWords + numIncorrectWords)) *
                100
            ).toFixed(2)}%`
        );
        setCharacterAccuracy(
            `${(
                ((totalCharsTyped - numErrors) / totalCharsTyped) *
                100
            ).toFixed(2)}%`
        );
        // we will calculate wpm by considering the average word to be 5 characters long
        // so first get the length of all the characters in the wordsTypedCorrectly array
        // then divide by 5 to get the number of words typed correctly
        var sumOfChars = 0;
        wordsTypedCorrectly.forEach((word) => {
            sumOfChars += word.length;
        });
        sumOfChars = sumOfChars /= 4; // < numCorrectWords ? numCorrectWords : sumOfChars / 4;
        setWpm(Math.round((sumOfChars * 60) / totalTime) || 0);
        setWpmRaw(
            Math.round(((sumOfChars + numIncorrectWords) * 60) / totalTime) || 0
        );
        setCpm(
            Math.round(((totalCharsTyped - numErrors) * 60) / totalTime) || 0
        );
        if (isComplete === true) {
            const data = {
                type: testType,
                time: totalTime,
                numCorrectWords: numCorrectWords,
                numIncorrectWords: numIncorrectWords,
                numCorrectCharacters: totalCharsTyped - numErrors,
                numIncorrectCharacters: numErrors,
                wordAccuracy:
                    (numCorrectWords / (numCorrectWords + numIncorrectWords)) *
                    100,
                characterAccuracy:
                    ((totalCharsTyped - numErrors) / totalCharsTyped) * 100,
                wpm: Math.round((sumOfChars * 60) / totalTime) || 0,
                wpmRaw:
                    Math.round(
                        ((sumOfChars + numIncorrectWords) * 60) / totalTime
                    ) || 0,
                cpm:
                    Math.round(
                        ((totalCharsTyped - numErrors) * 60) / totalTime
                    ) || 0,
            };
            if (status === "authenticated") {
                addResult(data);
            }
        }
    }, [isComplete]);

    useEffect(() => {
        if (timer) {
            const interval = setInterval(() => {
                if (curTime > 0) {
                    setCurTime(curTime - 1);
                }
            }, 1000); // Update every second

            return () => clearInterval(interval); // Clean up on component unmount
        }
    }, [curTime]);

    // useEffect that will get the user at the start of a session
    useEffect(() => {
        // get the user and their settings
        const getUser = async () => {
            await axios
                .get("/api/user")
                .then((res) => {
                    // if the local storage doesn't have the settings stored then store them
                    if (localStorage.getItem("settings") === null) {
                        localStorage.setItem(
                            "settings",
                            JSON.stringify(res.data.settings)
                        );
                    }
                })
                .catch((err) => {
                    alert("Error Fetching User " + err.message);
                });
        };
        // only get the user and settings if the user is logged in
        if (status === "authenticated") {
            getUser();
        } else if (status === "unauthenticated") {
            // if the user is not logged in, then get the default settings file if there is not already one
            if (localStorage.getItem("settings") === null) {
                localStorage.setItem("settings", JSON.stringify(settings));
            }
        }
    }, []);

    const startTimer = () => {
        console.log("current timer = " + timer);
        if (timer) stopTimer();
        setTimer(
            setTimeout(() => {
                if (typingSectionRef.current) {
                    typingSectionRef.current.testFinished();
                }
            }, time * 1000)
        );
        // immediately start the countdown
        setCurTime(time);
    };

    const stopTimer = () => {
        console.log(timer);
        clearTimeout(timer);
        setTimer(undefined);
    };

    const getRandomWord = () => {
        const randomIndex = Math.floor(Math.random() * wordFile.length);
        return wordFile[randomIndex];
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

    const restartTest = () => {
        setIsComplete(false);
        setRestartTestState(!restartTestState);
    };

    const addResult = async (data: {
        type: string;
        time: number;
        numCorrectWords: number;
        numIncorrectWords: number;
        numCorrectCharacters: number;
        numIncorrectCharacters: number;
        wordAccuracy: number;
        characterAccuracy: number;
        wpm: number;
        wpmRaw: number;
        cpm: number;
    }) => {
        // post request with axios
        axios
            .post("/api/add-result", data)
            .then(() => {
                alert("Result has been added.");
            })
            .catch((res) => alert(res));
    };

    return (
        <main className={styles.main}>
            {isComplete ? (
                <div className={styles.testResultContainer}>
                    <TestInformation
                        wordAccuracy={wordAccuracy}
                        characterAccuracy={characterAccuracy}
                        wpm={wpm}
                        wpmRaw={wpmRaw}
                        cpm={cpm}
                        numErrors={numErrors}
                        testType={testType}
                        wordCount={wordCount}
                        time={time}
                        timeTaken={timeTaken}
                        totalCharsTyped={totalCharsTyped}
                    />
                </div>
            ) : (
                <>
                    {timer && <p className={styles.countdown}>{curTime}</p>}
                    <div className={styles.typingOptionsContainer}>
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
                    </div>
                    <div className={styles.typingContainer}>
                        <TypingSection
                            ref={typingSectionRef}
                            areaRef={typingAreaRef}
                            passageRef={passageRef}
                            setIsComplete={setIsComplete}
                            passage={passage}
                            setPassage={setPassage}
                            setNumErrors={setNumErrors}
                            numErrors={numErrors}
                            setStartTime={setStartTime}
                            setEndTime={setEndTime}
                            testType={testType}
                            getRandomWord={getRandomWord}
                            time={time}
                            startTimer={startTimer}
                            setTotalCharsTyped={setTotalCharsTyped}
                            totalCharsTyped={totalCharsTyped}
                            setNumIncorrectWords={setNumIncorrectWords}
                            numIncorrectWords={numIncorrectWords}
                            setNumCorrectWords={setNumCorrectWords}
                            numCorrectWords={numCorrectWords}
                            setWordsTypedCorrectly={setWordsTypedCorrectly}
                            wordsTypedCorrectly={wordsTypedCorrectly}
                            restartTest={restartTest}
                        />
                    </div>
                </>
            )}
            <div className={styles.refreshButton}>
                <RefreshTestButton restartTest={restartTest} />
            </div>
            <Rain />
        </main>
    );
}
