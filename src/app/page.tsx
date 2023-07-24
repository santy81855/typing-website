"use client";
import styles from "./page.module.css";
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
