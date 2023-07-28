import React, { useState, useEffect } from "react";
import styles from "@/styles/Rain.module.css";

const Rain: React.FC = () => {
    const [drops, setDrops] = useState<JSX.Element[]>([]);
    const [backDrops, setBackDrops] = useState<JSX.Element[]>([]);

    useEffect(() => {
        makeItRain();
    }, []);

    const makeItRain = () => {
        // Clear out the existing raindrops
        setDrops([]);
        setBackDrops([]);

        let increment = 0;
        let newDrops: JSX.Element[] = [];
        let newBackDrops: JSX.Element[] = [];

        while (increment < 100) {
            const rand100 = Math.floor(Math.random() * 98) + 1;
            const rand5 = Math.floor(Math.random() * 4) + 2;
            increment += rand5;

            const drop = (
                <div
                    key={increment}
                    className={styles.drop}
                    style={{
                        left: `${increment}%`,
                        bottom: `${rand5 + rand5 - 1 + 100}%`,
                        animationDelay: `0.${rand100}s`,
                        animationDuration: `0.5${rand100}s`,
                    }}
                >
                    <div
                        className={styles.stem}
                        style={{
                            animationDelay: `0.${rand100}s`,
                            animationDuration: `0.5${rand100}s`,
                        }}
                    ></div>
                    <div
                        className={styles.splat}
                        style={{
                            animationDelay: `0.${rand100}s`,
                            animationDuration: `0.5${rand100}s`,
                        }}
                    ></div>
                </div>
            );

            const backDrop = (
                <div
                    key={increment}
                    className={styles.drop}
                    style={{
                        right: `${increment}%`,
                        bottom: `${rand5 + rand5 - 1 + 100}%`,
                        animationDelay: `0.${rand100}s`,
                        animationDuration: `0.5${rand100}s`,
                    }}
                >
                    <div
                        className={styles.stem}
                        style={{
                            animationDelay: `0.${rand100}s`,
                            animationDuration: `0.5${rand100}s`,
                        }}
                    ></div>
                    <div
                        className={styles.splat}
                        style={{
                            animationDelay: `0.${rand100}s`,
                            animationDuration: `0.5${rand100}s`,
                        }}
                    ></div>
                </div>
            );

            newDrops.push(drop);
            newBackDrops.push(backDrop);
        }

        setDrops(newDrops);
        setBackDrops(newBackDrops);
    };

    return (
        <main className={styles.main}>
            <div className={`${styles.rain} ${styles.frontRow}`}>{drops}</div>
            <div className={`${styles.rain} ${styles.backRow}`}>
                {backDrops}
            </div>
        </main>
    );
};

export default Rain;
