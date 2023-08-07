"use client";
import React, { useEffect, useState } from "react";
import styles from "@/styles/Profile.module.css";
import axios from "axios";

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
}

const Profile = () => {
    const [username, setUsername] = useState("");
    const [userResults, setUserResults] = useState<UserResult[]>([]);
    useEffect(() => {
        getUser();
        getUserResults();
    }, []);

    const getUserResults = async () => {
        // post request with axios
        axios
            .get("/api/get-all-user-results")
            .then((res) => {
                console.log(res.data);
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
                // get the last 10
                temp = temp.slice(0, 10);
                setUserResults(temp);
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
            },
            title: {
                display: true,
                text: "Last 10 Tests",
            },
        },
    };

    const labels = userResults.map((result) => {
        // turn the dates into a string
        const date = new Date(result.date);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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
            <div className={styles.section}>
                <h1>{username}</h1>
                <div className={styles.graphContainer}>
                    <Line options={options} data={data} />
                </div>
            </div>
        </main>
    );
};

export default Profile;
