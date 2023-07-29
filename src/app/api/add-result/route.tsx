import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const body = await request.json();
    const session = await getServerSession(options);
    console.log(body);
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

    // create the result in the database
    const result = await prisma.result.create({
        data: {
            userId: id.id,
            ...body,
        },
    });

    if (!result) {
        throw new Error("Result not created.");
    }

    console.log(result);

    return NextResponse.json(result);
}
