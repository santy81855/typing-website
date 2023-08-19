"use client";
import React, { useEffect, useState } from "react";
import styles from "@/styles/Profile.module.css";
import axios from "axios";
import Rain from "@/components/Rain";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { getRank, getUrl } from "@/lib/RankList";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Define the interface for each object in the userResults array
interface UserResult {
    date: string; // Or use Date type if it's in ISO string format
    wpm: number;
    wordAccuracy: number;
    characterAccuracy: number;
    type: string;
    time: number;
    numCorrectWords: number;
    numIncorrectWords: number;
}

const Profile = () => {
    const { data: session, status } = useSession();
    const [username, setUsername] = useState("");
    const [userResults, setUserResults] = useState<UserResult[]>([]);
    const [allUserResults, setAllUserResults] = useState<UserResult[]>([]);
    const [numResults, setNumResults] = useState(0);
    const [avgWPM, setAvgWPM] = useState(0);
    const [avgAccuracy, setAvgAccuracy] = useState(0);
    const [width, setWidth] = useState(0);
    const [tablePage, setTablePage] = useState(0);
    const [tableItems, setTableItems] = useState<UserResult[]>([]); // the items to show on the table
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [fastestWPM, setFastestWPM] = useState(0);
    const [lastTenWPMAvg, setLastTenWPMAvg] = useState(0);

    const numTests = 10;
    useEffect(() => {
        getUser();
        getUserResults();
        setWidth(window.innerWidth);
        window.addEventListener("resize", () => {
            setWidth(window.innerWidth);
        });
    }, []);

    useEffect(() => {
        // calculate the items to show on the table based on the page
        const start = tablePage * itemsPerPage;
        const end = start + itemsPerPage;
        // set the user results to the items to show
        setTableItems(allUserResults.slice(start, end));
    }, [tablePage]);

    const getUserResults = async () => {
        // post request with axios
        axios
            .get("/api/get-all-user-results")
            .then((res) => {
                // order them by date
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
                // get the result with the biggest wpm field
                var fastest = temp.reduce((prev: any, current: any) => {
                    return prev.wpm > current.wpm ? prev : current;
                });
                // get the average of the last 10 wpm
                var lastTen = temp.slice(0, 10);
                var sum = 0;
                lastTen.forEach((result: { wpm: number }) => {
                    sum += result.wpm;
                });
                if (temp.length < 10) {
                    setLastTenWPMAvg(-1);
                } else {
                    setLastTenWPMAvg(sum / lastTen.length);
                }
                // set the fastest wpm
                setFastestWPM(fastest.wpm);
                setNumResults(temp.length);
                // get the average wpm
                sum = 0;
                temp.forEach((result: { wpm: number }) => {
                    sum += result.wpm;
                });
                setAvgWPM(sum / temp.length);
                // get the average accuracy
                sum = 0;
                temp.forEach((result: { characterAccuracy: number }) => {
                    sum += result.characterAccuracy;
                });
                setAvgAccuracy(sum / temp.length);
                // set all user results
                setAllUserResults(temp);
                // get the first table results
                setTableItems(temp.slice(0, itemsPerPage));
                // get the last 10
                temp = temp.slice(0, numTests);
                // store temp backwards
                setUserResults(temp.reverse());
            })
            .catch((res) => alert(res));
    };

    // get the user and their settings
    const getUser = async () => {
        await axios
            .get("/api/user")
            .then((res) => {
                setUsername(res.data.username);
            })
            .catch((err) => {
                alert("Error Fetching User " + err.message);
            });
    };

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

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
                text: `Last ${numTests} Tests`,
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

    const labels = userResults.map((result) => {
        // turn the dates into a string
        const date = new Date(result.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    const data = {
        labels,
        datasets: [
            {
                label: "WPM",
                data: userResults.map((result) => result.wpm),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
    };

    return (
        <main className={styles.main}>
            <div className={styles.pageContainer}>
                <div className={styles.grid}>
                    <div className={styles.itemProfile}>
                        {session?.user?.image && (
                            <Image
                                className={styles.userImage}
                                src={session?.user?.image}
                                width={50}
                                height={50}
                                alt="user"
                                unoptimized={true}
                            />
                        )}
                        <p>{username}</p>
                    </div>
                    <div className={styles.item}>
                        <p>tests taken</p> <p>{numResults}</p>
                    </div>
                    <div className={styles.itemLarge}>
                        {lastTenWPMAvg !== 0 && (
                            <>
                                <div className={styles.rankTitle}>
                                    <div>
                                        <p>Rank:</p>

                                        <p className={styles.rank}>
                                            {getRank(lastTenWPMAvg)}
                                        </p>

                                        {lastTenWPMAvg === -1 && (
                                            <span>
                                                Finish at least 10 races to get
                                                a rank!
                                            </span>
                                        )}
                                    </div>
                                    <p>{lastTenWPMAvg} wpm</p>
                                </div>

                                <Image
                                    className={styles.rankImage}
                                    src={getUrl(lastTenWPMAvg) as string}
                                    width={100}
                                    height={100}
                                    alt="rank"
                                    unoptimized={true}
                                />
                            </>
                        )}
                    </div>
                    <div className={styles.item}>
                        <p>wpm record</p>
                        <p>{fastestWPM}</p>
                    </div>
                    <div className={styles.item}>
                        <p>accuracy</p>
                        <p>{avgAccuracy.toFixed(2)}%</p>
                    </div>
                </div>

                <Line
                    options={options}
                    data={data}
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                        backdropFilter: "blur(4px)",
                        borderRadius: "1.2rem",
                        paddingInline: "1rem",
                        paddingBlock: "1rem",
                    }}
                />

                <div className={styles.tableContainer}>
                    <p className={styles.tableTitle}>Previous Results</p>
                    <table>
                        <thead>
                            <tr>
                                {width > 430 && <th>test type</th>}
                                <th>wpm</th>
                                <th>accuracy</th>
                                {width > 545 && <th>time</th>}
                                {width > 650 && <th>words</th>}
                                <th>date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableItems.map((result, index) => {
                                const type =
                                    result.type === "wordCount"
                                        ? "words"
                                        : "timed";
                                const date = new Date(result.date);
                                const dateString = `${
                                    date.getMonth() + 1
                                }/${date.getDate()}/${date.getFullYear()}`;
                                const numWords =
                                    result.numCorrectWords +
                                    result.numIncorrectWords;
                                return (
                                    <tr key={index}>
                                        {width > 430 && <td>{type}</td>}
                                        <td>{result.wpm}</td>
                                        <td>
                                            {result.characterAccuracy.toFixed(
                                                2
                                            )}
                                            %
                                        </td>
                                        {width > 545 && (
                                            <td>{result.time.toFixed(2)}s</td>
                                        )}
                                        {width > 650 && <td>{numWords}</td>}
                                        <td>{dateString}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className={styles.pagination}>
                        <button
                            onClick={() => {
                                if (tablePage > 0) {
                                    setTablePage(tablePage - 1);
                                }
                            }}
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <p>
                            {tablePage + 1} /{" "}
                            {Math.ceil(numResults / itemsPerPage)}
                        </p>
                        <button
                            onClick={() => {
                                if (
                                    tablePage <
                                    Math.ceil(numResults / itemsPerPage) - 1
                                ) {
                                    setTablePage(tablePage + 1);
                                }
                            }}
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
            <Rain />
        </main>
    );
};

export default Profile;
