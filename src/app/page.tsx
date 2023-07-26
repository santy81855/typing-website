"use client";
import styles from "./page.module.css";
import TypingSection from "@/components/TypingSection";
import React, { useState, useEffect } from "react";
import { english } from "@/lib/words";

import { useSession } from "next-auth/react";

export default function Home() {
    const { data: session } = useSession();

    const [isComplete, setIsComplete] = useState(false);
    // generate a long list of words
    const [passage, setPassage] = useState([""]);
    useEffect(() => {
        // create a random assortment of 100 words from the 'english' array that will be loaded by default
        const randomPassage = [];
        for (let i = 0; i < 100; i++) {
            const randomIndex = Math.floor(Math.random() * english.length);
            randomPassage.push(english[randomIndex].toLocaleLowerCase());
        }
        setPassage(randomPassage);
    }, []);

    return (
        <main className={styles.main}>
            <TypingSection setIsComplete={setIsComplete} passage={passage} />
            {JSON.stringify(session, null, 2)}
        </main>
    );
}
