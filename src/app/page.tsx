"use client";
import styles from "./page.module.css";
import TypingPassage from "@/components/TypingPassage";
import TypingArea from "@/components/TypingArea";
import TypingSection from "@/components/TypingSection";
import React, { useState } from "react";

export default function Home() {
    const [isComplete, setIsComplete] = useState(false);

    return (
        <main className={styles.main}>
            <TypingSection setIsComplete={setIsComplete} />
        </main>
    );
}
