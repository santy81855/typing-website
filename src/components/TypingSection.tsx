"use client";
import styles from "@/styles/TypingArea.module.css";
import React, { useState, useEffect } from "react";

type InputArray = JSX.Element[];
type props = {
    setIsComplete: (isComplete: boolean) => void;
};

const TypingSection = ({ setIsComplete }: props) => {
    useEffect(() => {
        createTextArray();
    }, []);

    var wordArray = ["word1", "word2", "word3", "word4"];
    const [textArray, setTextArray] = useState<InputArray>([]);
    const [userInput, setUserInput] = useState<InputArray>([]);
    var curLetterIndex = 0;
    var curWordIndex = 0;
    var cursorPositionX = 0;
    var cursorPositionY = 0;
    var numIncorrectChars = 0;
    const [numExtraLetters, setNumExtraLetters] = useState(0);
    const [firstWrongIndex, setFirstWrongIndex] = useState(-1);

    var letterStack: string[] = [];

    const moveCursor = (direction: string, type: string) => {
        if (direction === "backward" && type === "word") {
            curLetterIndex--;
        }
        // get the new active letter
        var activeLetter = document.getElementById(
            `letter${curWordIndex}${curLetterIndex}`
        );
        // get the cursor
        var cursor = document.getElementById("cursor");
        // make the active letter the parent of the cursor
        if (cursor === null || activeLetter === null) {
            return;
        }
        // get the current position of the cursor and active letter
        var cursorRect = cursor.getBoundingClientRect();
        var activeLetterRect = activeLetter.getBoundingClientRect();
        // get the difference between the cursor and the active letter
        if (direction === "forward") {
            // if its the start of a letter we want to move the cursor to the left of the letter
            if (type === "word") {
                var diffX = activeLetterRect.left - cursorRect.left;
            } else {
                var diffX = activeLetterRect.right - cursorRect.right;
            }
        }
        // if moving cursor backward
        else {
            if (type === "word") {
                var diffX = activeLetterRect.right - cursorRect.right;
                curLetterIndex++;
            } else {
                var diffX = activeLetterRect.left - cursorRect.left;
            }
        }
        var diffY = activeLetterRect.top - cursorRect.top;
        // translate the cursor to the left of the active letter
        cursor.style.transform = `translate(${cursorPositionX + diffX}px, ${
            cursorPositionY + diffY
        }px)`;
        cursorPositionX += diffX;
        cursorPositionY += diffY;
    };

    const inputDivClicked = (e) => {
        e.preventDefault();
    };

    const makeCorrect = (element: HTMLElement | Element) => {
        element.classList.add(styles.correct);
        element.classList.remove(styles.default);
        element.classList.remove(styles.incorrect);
    };

    const makeIncorrect = (element: HTMLElement | Element) => {
        element.classList.add(styles.incorrect);
        element.classList.remove(styles.default);
        element.classList.remove(styles.correct);
    };

    const makeDefault = (element: HTMLElement | Element) => {
        element.classList.add(styles.default);
        element.classList.remove(styles.correct);
        element.classList.remove(styles.incorrect);
    };

    const makeExtra = (element: HTMLElement | Element) => {
        element.classList.add(styles.extra);
        element.classList.remove(styles.default);
        element.classList.remove(styles.correct);
        element.classList.remove(styles.incorrect);
    };

    const typing = (e) => {
        const key = e.key;
        // get the len of the current word
        var curWordElement = document.getElementById(`word${curWordIndex}`);
        if (curWordElement === null) {
            return;
        }
        // get how many children curWordElement has
        // if it is the first word we subtract one because of the cursor
        var numLetters =
            curWordIndex === 0
                ? curWordElement.childElementCount - 1
                : curWordElement.childElementCount;
        // if we are out of bounds
        if (curLetterIndex == numLetters) {
            // if it is a letter
            if (key.length === 1) {
                // if the key is a space move to the next word
                if (key === " ") {
                    // if the user is on the last word
                    if (curWordIndex === wordArray.length - 1) {
                        // end the typing test
                        setIsComplete(true);
                        return;
                    }
                    curWordIndex++;
                    curLetterIndex = 0;
                    moveCursor("forward", "word");
                    // clear the stack
                    letterStack = [];
                    return;
                }
                // otherwise the user is adding extra letters to the word
                else {
                    // increment the number of incorrect letters
                    numIncorrectChars++;
                    // add a div element to the curWordElement as a new child
                    var newDiv = document.createElement("div");
                    newDiv.classList.add(styles.letter);
                    makeExtra(newDiv);
                    // give the newDiv an id
                    newDiv.id = `letter${curWordIndex}${curLetterIndex}`;
                    newDiv.innerText = key;
                    curWordElement.appendChild(newDiv);
                    // add the "remove" keyword to the stack
                    letterStack.push("remove");
                    moveCursor("forward", "letter");
                    curLetterIndex++;
                    return;
                }
            } else {
                if (key === "Backspace") {
                    // if the letter stack is empty then just normal delete
                    if (letterStack.length === 0) {
                        curLetterIndex--;
                        moveCursor("backward", "letter");
                        // get the current letter
                        var curLetter = document.getElementById(
                            `letter${curWordIndex}${curLetterIndex}`
                        );
                        if (curLetter !== null) {
                            makeDefault(curLetter);
                        }
                        return;
                    }
                    // if the letter stack is not empty then we need to remove the last letter
                    else {
                        // get the last child of the curWordElement
                        var lastChild = curWordElement.lastChild;
                        if (lastChild !== null) {
                            // remove the child
                            curWordElement.removeChild(lastChild);
                            // delete the lastChild element
                            lastChild = null;
                        }
                        // remove the last element from the stack
                        letterStack.pop();
                        curLetterIndex--;
                        moveCursor("backward", "word");
                        return;
                    }
                }
            }
        }
        // if the curLetterIndex is in bounds
        // get the new active letter
        var activeLetter = document.getElementById(
            `letter${curWordIndex}${curLetterIndex}`
        );
        if (activeLetter === null) {
            return;
        }
        // if it is a backspace
        if (key === "Backspace") {
            // if we are at the start of a word then do nothing
            if (curLetterIndex === 0) {
                return;
            }
            curLetterIndex--;
            moveCursor("backward", "letter");
            // make the letter before default
            var prevLetter = document.getElementById(
                `letter${curWordIndex}${curLetterIndex}`
            );
            if (prevLetter !== null) {
                makeDefault(prevLetter);
            }
            return;
        }
        // if it is a space in the middle of a word move to the next word
        if (key === " ") {
            // for each of the remaining children of the curWordElement make them incorrect
            var start =
                curWordIndex === 0 ? curLetterIndex + 1 : curLetterIndex;
            for (var i = start; i < curWordElement.childElementCount; i++) {
                var child = curWordElement.children[i];
                if (child !== null) {
                    makeIncorrect(child);
                }
            }

            // if the user is on the last word
            if (curWordIndex === wordArray.length - 1) {
                curLetterIndex = numLetters - 1;
                moveCursor("forward", "letter");
                // end the typing test
                setIsComplete(true);
                return;
            }
            curWordIndex++;
            curLetterIndex = 0;
            moveCursor("forward", "word");
            // clear the stack
            letterStack = [];
            return;
        }
        // if it is a letter
        if (key.length === 1) {
            // if it is correct
            if (activeLetter.innerText === key) {
                // make the letter correct
                makeCorrect(activeLetter);
                // move the cursor to the next letter
                moveCursor("forward", "letter");
                // if this is the last letter of the last word
                if (
                    curWordIndex === wordArray.length - 1 &&
                    curLetterIndex === numLetters - 1
                ) {
                    // end the typing test
                    setIsComplete(true);
                    return;
                }
                // move to the next letter
                curLetterIndex++;
            }
            // if it is incorrect
            else {
                // increment the incorrect letter counter
                numIncorrectChars++;
                // make the letter incorrect
                makeIncorrect(activeLetter);
                // move the cursor to the next letter
                moveCursor("forward", "letter");
                // move to the next letter
                curLetterIndex++;
            }
        }
    };

    const createTextArray = () => {
        // for every word in the array creat an input element
        setTextArray(
            wordArray.map((word, wordIndex) => {
                return wordIndex == 0 ? (
                    <div
                        key={wordIndex}
                        id={`word${wordIndex}`}
                        className={`${styles.word}`}
                    >
                        <div id="cursor" className={styles.cursor}></div>
                        {word.split("").map((letter, letterIndex) => {
                            return (
                                <div
                                    key={letterIndex}
                                    id={`letter${wordIndex}${letterIndex}`}
                                    className={styles.letter}
                                >
                                    {letter}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div
                        key={wordIndex}
                        id={`word${wordIndex}`}
                        className={`${styles.word}`}
                    >
                        {word.split("").map((letter, letterIndex) => {
                            return (
                                <div
                                    key={letterIndex}
                                    id={`letter${wordIndex}${letterIndex}`}
                                    className={styles.letter}
                                >
                                    {letter}
                                </div>
                            );
                        })}
                    </div>
                );
            })
        );
    };

    return (
        <main
            className={styles.main}
            tabIndex={0}
            onKeyDown={typing}
            onClick={inputDivClicked}
        >
            <div className={styles.textContainer}>{textArray}</div>
        </main>
    );
};

export default TypingSection;
