"use client";
import styles from "@/styles/TypingArea.module.css";
import React, { useState, useEffect } from "react";

type InputArray = JSX.Element[];

const TypingArea = () => {
    useEffect(() => {
        createTextArray();
        createUserInputArray();
    }, []);

    var wordArray = ["hi", "hello", "bye", "goodbye"];
    const [textArray, setTextArray] = useState<InputArray>([]);
    const [userInput, setUserInput] = useState<InputArray>([]);
    var curLetterIndex = 0;
    var curWordIndex = 0;
    const [numExtraLetters, setNumExtraLetters] = useState(0);
    const [numIncorrectChars, setNumIncorrectChars] = useState(0);
    const [firstWrongIndex, setFirstWrongIndex] = useState(-1);

    var letterStack = [];
    /*
    const userTyping = (e) => {
        
        // if e.nativeEvent.inputType === "deleteContentBackward" then the user is backspacing
        const n = text.length;
        const curIndex = e.target.value.length - 1;
        const typedText = e.target.value;
        const element = e.target;

        // user types a letter
        if (e.nativeEvent.inputType === "insertText") {
            // add the new letter they just typed
            setUserInput(typedText);
            const typedLetter = e.nativeEvent.data;
            const correctLetter = text[curIndex];
            // if they typed the incorrect letter
            if (typedLetter !== correctLetter) {
                // change the text color to red
                element.style.color = "red";
                // increment the number of incorrect characters
                setNumIncorrectChars(numIncorrectChars + 1);
                // if this is the first wrong letter
                if (firstWrongIndex === -1) {
                    // set the first wrong index
                    setFirstWrongIndex(curIndex);
                }
                // if the correct character is a space
                if (correctLetter === " ") {
                    // increment the number of extra letters
                    setNumExtraLetters(numExtraLetters + 1);
                    // insert the typed letter into the text
                    setText(
                        text.slice(0, curIndex) +
                            typedLetter +
                            text.slice(curIndex)
                    );
                }
            }
        }

        // user backspaces
        else if (e.nativeEvent.inputType === "deleteContentBackward") {
            console.log(curIndex);
            // if it we are at the start of a word
            if (text[curIndex + 1] === " ") {
                e.preventDefault();
            }
        }
        
    };
    */

    const inputDivClicked = (e) => {
        e.preventDefault();
        console.log(curLetterIndex);
        // set focus to the current letter on the current word
        const activeLetter = document.getElementById(
            `userLetter${curWordIndex}${curLetterIndex}`
        );
        if (activeLetter === null) {
            return;
        }
        console.log(activeLetter);
        activeLetter.focus();
    };

    const focusNextWord = () => {
        curWordIndex += 1;
        curLetterIndex = 0;
        // set the focus to the first letter of the next word
        const nextLetter = document.getElementById(
            `userLetter${curWordIndex}${curLetterIndex}`
        );
        if (nextLetter === null) {
            return;
        }
        nextLetter.focus();
    };

    const focusNextLetter = () => {
        curLetterIndex += 1;
        // set the focus to the next letter in the word
        const nextLetter = document.getElementById(
            `userLetter${curWordIndex}${curLetterIndex}`
        );
        if (nextLetter === null) {
            return;
        }
        nextLetter.focus();
    };

    const handleUserInput = (e) => {
        // prevent the default behavior of the input element
        console.log(e.target);
        // get the letter that we need to type
        const correctLetter = document.getElementById(
            `letter${curWordIndex}${curLetterIndex}`
        );
        if (correctLetter === null) {
            return;
        }
        const typedLetter = e.key;

        // if the user types a space
        if (typedLetter === " ") {
            // if the space is the correct key then treat it like normal
            if (typedLetter === correctLetter.innerText) {
                // clear the stack
                letterStack = [];
                // add the letter to the user input
                //e.target.innerText = typedLetter;
                // set focus to the next letter
                focusNextWord();
            }
            // if the space is the wrong key
            else {
                e.preventDefault();
                // if this was the last word then just end the typing test
                if (curWordIndex === wordArray.length - 1) {
                    console.log("finished typing");
                    return;
                }
                // clear the stack
                letterStack = [];
                // add all missing letters with an invisible class
                const wordElement = document.getElementById(
                    `word${curWordIndex}`
                );
                const inputWordElement = document.getElementById(
                    `userWord${curWordIndex}`
                );
                if (wordElement === null || inputWordElement === null) {
                    return;
                }
                const wordLength = wordElement.innerText.length;

                // add the missing letters plus the space
                var start = curLetterIndex;
                for (let i = start - 1; i < wordLength; i++) {
                    const letter = document.getElementById(
                        `userLetter${curWordIndex}${i}`
                    );
                    const correctLetter = document.getElementById(
                        `letter${curWordIndex}${i}`
                    );
                    if (letter === null || correctLetter === null) {
                        return;
                    }
                    console.log(
                        `starting on letter ${correctLetter.innerText} which is currently ${letter.innerText}`
                    );
                    console.log(letter);
                    letter.classList.add(styles.incorrect);
                    letter.textContent = correctLetter.innerText;
                    curLetterIndex++;
                }
                focusNextWord();
            }
            return;
        }
        // if the user typed the correct letter
        if (typedLetter === correctLetter.innerText) {
            // remove the "wrong" class from the letter
            e.target.classList.remove(styles.wrong);
            // add the "correct" class to the letter
            e.target.classList.add(styles.correct);
            // add the letter to the letter stack
            letterStack.push(typedLetter);
            // add the letter to the user input
            //e.target.textContent = typedLetter;
            // focus the next letter
            focusNextLetter();
        }
        // if the user typed the wrong letter
        else {
            console.log("wrong");
        }
    };

    const createTextArray = () => {
        // for every word in the array creat an input element
        setTextArray(
            wordArray.map((word, wordIndex) => {
                return (
                    <div
                        key={wordIndex}
                        id={`word${wordIndex}`}
                        className={`${styles.word}`}
                        onClick={inputDivClicked}
                    >
                        {word.split("").map((letter, letterIndex) => {
                            return (
                                <div
                                    key={letterIndex}
                                    id={`letter${wordIndex}${letterIndex}`}
                                    className={styles.letter}
                                    onClick={inputDivClicked}
                                >
                                    {letter}
                                </div>
                            );
                        })}
                        {wordIndex !== wordArray.length - 1 ? (
                            <div
                                className={styles.letter}
                                id={`letter${wordIndex}${word.length}`}
                                onClick={inputDivClicked}
                            >
                                {" "}
                            </div>
                        ) : null}
                    </div>
                );
            })
        );
    };

    const createUserInputArray = () => {
        setUserInput(
            wordArray.map((word, wordIndex) => {
                return (
                    <div
                        key={wordIndex}
                        id={`userWord${wordIndex}`}
                        className={`${styles.word}`}
                        onClick={inputDivClicked}
                    >
                        {word.split("").map((letter, letterIndex) => {
                            return (
                                <div
                                    key={letterIndex}
                                    id={`userLetter${wordIndex}${letterIndex}`}
                                    className={styles.letter}
                                    contentEditable={true}
                                    onKeyDown={handleUserInput}
                                    onInput={(e) => {
                                        console.log(e.target);
                                    }}
                                    onClick={inputDivClicked}
                                ></div>
                            );
                        })}
                        {wordIndex !== wordArray.length - 1 ? (
                            <div
                                className={styles.letter}
                                id={`userLetter${wordIndex}${word.length}`}
                                contentEditable={true}
                                onKeyDown={handleUserInput}
                                onInput={(e) => {
                                    console.log(e.target);
                                }}
                                onClick={inputDivClicked}
                            ></div>
                        ) : null}
                    </div>
                );
            })
        );
        // wait a second and then focus on the first input element
        setTimeout(() => {
            console.log(curLetterIndex);
            const firstInput = document.getElementById(
                `userLetter${curWordIndex}${curLetterIndex}`
            );
            if (firstInput !== null) {
                firstInput.focus();
            }
        }, 2);
        console.log(userInput);
    };

    return (
        <main className={styles.main}>
            <div className={styles.textContainer}>{textArray}</div>
            <div className={styles.textContainer}>{userInput}</div>
        </main>
    );
};

export default TypingArea;
