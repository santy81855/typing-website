"use client";
import styles from "@/styles/TypingSection.module.css";
import React, {
    useState,
    useEffect,
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
    setPassage: (passage: string[]) => void;
    setNumErrors: (numErrors: number) => void;
    areaRef: React.RefObject<HTMLDivElement>;
    setStartTime: (startTime: number) => void;
    setEndTime: (endTime: number) => void;
    testType: string;
    getRandomWord: () => string;
    time: number;
    startTimer: () => void;
    passageRef: React.RefObject<HTMLDivElement>;
    setTotalCharsTyped: (totalCharsTyped: number) => void;
    totalCharsTyped: number;
    setNumIncorrectWords: (numIncorrectWords: number) => void;
    numIncorrectWords: number;
    setNumCorrectWords: (numCorrectWords: number) => void;
    numCorrectWords: number;
    setWordsTypedCorrectly: (wordsTypedCorrectly: string[]) => void;
    wordsTypedCorrectly: string[];
    numErrors: number;
};
type ExtraLetterMap = {
    [key: number]: number[];
};

// Define the interface for the cursor position
interface CursorPosition {
    x: number;
    y: number;
}

const TypingSection = forwardRef<TypingSectionRef, props>(
    (
        {
            setIsComplete,
            passage,
            setPassage,
            setNumErrors,
            areaRef,
            setStartTime,
            setEndTime,
            testType,
            getRandomWord,
            time,
            startTimer,
            passageRef,
            setTotalCharsTyped,
            totalCharsTyped,
            setNumIncorrectWords,
            numIncorrectWords,
            setNumCorrectWords,
            numCorrectWords,
            setWordsTypedCorrectly,
            wordsTypedCorrectly,
            numErrors,
        }: props,
        ref
    ) => {
        useImperativeHandle(ref, () => ({
            testFinished,
        }));

        TypingSection.displayName = "TypingSection";

        const [textArray, setTextArray] = useState<InputArray>([]);
        var curLetterIndex = 0;
        var curWordIndex = 0;
        var cursorPositionX = 0;
        var cursorPositionY = 0;
        var newLineCounter = 0;
        var curIncorrectLetters: number[] = [];
        // variable to track how many extra words we have dynamically added to avoid running out of words
        var numExtraWords = 0;

        // var used to determine which class to give each letter
        const [typedArray, setTypedArray] = useState<string[]>([""]);
        const [wi, setWi] = useState<number>(0);
        const [li, setLi] = useState<number>(0);
        const [letterStack, setLetterStack] = useState<string[]>([]);
        const [extraLetters, setExtraLetters] = useState<ExtraLetterMap>({});
        const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
            x: 0,
            y: 0,
        });
        const [curLine, setCurLine] = useState<number>(1);

        // everytime the passage changes
        useEffect(() => {
            setTypedArray([""]);
            setCursorPosition({ x: 0, y: 0 });
            setCurLine(1);
            setLetterStack([]);
            setExtraLetters({});
            setWi(0);
            setLi(0);
        }, [passage]);

        // everytime that we change letter or word
        useEffect(() => {
            setCursor();
        }, [li, wi]);

        // every time we reaech a new line we want to scroll the text area up
        useEffect(() => {
            if (curLine > 2) {
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
                            getComputedStyle(document.documentElement).fontSize
                        );
                    textArea.style.top = `${(curLine - 2) * -2 * pixels}px`;
                }
            }
        }, [curLine]);

        const setCursor = () => {
            // get the current cursor position
            const curX = cursorPosition.x;
            const curY = cursorPosition.y;

            // get the current active letter
            var activeLetter;
            if (li === 0) {
                activeLetter = document.getElementById(`letter${wi}${li}`);
            } else {
                activeLetter = document.getElementById(`letter${wi}${li - 1}`);
            }
            // get the cursor
            const cursor = document.getElementById("cursor");
            if (activeLetter !== null && cursor !== null) {
                var x, cursorX;
                // if the cursor is ahead of the active letter then use left
                if (li === 0) {
                    x = activeLetter.getBoundingClientRect().left;
                    cursorX = cursor.getBoundingClientRect().left;
                } else {
                    x = activeLetter.getBoundingClientRect().right;
                    cursorX = cursor.getBoundingClientRect().right;
                }
                var y = activeLetter.getBoundingClientRect().top;
                // get the cursor positions
                var cursorY = cursor.getBoundingClientRect().top;
                // get the differences
                var diffX = x - cursorX;
                var diffY = y - cursorY;

                if (diffY > 5) {
                    setCurLine(curLine + 1);
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

                setCursorPosition({ x: curX + diffX, y: curY + diffY });
            }
        };

        const testFinished = () => {
            if (testType === "time") {
                setStartTime(0);
                setEndTime(time);
            } else {
                setEndTime(new Date().getTime());
            }
            setIsComplete(true);
        };

        const addWord = (word: string) => {
            /*
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
                letterDiv.classList.add(styles.default);
                letterDiv.id = `letter${numChildren}${i}`;
                letterDiv.innerText = word[i];
                newDiv.appendChild(letterDiv);
            }
            textArea.appendChild(newDiv);
            */
            // add the word to the passage
            var temp = passage;
            temp.push(word);
            setPassage(temp);
            numExtraWords++;
        };

        const addBufferIfNeeded = () => {
            if (testType === "time" && wi === passage.length - 50) {
                for (let i = 0; i < 50; i++) {
                    addWord(getRandomWord());
                }
            }
        };

        const testFinishedCondition = () => {
            return wi === passage.length - 1;
        };

        const typing = (e: React.KeyboardEvent<HTMLDivElement>) => {
            // if it is the very first letter we want to start the timer
            if (wi === 0 && li === 0) {
                setStartTime(new Date().getTime());
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
            var curWordElement = document.getElementById(`word${wi}`);
            if (curWordElement === null) {
                return;
            }
            // get how many children curWordElement has
            // if it is the first word we subtract one because of the cursor
            var numLetters =
                wi === 0
                    ? curWordElement.childElementCount - 1
                    : curWordElement.childElementCount;
            // if we are out of bounds
            if (li === numLetters) {
                // if it is a letter
                if (key.length === 1) {
                    // if the key is a space move to the next word
                    if (key === " ") {
                        // append a new empty string on typedText use state variable
                        var temp = typedArray;
                        temp.push("");
                        setTypedArray(temp);

                        // if the user has typed extra letters on the word then increase the wrong word counter, otherwise increase the correct word counter
                        if (
                            letterStack.length === 0 &&
                            curIncorrectLetters.length === 0
                        ) {
                            // get the current word
                            var currentWord = curWordElement.innerText;
                            // remove all new lines from the string
                            currentWord = currentWord.replace(/\n/g, "");
                            var temp = wordsTypedCorrectly;
                            temp.push(currentWord);
                            setWordsTypedCorrectly(temp);
                            setNumCorrectWords(numCorrectWords + 1);
                        } else {
                            setNumIncorrectWords(numIncorrectWords + 1);
                        }
                        // if the user is on the last word
                        if (testFinishedCondition()) {
                            testFinished();
                            return;
                        }
                        // add a buffer if we are nearing the end of the passage
                        addBufferIfNeeded();
                        setWi(wi + 1);
                        setLi(0);
                        //moveCursor("forward", "word");
                        // clear the stack
                        setLetterStack([]);
                        // clear the incorrect letters
                        curIncorrectLetters = [];
                        return;
                    }
                    // otherwise the user is adding extra letters to the word
                    else {
                        // add the current letter to the extra letters
                        setExtraLetters((prevExtraLetters) => ({
                            ...prevExtraLetters,
                            [wi]: [...(prevExtraLetters[wi] || []), li],
                        }));
                        // increase the number of characters typed
                        setTotalCharsTyped(totalCharsTyped + 1);
                        // increment the number of incorrect letters
                        setNumErrors(numErrors + 1);
                        // add the new letter to the last word in the passage
                        var temp = passage;
                        temp[wi] += key;
                        setPassage(temp);
                        // add the "remove" keyword to the stack
                        var tempStack = letterStack;
                        tempStack.push("remove");
                        setLetterStack(tempStack);
                        setLi(li + 1);
                        return;
                    }
                } else {
                    if (key === "Backspace") {
                        console.log("here");
                        // if the letter stack is empty then just normal delete
                        if (letterStack.length === 0) {
                            setLi(li - 1);
                            // remove the last letter from the typedArray
                            var temp = typedArray;
                            temp[wi] = temp[wi].slice(0, -1);
                            setTypedArray(temp);
                            //moveCursor("backward", "letter");
                            return;
                        }
                        // if the letter stack is not empty then we need to remove the last letter
                        else {
                            // remove the last letter from the passage
                            var temp = passage;
                            temp[wi] = temp[wi].slice(0, -1);
                            setPassage(temp);
                            // remove the last element from the stack
                            var tempStack = letterStack;
                            tempStack.pop();
                            setLetterStack(tempStack);
                            setLi(li - 1);
                            //moveCursor("backward", "word");
                            return;
                        }
                    }
                }
            }
            // if the curLetterIndex is in bounds
            // get the new active letter
            var activeLetter = document.getElementById(`letter${wi}${li}`);
            if (activeLetter === null) {
                return;
            }
            // if it is a backspace
            if (key === "Backspace") {
                // if we are at the start of a word then do nothing
                if (li === 0) {
                    return;
                }
                // delete the last letter in the typedArray
                var temp = typedArray;
                temp[wi] = temp[wi].slice(0, -1);
                setTypedArray(temp);
                setLi(li - 1);
                // if we just deleted a letter that was incorrect
                if (
                    curIncorrectLetters[curIncorrectLetters.length - 1] === li
                ) {
                    // pop it from the incorrect letters
                    curIncorrectLetters.pop();
                }
                //moveCursor("backward", "letter");
                // make the letter before default
                return;
            }
            // if it is a space in the middle of a word move to the next word
            if (key === " ") {
                // append a new empty string on typedText use state variable
                var temp = typedArray;
                temp.push("");
                setTypedArray(temp);

                // increaese the number of incorrect words
                setNumIncorrectWords(numIncorrectWords + 1);
                // for each of the remaining children of the curWordElement make them incorrect
                // add a buffer if we are nearing the end of the passage
                addBufferIfNeeded();

                // if the user is on the last word
                if (testFinishedCondition()) {
                    setLi(numLetters - 1);
                    //moveCursor("forward", "letter");
                    // end the typing test
                    testFinished();
                    return;
                }
                setWi(wi + 1);
                setLi(0);
                //moveCursor("forward", "word");
                // clear the stack
                setLetterStack([]);
                // clear curIncorrectLetters
                curIncorrectLetters = [];
                return;
            }
            // if it is a letter
            if (key.length === 1) {
                // increase the number of characters typed
                setTotalCharsTyped(totalCharsTyped + 1);
                // add a letter to the current word on typedArray
                var temp = typedArray;
                temp[wi] += key;
                setTypedArray(temp);
                // if it is incorrect
                if (activeLetter.innerText !== key) {
                    curIncorrectLetters.push(curLetterIndex);
                    setNumErrors(numErrors + 1);
                }
                // if this is the last letter of the last word
                if (testFinishedCondition() && li === numLetters - 1) {
                    // if it was correct increase correct words
                    if (activeLetter.innerText === key) {
                        setNumCorrectWords(numCorrectWords + 1);
                        // get the current word
                        var currentWord = curWordElement.innerText;
                        // remove all new lines from the string
                        currentWord = currentWord.replace(/\n/g, "");
                        // add this array of letters as a single string to correctWordsList
                        var temp = wordsTypedCorrectly;
                        temp.push(currentWord);
                        setWordsTypedCorrectly(temp);
                    } else {
                        setNumIncorrectWords(numIncorrectWords + 1);
                    }
                    testFinished();
                    return;
                }

                // move the cursor to the next letter
                //moveCursor("forward", "letter");
                // move to the next letter
                setLi(li + 1);
            }
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
                        <div
                            id="textArea"
                            ref={passageRef}
                            className={styles.textArea}
                        >
                            <>
                                {passage.map((word, wordIndex) => {
                                    return wordIndex == 0 ? (
                                        <div
                                            key={wordIndex}
                                            id={`word${wordIndex}`}
                                            className={styles.word}
                                        >
                                            {word
                                                .split("")
                                                .map((letter, letterIndex) => {
                                                    // if the letter hasn't been typed yet then make it default
                                                    var isDefault = true;
                                                    // if the letter was typed incorrectly then make it incorrect
                                                    var isIncorrect =
                                                        wi >= wordIndex &&
                                                        letterIndex <
                                                            typedArray[
                                                                wordIndex
                                                            ].length &&
                                                        letter !==
                                                            typedArray[
                                                                wordIndex
                                                            ][letterIndex];
                                                    // if the letter was typed correctly then make it correct
                                                    // if the letter was typed incorrectly then make it incorrect
                                                    var isCorrect =
                                                        wi >= wordIndex &&
                                                        letterIndex <
                                                            typedArray[
                                                                wordIndex
                                                            ].length &&
                                                        letter ===
                                                            typedArray[
                                                                wordIndex
                                                            ][letterIndex];
                                                    var arr =
                                                        extraLetters[wordIndex];
                                                    var isExtra =
                                                        (wi > wordIndex &&
                                                            typedArray[
                                                                wordIndex
                                                            ].length <=
                                                                letterIndex) ||
                                                        (arr &&
                                                            arr.includes(
                                                                letterIndex
                                                            ));

                                                    return (
                                                        <div
                                                            key={letterIndex}
                                                            id={`letter${wordIndex}${letterIndex}`}
                                                            className={`${
                                                                styles.letter
                                                            } ${
                                                                isDefault &&
                                                                styles.default
                                                            }
                                        ${isIncorrect && styles.incorrect}
                                        ${isCorrect && styles.correct}
                                        ${isExtra && styles.extra}
                                        `}
                                                        >
                                                            {letter}
                                                        </div>
                                                    );
                                                })}
                                            <div
                                                id="cursor"
                                                className={styles.cursor}
                                                style={{
                                                    transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`,
                                                }}
                                            ></div>
                                        </div>
                                    ) : (
                                        <div
                                            key={wordIndex}
                                            id={`word${wordIndex}`}
                                            className={styles.word}
                                        >
                                            {word
                                                .split("")
                                                .map((letter, letterIndex) => {
                                                    // if the letter hasn't been typed yet then make it default
                                                    var isDefault = true;
                                                    // if the letter was typed incorrectly then make it incorrect
                                                    var isIncorrect =
                                                        wi >= wordIndex &&
                                                        letterIndex <
                                                            typedArray[
                                                                wordIndex
                                                            ].length &&
                                                        letter !==
                                                            typedArray[
                                                                wordIndex
                                                            ][letterIndex];
                                                    // if the letter was typed correctly then make it correct
                                                    // if the letter was typed incorrectly then make it incorrect
                                                    var isCorrect =
                                                        wi >= wordIndex &&
                                                        letterIndex <
                                                            typedArray[
                                                                wordIndex
                                                            ].length &&
                                                        letter ===
                                                            typedArray[
                                                                wordIndex
                                                            ][letterIndex];
                                                    var arr =
                                                        extraLetters[wordIndex];
                                                    var isExtra =
                                                        (wi > wordIndex &&
                                                            typedArray[
                                                                wordIndex
                                                            ].length <=
                                                                letterIndex) ||
                                                        (arr &&
                                                            arr.includes(
                                                                letterIndex
                                                            ));
                                                    return (
                                                        <div
                                                            key={letterIndex}
                                                            id={`letter${wordIndex}${letterIndex}`}
                                                            className={`${
                                                                styles.letter
                                                            } ${
                                                                isDefault &&
                                                                styles.default
                                                            }
                                        ${isIncorrect && styles.incorrect}
                                        ${isCorrect && styles.correct}
                                        ${isExtra && styles.extra}
                                        `}
                                                        >
                                                            {letter}
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    );
                                })}
                            </>
                        </div>

                        <input
                            type="text"
                            title="text input"
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
