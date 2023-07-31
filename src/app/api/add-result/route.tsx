import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const body = await request.json();
    // casted as any because i added my own properties to it
    const session = (await getServerSession(options)) as any;
    // get the user id
    const id = session?.id;

    if (!id) {
        throw new Error("Not logged in.");
    }

    // create the result in the database
    const result = await prisma.result.create({
        data: {
            userId: id,
            ...body,
        },
    });

    if (!result) {
        throw new Error("Result not created.");
    }

    console.log(result);

    return NextResponse.json(result);
}
