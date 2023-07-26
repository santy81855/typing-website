import { prisma } from "@/lib/prisma";
import React from "react";

const DatabaseTest = async () => {
    const user = await prisma.user.findUnique({
        where: {
            username: "testusername",
        },
    });

    return (
        <main>
            <h1>{user?.username}</h1>
        </main>
    );
};

export default DatabaseTest;
