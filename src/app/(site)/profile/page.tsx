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
    const [last10Dict, setLast10Dict] = useState<{
        [key: string]: UserResult[];
    }>({});
    const minTests = 5;

    const [testType, setTestType] = useState({
        type: "timed",
        subType: 60,
    }); // wordCount or timed

    useEffect(() => {
        getUser();
        getUserResults();
        setWidth(window.innerWidth);
        window.addEventListener("resize", () => {
            setWidth(window.innerWidth);
        });
    }, []);

    useEffect(() => {
        // if the testType changes we need to change the userResults and the last10WPMAvg
        if (Object.keys(last10Dict).length !== 0) {
            if (testType.type === "wordCount") {
                const sub = testType.subType;
                switch (sub) {
                    case 10:
                        setLastTenWPMAvg(word10Avg);
                        setUserResults(last10Dict["wordCount10"]);
                        return;
                    case 25:
                        setLastTenWPMAvg(word25Avg);
                        setUserResults(last10Dict["wordCount25"]);
                        return;
                    case 50:
                        setLastTenWPMAvg(word50Avg);
                        setUserResults(last10Dict["wordCount50"]);
                        return;
                    case 100:
                        setLastTenWPMAvg(word100Avg);
                        setUserResults(last10Dict["wordCount100"]);
                        return;
                    case 200:
                        setLastTenWPMAvg(word200Avg);
                        setUserResults(last10Dict["wordCount200"]);
                        return;
                }
            } else {
                const sub = testType.subType;
                switch (sub) {
                    case 15:
                        setLastTenWPMAvg(timed15Avg);
                        setUserResults(last10Dict["timed15"]);
                        return;
                    case 30:
                        setLastTenWPMAvg(timed30Avg);
                        setUserResults(last10Dict["timed30"]);
                        return;
                    case 60:
                        setLastTenWPMAvg(timed60Avg);
                        setUserResults(last10Dict["timed60"]);
                        return;
                    case 120:
                        setLastTenWPMAvg(timed120Avg);
                        setUserResults(last10Dict["timed120"]);
                        return;
                    case 300:
                        setLastTenWPMAvg(timed300Avg);
                        setUserResults(last10Dict["timed300"]);
                        return;
                }
            }
        }
    }, [testType]);

    useEffect(() => {
        // calculate the items to show on the table based on the page
        const start = tablePage * itemsPerPage;
        const end = start + itemsPerPage;
        // set the user results to the items to show
        setTableItems(allUserResults.slice(start, end));
    }, [tablePage]);

    const getAllAvgWpm = (results: UserResult[]) => {
        var temp: { [key: string]: UserResult[] } = {};
        const word10 = results
            .filter(
                (result) =>
                    result.type === "wordCount" &&
                    result.numCorrectWords + result.numIncorrectWords === 10
            )
            .slice(0, minTests);
        // add the word 10 array as the value to the key "word10" without changing the other values
        temp["wordCount10"] = word10.reverse();
        // get the avg wpm of word 10
        var sum = 0;
        word10.forEach((result) => {
            sum += result.wpm;
        });
        setWord10Avg(word10.length >= minTests ? sum / minTests : -1);
        const word25 = results
            .filter(
                (result) =>
                    result.type === "wordCount" &&
                    result.numCorrectWords + result.numIncorrectWords === 25
            )
            .slice(0, minTests);
        temp["wordCount25"] = word25.reverse();
        // get the avg wpm of word 25
        sum = 0;
        word25.forEach((result) => {
            sum += result.wpm;
        });
        setWord25Avg(word25.length >= minTests ? sum / minTests : -1);
        const word50 = results
            .filter(
                (result) =>
                    result.type === "wordCount" &&
                    result.numCorrectWords + result.numIncorrectWords === 50
            )
            .slice(0, minTests);
        temp["wordCount50"] = word50.reverse();
        // get the avg wpm of word 50
        sum = 0;
        word50.forEach((result) => {
            sum += result.wpm;
        });
        setWord50Avg(word50.length >= minTests ? sum / minTests : -1);
        const word100 = results
            .filter(
                (result) =>
                    result.type === "wordCount" &&
                    result.numCorrectWords + result.numIncorrectWords === 100
            )
            .slice(0, minTests);
        temp["wordCount100"] = word100.reverse();
        // get the avg wpm of word 100
        sum = 0;
        word100.forEach((result) => {
            sum += result.wpm;
        });
        setWord100Avg(word100.length >= minTests ? sum / minTests : -1);
        const word200 = results
            .filter(
                (result) =>
                    result.type === "wordCount" &&
                    result.numCorrectWords + result.numIncorrectWords === 200
            )
            .slice(0, minTests);
        temp["wordCount200"] = word200.reverse();
        // get the avg wpm of word 200
        sum = 0;
        word200.forEach((result) => {
            sum += result.wpm;
        });
        setWord200Avg(word200.length >= minTests ? sum / minTests : -1);
        // get all the timed results
        const timed15 = results
            .filter((result) => result.type === "time" && result.time === 15)
            .slice(0, minTests);
        temp["timed15"] = timed15.reverse();
        // get the avg wpm of timed 15
        sum = 0;
        timed15.forEach((result) => {
            sum += result.wpm;
        });
        setTimed15Avg(timed15.length >= minTests ? sum / minTests : -1);
        const timed30 = results
            .filter((result) => result.type === "time" && result.time === 30)
            .slice(0, minTests);
        temp["timed30"] = timed30.reverse();
        // get the avg wpm of timed 30
        sum = 0;
        timed30.forEach((result) => {
            sum += result.wpm;
        });
        setTimed30Avg(timed30.length >= minTests ? sum / minTests : -1);
        const timed60 = results
            .filter((result) => result.type === "time" && result.time === 60)
            .slice(0, minTests);
        temp["timed60"] = timed60.reverse();
        // get the avg wpm of timed 60
        sum = 0;
        timed60.forEach((result) => {
            sum += result.wpm;
        });
        setTimed60Avg(timed60.length >= minTests ? sum / minTests : -1);
        setLastTenWPMAvg(timed60.length >= minTests ? sum / minTests : -1);
        const timed120 = results
            .filter((result) => result.type === "time" && result.time === 120)
            .slice(0, minTests);
        temp["timed120"] = timed120.reverse();
        // get the avg wpm of timed 120
        sum = 0;
        timed120.forEach((result) => {
            sum += result.wpm;
        });
        setTimed120Avg(timed120.length >= minTests ? sum / minTests : -1);
        const timed300 = results
            .filter((result) => result.type === "time" && result.time === 300)
            .slice(0, minTests);
        temp["timed300"] = timed300.reverse();
        // get the avg wpm of timed 300
        sum = 0;
        timed300.forEach((result) => {
            sum += result.wpm;
        });
        setTimed300Avg(timed300.length >= minTests ? sum / minTests : -1);
        setLast10Dict(temp);
        // display the last 10 60 second tests at first
        setUserResults(timed60);
    };

    const getUserResults = async () => {
        try {
            // Fetch data using axios
            const res = await axios.get("/api/get-all-user-results");
            let temp = res.data;

            // If no results, set default values and return early
            if (temp.length === 0) {
                setFastestWPM(0);
                setNumResults(0);
                setAvgWPM(0);
                setAvgCPM(0);
                setAvgAccuracy(0);
                setAllUserResults([]);
                setTableItems([]);
                return;
            }

            // Order results by date
            temp.sort(
                (
                    a: { date: string | number | Date },
                    b: { date: string | number | Date }
                ) => {
                    return (
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    );
                }
            );

            // Get the result with the highest WPM
            const fastest = temp.reduce((prev: any, current: any) =>
                prev.wpm > current.wpm ? prev : current
            );

            // Get the average of the last 10 results
            const minTests = 10;
            const lastTen = temp.slice(0, Math.min(temp.length, minTests));
            let sum = lastTen.reduce(
                (acc: number, result: { wpm: number }) => acc + result.wpm,
                0
            );
            const avgLastTenWPM = sum / lastTen.length;

            // Calculate averages for WPM, CPM, and accuracy
            const avgWPM =
                temp.reduce(
                    (acc: number, result: { wpm: number }) => acc + result.wpm,
                    0
                ) / temp.length;
            const avgCPM =
                temp.reduce(
                    (acc: number, result: { cpm: number }) => acc + result.cpm,
                    0
                ) / temp.length;
            const avgAccuracy =
                temp.reduce(
                    (acc: number, result: { characterAccuracy: number }) =>
                        acc + result.characterAccuracy,
                    0
                ) / temp.length;

            // Update state with the results
            setFastestWPM(fastest.wpm);
            setNumResults(temp.length);
            setAvgWPM(avgWPM);
            setAvgCPM(parseFloat(avgCPM.toFixed(2))); // Limit to 2 decimal places
            setAvgAccuracy(avgAccuracy);
            setAllUserResults(temp);
            setTableItems(temp.slice(0, itemsPerPage));
            getAllAvgWpm(temp);
        } catch (error) {
            alert(error);
        }
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
                display: true,
                text: `Recent ${
                    testType.type == "wordCount"
                        ? testType.subType + " word"
                        : testType.subType + " second"
                } Tests`,
                color: "white",
            },
        },
        scales: {
            y: {
                // get the smalles value from the following: userResults.map((result) => result.wpm)
                min:
                    Math.min(...userResults.map((result) => result.wpm)) - 5 > 0
                        ? Math.min(...userResults.map((result) => result.wpm)) -
                          5
                        : Math.min(...userResults.map((result) => result.wpm)),
                max: Math.max(...userResults.map((result) => result.wpm)) + 5,
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

    const mainOptions = [
        { name: "timed", sub: ["15", "30", "60", "120", "300"] },
        { name: "words", sub: ["10", "25", "50", "100", "200"] },
    ];

    const optionClicked = (event: any) => {
        const id = event.target.id;

        const selectedElement = event.target;
        if (id !== testType.type) {
            if (id === "words") {
                // add the selected class to the words and remove it from the timed
                document
                    .getElementById("timed")
                    ?.classList.remove(styles.selectedOption);
                selectedElement.classList.add(styles.selectedOption);
                // remove the selected class from the current suboption
                document
                    .getElementById(testType.subType.toString())
                    ?.classList.remove(styles.selectedOption);
                // add the selected class to the 50 suboption
                document
                    .getElementById("50")
                    ?.classList.add(styles.selectedOption);
                setTestType({ type: "wordCount", subType: 50 });
            } else {
                // add the selected class to the words and remove it from the timed
                document
                    .getElementById("words")
                    ?.classList.remove(styles.selectedOption);
                selectedElement.classList.add(styles.selectedOption);
                // remove the selected class from the current suboption
                document
                    .getElementById(testType.subType.toString())
                    ?.classList.remove(styles.selectedOption);
                // add the selected class to the 50 suboption
                document
                    .getElementById("60")
                    ?.classList.add(styles.selectedOption);
                setTestType({ type: "timed", subType: 60 });
            }
        }
    };

    const subOptionClicked = (event: any) => {
        const id = event.target.id;

        if (id !== testType.subType.toString()) {
            setTestType((prev) => ({
                ...prev,
                subType: parseInt(id),
            }));
            // remove selected class from the current suboption
            document
                .getElementById(testType.subType.toString())
                ?.classList.remove(styles.selectedOption);
            // add it to the new subtype
            document.getElementById(id)?.classList.add(styles.selectedOption);
        }
    };

    const modeSelection = (
        <div className={styles.rankButtonsContainer}>
            <div className={styles.testTypeContainer}>
                <p className={styles.testTypeTitle}>mode</p>
                <div className={styles.modeOptions}>
                    {mainOptions.map((cur, index) => {
                        const type = testType.type.toString();
                        return (
                            <p
                                key={index}
                                id={cur.name}
                                className={`${styles.option} ${
                                    type === cur.name && styles.selectedOption
                                }`}
                                onClick={(event) => {
                                    optionClicked(event);
                                }}
                            >
                                {cur.name}
                            </p>
                        );
                    })}
                </div>
                <div className={styles.modeOptions}>
                    {mainOptions.map((cur, index) => {
                        var type = testType.type;
                        var subType = testType.subType.toString();
                        if (type === "wordCount") {
                            type = "words";
                        }
                        return (
                            cur.name === type &&
                            cur.sub.map((subOption, index) => {
                                return (
                                    <p
                                        key={index}
                                        id={subOption}
                                        className={`${styles.option} ${
                                            subOption === subType &&
                                            styles.selectedOption
                                        }`}
                                        onClick={(event) => {
                                            subOptionClicked(event);
                                        }}
                                    >
                                        {subOption}
                                    </p>
                                );
                            })
                        );
                    })}
                </div>
            </div>
        </div>
    );

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
                        <p>accuracy</p>
                        <p>{avgAccuracy.toFixed(2)}%</p>
                    </div>
                    <div className={styles.itemLarge}>
                        <>
                            {Object.keys(userResults).length >= minTests && (
                                <Image
                                    className={styles.rankImage}
                                    src={displayRankImage() as string}
                                    width={100}
                                    height={100}
                                    alt="rank"
                                    unoptimized={true}
                                    priority={true}
                                />
                            )}
                            <div className={styles.rankTitle}>
                                <div>
                                    {Object.keys(userResults).length >=
                                        minTests && <p>Rank</p>}
                                    {Object.keys(userResults).length >=
                                        minTests && (
                                        <p className={styles.rank}>
                                            {displayRank()}
                                        </p>
                                    )}
                                </div>
                                {Object.keys(userResults).length === 0 && (
                                    <span>
                                        Finish at least {minTests} races in this
                                        mode to get a rank!
                                    </span>
                                )}
                                {Object.keys(userResults).length >=
                                    minTests && <p>{lastTenWPMAvg} wpm</p>}
                                <p>{displayTestType()}</p>
                            </div>
                        </>
                    </div>

                    <div className={styles.item}>
                        <p>cpm</p>
                        <p>{avgCPM}</p>
                    </div>
                    <div className={styles.item}>
                        <p>wpm record</p>
                        <p>{fastestWPM}</p>
                    </div>
                    {modeSelection}
                </div>
                {Object.keys(userResults).length !== 0 ? (
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
                ) : (
                    <div className={styles.item}>
                        <p>
                            Finish at least 1 test in this category to see your
                            previous results!
                        </p>
                    </div>
                )}
                {tableItems.length > 0 && (
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
                                {tableItems.length > 0 &&
                                    tableItems.map((result, index) => {
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
                                                    <td>
                                                        {result.time.toFixed(2)}
                                                        s
                                                    </td>
                                                )}
                                                {width > 650 && (
                                                    <td>{numWords}</td>
                                                )}
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
                )}
            </div>
            <Rain />
        </main>
    );
};

export default Profile;
