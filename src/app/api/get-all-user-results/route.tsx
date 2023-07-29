import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const session = await getServerSession(options);
    // get the email of the user
    const email = session?.user?.email;

    if (!email) {
        throw new Error("User email not found or user not logged in.");
    }

    // query the database for the id of the user with this email
    const id = await prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
        },
    });

    if (!id) {
        throw new Error("Not logged in.");
    }

    // get all the results of the user
    const result = await prisma.result.findMany({
        where: {
            userId: id.id,
        },
    });

    if (!result) {
        throw new Error("Result not created.");
    }

    return NextResponse.json(result);
}
