"use client";
import React, { useState } from "react";
import styles from "@/styles/TypingPassage.module.css";

const TypingPassage = () => {
    const [passage, setPassage] = useState(
        "The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog"
    );
    const [userInput, setUserInput] = useState("");

    const handleInputChange = (e) => {
        e.preventDefault();
        const value = e.target.value;
        setUserInput(value);
    };

    const renderPassageWithFeedback = () => {
        return passage.split("").map((letter, index) => {
            const isCorrect = userInput[index] === letter;
            console.log(isCorrect);
            const color = isCorrect ? "green" : "red";
            return (
                <span key={index} style={{ color }}>
                    {letter}
                </span>
            );
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.passage}>
                <span className={styles.passageText}>
                    {renderPassageWithFeedback()}
                </span>
                <textarea
                    value={userInput}
                    onChange={handleInputChange}
                    rows={5}
                    className={styles.input}
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                />
            </div>
        </div>
    );
};

export default TypingPassage;
