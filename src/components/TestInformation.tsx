"use client";
import React, { useState, useEffect } from "react";
import styles from "@/styles/TestInformation.module.css";
import axios from "axios";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

type props = {
    wpm: number;
    wpmRaw: number;
    cpm: number;
    numErrors: number;
    wordAccuracy: string;
    characterAccuracy: string;
    testType: string;
    wordCount: number;
    time: number;
    timeTaken: number;
    totalCharsTyped: number;
};

const TestInformation = ({
    wordAccuracy,
    characterAccuracy,
    wpm,
    wpmRaw,
    numErrors,
    cpm,
    testType,
    wordCount,
    time,
    timeTaken,
    totalCharsTyped,
}: props) => {
    const [averageWpm, setAverageWpm] = useState(0);

    useEffect(() => {
        getUserResults();
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
                labels: {
                    color: "white",
                },
            },
            title: {
                display: false,
                text: "Chart.js Bar Chart",
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: "wpm",
                    color: "white",
                },
                type: "linear" as const,
                display: true,
                position: "left" as const,
                ticks: {
                    color: "white",
                },
            },
            x: {
                type: "category" as const,
                display: true,
                position: "bottom" as const,
                ticks: {
                    color: "white",
                },
            },
        },
    };

    const labels = [""];

    const data = {
        labels,
        datasets: [
            {
                label: "Current",
                data: [wpm],
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
                label: "Lifetime",
                data: [averageWpm],
                backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
        ],
    };

    const getAverageWpm = (resultsArr: string | any[]) => {
        let totalWpm = 0;
        for (let i = 0; i < resultsArr.length; i++) {
            totalWpm += resultsArr[i].wpm;
        }
        setAverageWpm(totalWpm / resultsArr.length);
    };

    const getUserResults = async () => {
        // post request with axios
        axios
            .get("/api/get-all-user-results")
            .then((res) => {
                getAverageWpm(res.data);
            })
            .catch((res) => alert(res));
    };

    return (
        <main className={styles.main}>
            <Bar options={options} data={data} />
            <div className={styles.bottomRow}>
                <div className={styles.bottomItem}>
                    <p>Test type</p>
                    {testType === "wordCount"
                        ? `${wordCount} words`
                        : `time ${time}s`}
                </div>
                <div className={styles.bottomItem}>
                    <p>Raw wpm</p>
                    {wpmRaw}
                </div>
                <div className={styles.bottomItem}>
                    <p>Accuracy</p>
                    {characterAccuracy}
                </div>
            </div>
        </main>
    );
};

export default TestInformation;
