import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const body = await request.json();
    const { username } = body;
    const session = (await getServerSession(options)) as any;
    // get the email of the user
    const id = session?.id;

    if (!id) {
        throw new Error("User id not found or user not logged in.");
    }

    // update the user with the user name
    const result = await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            username,
        },
    });

    if (!result) {
        throw new Error("Username not updated.");
    }

    return NextResponse.json(result);
}
