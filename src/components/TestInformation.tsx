"use client";
import React, { useState, useEffect } from "react";
import styles from "@/styles/TestInformation.module.css";
import axios from "axios";
import { useSession } from "next-auth/react";
import { getRank, getUrl } from "@/lib/RankList";

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
    const { data: session, status } = useSession();
    const [averageWpm, setAverageWpm] = useState(0);
    const [lastTenWPMAvg, setLastTenWPMAvg] = useState(0);

    useEffect(() => {
        if (status === "authenticated") {
            getUserResults();
        }
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
        datasets:
            status === "authenticated"
                ? [
                      {
                          label: "Current",
                          data: [wpm],
                          backgroundColor: "white",
                      },
                      {
                          label: "Lifetime",
                          data: [averageWpm],
                          backgroundColor: "rgb(117, 206, 206)",
                      },
                  ]
                : [
                      {
                          label: "Current",
                          data: [wpm],
                          backgroundColor: "white",
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
                // get the average for the last 10 results
                var temp = res.data;
                temp.sort(
                    (
                        a: { date: string | number | Date },
                        b: { date: string | number | Date }
                    ) => {
                        return (
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        );
                    }
                );
                // get the average of the last 10 wpm
                var lastTen = temp.slice(0, 10);
                var sum = 0;
                lastTen.forEach((result: { wpm: number }) => {
                    sum += result.wpm;
                });
                if (temp.length < 10) {
                    setLastTenWPMAvg(-1);
                    localStorage.setItem("rankUrl", getUrl(-1) as string);
                } else {
                    setLastTenWPMAvg(sum / 10);
                    localStorage.setItem("rankUrl", getUrl(sum / 10) as string);
                }
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
