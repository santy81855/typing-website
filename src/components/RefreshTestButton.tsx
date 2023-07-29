import React from "react";
import Image from "next/image";
import styles from "@/styles/RefreshTestButton.module.css";

type props = {
    restartTest: () => void;
};

const RefreshTestButton = ({ restartTest }: props) => {
    return (
        <i
            className={`fas fa-fw fa-redo-alt ${styles.refreshButton}`}
            onClick={() => {
                restartTest();
            }}
        ></i>
    );
};

export default RefreshTestButton;
