import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const body = await request.json();
    const session = (await getServerSession(options)) as any;
    // get the id of the user
    const id = session?.id;

    if (!id) {
        throw new Error("User id not found or user not logged in.");
    }

    // update the user with the updated info
    const result = await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            ...body,
        },
    });

    if (!result) {
        throw new Error("User not updated.");
    }

    console.log(result);

    return NextResponse.json(result);
}
