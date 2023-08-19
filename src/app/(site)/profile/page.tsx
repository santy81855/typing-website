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
import { type } from "os";

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

type TestType = {
    type: string;
    subType: number;
};

const Profile = () => {
    const { data: session, status } = useSession();
    const [username, setUsername] = useState("");
    const [userResults, setUserResults] = useState<UserResult[]>([]);
    const [allUserResults, setAllUserResults] = useState<UserResult[]>([]);
    const [numResults, setNumResults] = useState(0);
    const [avgWPM, setAvgWPM] = useState(0);
    const [avgCPM, setAvgCPM] = useState(0); // characters per minute
    const [avgAccuracy, setAvgAccuracy] = useState(0);
    const [width, setWidth] = useState(0);
    const [tablePage, setTablePage] = useState(0);
    const [tableItems, setTableItems] = useState<UserResult[]>([]); // the items to show on the table
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [fastestWPM, setFastestWPM] = useState(0);
    const [lastTenWPMAvg, setLastTenWPMAvg] = useState(0);
    const [word10Avg, setWord10Avg] = useState(0);
    const [word25Avg, setWord25Avg] = useState(0);
    const [word50Avg, setWord50Avg] = useState(0);
    const [word100Avg, setWord100Avg] = useState(0);
    const [word200Avg, setWord200Avg] = useState(0);
    const [timed15Avg, setTimed15Avg] = useState(0);
    const [timed30Avg, setTimed30Avg] = useState(0);
    const [timed60Avg, setTimed60Avg] = useState(0);
    const [timed120Avg, setTimed120Avg] = useState(0);
    const [timed300Avg, setTimed300Avg] = useState(0);

    const [testType, setTestType] = useState({
        type: "timed",
        subType: 60,
    }); // wordCount or timed

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

    const getAllAvgWpm = (results: UserResult[]) => {
        const word10 = results
            .filter(
                (result) =>
                    result.type === "wordCount" &&
                    result.numCorrectWords + result.numIncorrectWords === 10
            )
            .slice(0, 10);
        // get the avg wpm of word 10
        var sum = 0;
        word10.forEach((result) => {
            sum += result.wpm;
        });
        setWord10Avg(word10.length >= 10 ? sum / 10 : -1);
        const word25 = results
            .filter(
                (result) =>
                    result.type === "wordCount" &&
                    result.numCorrectWords + result.numIncorrectWords === 25
            )
            .slice(0, 10);
        // get the avg wpm of word 25
        sum = 0;
        word25.forEach((result) => {
            sum += result.wpm;
        });
        setWord25Avg(word25.length >= 10 ? sum / 10 : -1);
        const word50 = results
            .filter(
                (result) =>
                    result.type === "wordCount" &&
                    result.numCorrectWords + result.numIncorrectWords === 50
            )
            .slice(0, 10);
        // get the avg wpm of word 50
        sum = 0;
        word50.forEach((result) => {
            sum += result.wpm;
        });
        setWord50Avg(word50.length >= 10 ? sum / 10 : -1);
        const word100 = results
            .filter(
                (result) =>
                    result.type === "wordCount" &&
                    result.numCorrectWords + result.numIncorrectWords === 100
            )
            .slice(0, 10);
        // get the avg wpm of word 100
        sum = 0;
        word100.forEach((result) => {
            sum += result.wpm;
        });
        setWord100Avg(word100.length >= 10 ? sum / 10 : -1);
        const word200 = results
            .filter(
                (result) =>
                    result.type === "wordCount" &&
                    result.numCorrectWords + result.numIncorrectWords === 200
            )
            .slice(0, 10);
        // get the avg wpm of word 200
        sum = 0;
        word200.forEach((result) => {
            sum += result.wpm;
        });
        setWord200Avg(word200.length >= 10 ? sum / 10 : -1);
        // get all the timed results
        const timed15 = results
            .filter((result) => result.type === "time" && result.time === 15)
            .slice(0, 10);
        // get the avg wpm of timed 15
        sum = 0;
        timed15.forEach((result) => {
            sum += result.wpm;
        });
        setTimed15Avg(timed15.length >= 10 ? sum / 10 : -1);
        const timed30 = results
            .filter((result) => result.type === "time" && result.time === 30)
            .slice(0, 10);
        // get the avg wpm of timed 30
        sum = 0;
        timed30.forEach((result) => {
            sum += result.wpm;
        });
        setTimed30Avg(timed30.length >= 10 ? sum / 10 : -1);
        const timed60 = results
            .filter((result) => result.type === "time" && result.time === 60)
            .slice(0, 10);
        // get the avg wpm of timed 60
        sum = 0;
        timed60.forEach((result) => {
            sum += result.wpm;
        });
        setTimed60Avg(timed60.length >= 10 ? sum / 10 : -1);
        setLastTenWPMAvg(timed60.length >= 10 ? sum / 10 : -1);
        const timed120 = results
            .filter((result) => result.type === "time" && result.time === 120)
            .slice(0, 10);
        // get the avg wpm of timed 120
        sum = 0;
        timed120.forEach((result) => {
            sum += result.wpm;
        });
        setTimed120Avg(timed120.length >= 10 ? sum / 10 : -1);
        const timed300 = results
            .filter((result) => result.type === "time" && result.time === 300)
            .slice(0, 10);
        // get the avg wpm of timed 300
        sum = 0;
        timed300.forEach((result) => {
            sum += result.wpm;
        });
        setTimed300Avg(timed300.length >= 10 ? sum / 10 : -1);
    };

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
                getAllAvgWpm(temp);
                // set the fastest wpm
                setFastestWPM(fastest.wpm);
                setNumResults(temp.length);
                // get the average wpm
                sum = 0;
                temp.forEach((result: { wpm: number }) => {
                    sum += result.wpm;
                });
                setAvgWPM(sum / temp.length);
                // get the average cpm
                sum = 0;
                temp.forEach((result: { cpm: number }) => {
                    sum += result.cpm;
                });
                // set the cpm with max 2 decimal places
                setAvgCPM(parseFloat((sum / temp.length).toFixed(2)));
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
                borderColor: "white",
                borderWidth: 2,
                backgroundColor: "white",
            },
        ],
    };

    const changeTestType = (direction: string) => {
        const type = testType.type;
        const subType = testType.subType;
        if (direction === "forward") {
            if (type === "wordCount") {
                if (subType === 10) {
                    setTestType({ type: "wordCount", subType: 25 });
                    setLastTenWPMAvg(word25Avg);
                } else if (subType === 25) {
                    setTestType({ type: "wordCount", subType: 50 });
                    setLastTenWPMAvg(word50Avg);
                } else if (subType === 50) {
                    setTestType({ type: "wordCount", subType: 100 });
                    setLastTenWPMAvg(word100Avg);
                } else if (subType === 100) {
                    setTestType({ type: "wordCount", subType: 200 });
                    setLastTenWPMAvg(word200Avg);
                } else if (subType === 200) {
                    setTestType({ type: "timed", subType: 15 });
                    setLastTenWPMAvg(timed15Avg);
                }
            } else if (type === "timed") {
                if (subType === 15) {
                    setTestType({ type: "timed", subType: 30 });
                    setLastTenWPMAvg(timed30Avg);
                } else if (subType === 30) {
                    setTestType({ type: "timed", subType: 60 });
                    setLastTenWPMAvg(timed60Avg);
                } else if (subType === 60) {
                    setTestType({ type: "timed", subType: 120 });
                    setLastTenWPMAvg(timed120Avg);
                } else if (subType === 120) {
                    setTestType({ type: "timed", subType: 300 });
                    setLastTenWPMAvg(timed300Avg);
                } else if (subType === 300) {
                    setTestType({ type: "wordCount", subType: 10 });
                    setLastTenWPMAvg(word10Avg);
                }
            }
        } else {
            if (type === "wordCount") {
                if (subType === 10) {
                    setTestType({ type: "timed", subType: 300 });
                    setLastTenWPMAvg(timed300Avg);
                } else if (subType === 25) {
                    setTestType({ type: "wordCount", subType: 10 });
                    setLastTenWPMAvg(word10Avg);
                } else if (subType === 50) {
                    setTestType({ type: "wordCount", subType: 25 });
                    setLastTenWPMAvg(word25Avg);
                } else if (subType === 100) {
                    setTestType({ type: "wordCount", subType: 50 });
                    setLastTenWPMAvg(word50Avg);
                } else if (subType === 200) {
                    setTestType({ type: "wordCount", subType: 100 });
                    setLastTenWPMAvg(word100Avg);
                }
            } else if (type === "timed") {
                if (subType === 15) {
                    setTestType({ type: "wordCount", subType: 200 });
                    setLastTenWPMAvg(word200Avg);
                } else if (subType === 30) {
                    setTestType({ type: "timed", subType: 15 });
                    setLastTenWPMAvg(timed15Avg);
                } else if (subType === 60) {
                    setTestType({ type: "timed", subType: 30 });
                    setLastTenWPMAvg(timed30Avg);
                } else if (subType === 120) {
                    setTestType({ type: "timed", subType: 60 });
                    setLastTenWPMAvg(timed60Avg);
                } else if (subType === 300) {
                    setTestType({ type: "timed", subType: 120 });
                    setLastTenWPMAvg(timed120Avg);
                }
            }
        }
    };

    const displayTestType = () => {
        const type = testType.type;
        const subType = testType.subType;
        switch (type) {
            case "wordCount":
                return `${subType} words`;
            case "timed":
                return `${subType} seconds`;
        }
    };

    const displayRank = () => {
        const type = testType.type;
        const subType = testType.subType;
        switch (type) {
            case "wordCount":
                switch (subType) {
                    case 10:
                        return getRank(word10Avg);
                    case 25:
                        return getRank(word25Avg);
                    case 50:
                        return getRank(word50Avg);
                    case 100:
                        return getRank(word100Avg);
                    case 200:
                        return getRank(word200Avg);
                }
            case "timed":
                switch (subType) {
                    case 15:
                        return getRank(timed15Avg);
                    case 30:
                        return getRank(timed30Avg);
                    case 60:
                        return getRank(timed60Avg);
                    case 120:
                        return getRank(timed120Avg);
                    case 300:
                        return getRank(timed300Avg);
                }
        }
    };

    const displayRankImage = () => {
        const type = testType.type;
        const subType = testType.subType;
        switch (type) {
            case "wordCount":
                switch (subType) {
                    case 10:
                        return getUrl(word10Avg);
                    case 25:
                        return getUrl(word25Avg);
                    case 50:
                        return getUrl(word50Avg);
                    case 100:
                        return getUrl(word100Avg);
                    case 200:
                        return getUrl(word200Avg);
                }
            case "timed":
                switch (subType) {
                    case 15:
                        return getUrl(timed15Avg);
                    case 30:
                        return getUrl(timed30Avg);
                    case 60:
                        return getUrl(timed60Avg);
                    case 120:
                        return getUrl(timed120Avg);
                    case 300:
                        return getUrl(timed300Avg);
                }
        }
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
                        <p className={styles.userName}>{username}</p>
                    </div>
                    <div className={styles.item}>
                        <p>tests taken</p> <p>{numResults}</p>
                    </div>
                    <div className={styles.item}>
                        <p>wpm record</p>
                        <p>{fastestWPM}</p>
                    </div>
                    <div className={styles.itemLarge}>
                        {word10Avg !== 0 && (
                            <>
                                <div className={styles.rankTitle}>
                                    <div>
                                        <p>Rank</p>
                                        <p className={styles.rank}>
                                            {displayRank()}
                                        </p>
                                    </div>
                                    {lastTenWPMAvg === -1 && (
                                        <span>
                                            Finish at least 10 races to get a
                                            rank!
                                        </span>
                                    )}
                                    {lastTenWPMAvg !== -1 && (
                                        <p>{lastTenWPMAvg} wpm</p>
                                    )}
                                </div>
                                <Image
                                    className={styles.rankImage}
                                    src={displayRankImage() as string}
                                    width={100}
                                    height={100}
                                    alt="rank"
                                    unoptimized={true}
                                />
                            </>
                        )}
                    </div>

                    <div className={styles.item}>
                        <p>cpm</p>
                        <p>{avgCPM}</p>
                    </div>
                    <div className={styles.item}>
                        <p>accuracy</p>
                        <p>{avgAccuracy.toFixed(2)}%</p>
                    </div>
                    <div className={styles.rankButtonsContainer}>
                        <button
                            className={styles.rankButtonTop}
                            onClick={() => changeTestType("backward")}
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <p className={styles.testType}>mode</p>
                        <p className={styles.testType}>{displayTestType()}</p>
                        <button
                            className={styles.rankButtonTop}
                            onClick={() => changeTestType("forward")}
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                        <div className={styles.bottomRankButtonContainer}>
                            <button
                                className={styles.rankButton}
                                onClick={() => changeTestType("backward")}
                            >
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>
                            <button
                                className={styles.rankButton}
                                onClick={() => changeTestType("forward")}
                            >
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
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
