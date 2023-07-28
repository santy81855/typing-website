"use client";
import styles from "@/styles/TypingSection.module.css";
import React, {
    useState,
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from "react";

export interface TypingSectionRef {
    testFinished: () => void;
}

type InputArray = JSX.Element[];
type props = {
    setIsComplete: (isComplete: boolean) => void;
    passage: string[];
    setNumErrors: (numErrors: number) => void;
    areaRef: React.RefObject<HTMLDivElement>;
    focusTypingArea: () => void;
    setStartTime: (startTime: number) => void;
    setEndTime: (endTime: number) => void;
    testType: string;
    getRandomWordLower: () => string;
    time: number;
    startTimer: () => void;
};

const TypingSection = forwardRef<TypingSectionRef, props>(
    (
        {
            setIsComplete,
            passage,
            setNumErrors,
            areaRef,
            focusTypingArea,
            setStartTime,
            setEndTime,
            testType,
            getRandomWordLower,
            time,
            startTimer,
        }: props,
        ref
    ) => {
        // everytime the passage changes
        useEffect(() => {
            // if the passage changes create a new text array
            createTextArray();
            // set the cursor to the first letter
            resetCursor();
        }, [passage]);

        useImperativeHandle(ref, () => ({
            testFinished,
        }));

        TypingSection.displayName = "TypingSection";

        const [textArray, setTextArray] = useState<InputArray>([]);
        var curLetterIndex = 0;
        var curWordIndex = 0;
        var cursorPositionX = 0;
        var cursorPositionY = 0;
        var numErrors = 0;
        var newLineCounter = 0;
        var typedFirstLetter = false;
        var startTime = 0;
        // variable to track how many extra words we have dynamically added to avoid running out of words
        var numExtraWords = 0;
        var letterStack: string[] = [];
        const resetCursor = () => {
            // translate the cursor to 0,0
            const cursor = document.getElementById("cursor");
            if (cursor === null) {
                return;
            }
            cursor.style.transform = "translate(0px, 0px)";
        };

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

            if (diffY > 5) {
                newLineCounter++;
                if (newLineCounter > 1) {
                    const textArea = document.getElementById("textArea");

                    if (textArea !== null) {
                        // get the line height
                        const rowHeight = getComputedStyle(
                            document.documentElement
                        ).getPropertyValue("--row-height");
                        // Convert remValue to pixels
                        const pixels =
                            parseFloat(rowHeight) *
                            parseFloat(
                                getComputedStyle(document.documentElement)
                                    .fontSize
                            );
                        //textArea.scrollBy(0, pixels);

                        // increase the height by 2 * pixels and transformY up by 2 * pixels
                        // get the current height of the textcontainer
                        const height = textArea.clientHeight;
                        //                    textArea.style.height = `${height + 2 * pixels}px`;
                        textArea.style.top = `${
                            (newLineCounter - 1) * -2 * pixels
                        }px`;
                    }
                    // transforrm the area ref up by 20px
                }
            }

            // translate the cursor to the left of the active letter
            cursor.style.transform = `translate(${cursorPositionX + diffX}px, ${
                cursorPositionY + diffY
            }px)`;

            cursorPositionX += diffX;
            cursorPositionY += diffY;
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

        const testFinished = () => {
            setNumErrors(numErrors);
            if (testType === "time") {
                setStartTime(0);
                setEndTime(time);
            } else {
                setStartTime(startTime);
                setEndTime(new Date().getTime());
            }
            setIsComplete(true);
        };

        const addBufferIfNeeded = () => {
            if (
                testType === "time" &&
                curWordIndex === textArray.length + numExtraWords - 50
            ) {
                for (let i = 0; i < 50; i++) {
                    addWord(getRandomWordLower());
                }
            }
        };

        const testFinishedCondition = () => {
            return curWordIndex === passage.length + numExtraWords - 1;
        };

        const typing = (e: React.KeyboardEvent<HTMLDivElement>) => {
            // if it is the very first letter we want to start the timer
            if (
                curWordIndex === 0 &&
                curLetterIndex === 0 &&
                typedFirstLetter === false
            ) {
                startTime = new Date().getTime();
                typedFirstLetter = true;
                // if this is a time test then we want to start a timer for "time" length
                if (testType === "time") {
                    startTimer();
                }
            }

            // get the event target
            var target = e.target as HTMLElement;
            if (target?.tagName.toLowerCase() === "input") {
                return;
            }
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
                        if (testFinishedCondition()) {
                            testFinished();
                            return;
                        }
                        // add a buffer if we are nearing the end of the passage
                        addBufferIfNeeded();
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
                        numErrors++;
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
                    numErrors++;
                    var child = curWordElement.children[i];
                    if (child !== null) {
                        makeIncorrect(child);
                    }
                }
                // add a buffer if we are nearing the end of the passage
                addBufferIfNeeded();

                // if the user is on the last word
                if (testFinishedCondition()) {
                    curLetterIndex = numLetters - 1;
                    moveCursor("forward", "letter");
                    // end the typing test
                    testFinished();
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
                // if it is incorrect
                if (activeLetter.innerText !== key) {
                    numErrors++;
                    // make the letter incorrect
                    makeIncorrect(activeLetter);
                } else {
                    // make the letter correct
                    makeCorrect(activeLetter);
                }
                // if this is the last letter of the last word
                if (
                    testFinishedCondition() &&
                    curLetterIndex === numLetters - 1
                ) {
                    testFinished();
                    return;
                }
                // move the cursor to the next letter
                moveCursor("forward", "letter");
                // move to the next letter
                curLetterIndex++;
            }
        };

        const addWord = (word: string) => {
            // add the new div as the last child of textArea
            const textArea = document.getElementById("textArea");
            if (textArea === null) {
                return;
            }
            // get the length of the children of textArea
            var numChildren = textArea.childElementCount;

            // create a new div element
            var newDiv = document.createElement("div");
            // give it the correct id
            newDiv.id = `word${numChildren}`;
            // give it the "word" class
            newDiv.classList.add(styles.word);
            // give it the class "extra word"
            newDiv.classList.add(styles.extraWord);
            // add each letter as an array of div elements
            for (var i = 0; i < word.length; i++) {
                var letterDiv = document.createElement("div");
                letterDiv.classList.add(styles.letter);
                letterDiv.id = `letter${numChildren}${i}`;
                letterDiv.innerText = word[i];
                newDiv.appendChild(letterDiv);
            }
            textArea.appendChild(newDiv);
            numExtraWords++;
        };

        const createTextArray = () => {
            // remove any extra words
            var extraWords = document.getElementsByClassName(styles.extraWord);
            for (var i = 0; i < extraWords.length; i++) {
                extraWords[i].remove();
                i--;
            }
            // remove any extra classes from any typed letters
            var typedLetters = document.getElementsByClassName(styles.letter);
            for (var i = 0; i < typedLetters.length; i++) {
                // if the letter doesn't contain the correct, incorrect, or extra class then we can stop the loop
                if (
                    !typedLetters[i].classList.contains(styles.correct) &&
                    !typedLetters[i].classList.contains(styles.incorrect) &&
                    !typedLetters[i].classList.contains(styles.extra)
                ) {
                    break;
                }
                // if it is an extra letter just delete it
                if (typedLetters[i].classList.contains(styles.extra)) {
                    typedLetters[i].remove();
                    i--;
                    continue;
                }
                typedLetters[i].classList.remove(styles.correct);
                typedLetters[i].classList.remove(styles.incorrect);
            }

            // for every word in the array creat an input element
            setTextArray(
                passage.map((word, wordIndex) => {
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
                                        className={`${styles.letter}`}
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

        const handleInvisibleInput = (
            e: React.KeyboardEvent<HTMLInputElement>
        ) => {
            const keyPress = new KeyboardEvent("keydown", {
                key: e.key,
                bubbles: true,
                cancelable: true,
            });
            // pass the event to the main div
            const mainElement = document.getElementById("main");
            if (mainElement !== null) {
                mainElement.dispatchEvent(keyPress);
            }
        };

        return (
            <>
                <main
                    id="main"
                    className={styles.main}
                    tabIndex={0}
                    onKeyDown={typing}
                    ref={areaRef}
                >
                    <div id="textContainer" className={styles.textContainer}>
                        <div id="textArea" className={styles.textArea}>
                            {textArray}
                        </div>

                        <input
                            type="text"
                            title="invisibleInput"
                            value={""}
                            onChange={() => {}}
                            onKeyDown={handleInvisibleInput}
                            className={styles.invisibleInput}
                        />
                    </div>
                </main>
            </>
        );
    }
);

export default TypingSection;
