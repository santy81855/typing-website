"use client";
import styles from "@/styles/Nav.module.css";

const Nav = () => {
    return (
        <main className={styles.main}>
            <div className={styles.navContainer}>
                <div className={styles.container}>
                    <div className={styles.logo}>logo</div>
                    <p>App Name</p>
                    <p>Settings</p>
                </div>
                <nav className={styles.container}>
                    <p>username</p>
                    <p>Profile</p>
                </nav>
            </div>
        </main>
    );
};

export default Nav;
