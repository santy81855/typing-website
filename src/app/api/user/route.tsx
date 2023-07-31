import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const session = (await getServerSession(options)) as any;
    // get the email of the user
    const id = session?.id;

    if (!id) {
        throw new Error("User id not found or user not logged in.");
    }

    // query the database for the id of the user with this email
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!user) {
        // if no user return null
        return NextResponse.json(null);
    }

    return NextResponse.json(user);
}
