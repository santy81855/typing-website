import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const body = await request.json();
    const { username } = body;
    const session = await getServerSession(options);
    // get the email of the user
    const email = session?.user?.email;

    if (!email) {
        throw new Error("User email not found or user not logged in.");
    }

    // update the user with the user name
    const result = await prisma.user.update({
        where: {
            email: email,
        },
        data: {
            username,
        },
    });

    if (!result) {
        throw new Error("Username not updated.");
    }

    console.log(result);

    return NextResponse.json(result);
}
