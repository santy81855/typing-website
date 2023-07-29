"use client";
import styles from "@/styles/Nav.module.css";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const Nav = () => {
    const { data: session } = useSession();
    return (
        <main className={styles.main}>
            <div className={styles.navContainer}>
                <div className={styles.container}>
                    <Link href="/" className={styles.leftContainer}>
                        <Image
                            className={styles.logo}
                            src="/images/logo-circular.webp"
                            width={30}
                            height={30}
                            alt="logo"
                            unoptimized={true}
                        />
                        <p className={styles.appName}>Blah Type</p>
                    </Link>
                    {session !== null && (
                        <i
                            className={`fas fa-fw fa-cog ${styles.settingsIcon}`}
                        ></i>
                    )}
                </div>
                <nav className={styles.container}>
                    {session === null ? (
                        <Link href="/login">login</Link>
                    ) : (
                        <>
                            <p className={styles.username}>
                                {session?.user?.name}
                            </p>
                            {session?.user?.image ? (
                                <Image
                                    className={styles.userImage}
                                    src={session?.user?.image}
                                    width={30}
                                    height={30}
                                    alt="user"
                                    unoptimized={true}
                                />
                            ) : (
                                <Link href="/profile">Profile</Link>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </main>
    );
};

export default Nav;
