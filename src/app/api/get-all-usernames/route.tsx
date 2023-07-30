import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    // query the database for all usernames
    const allUsernames = await prisma.user.findMany({
        select: {
            username: true,
        },
    });

    return NextResponse.json(allUsernames);
}
