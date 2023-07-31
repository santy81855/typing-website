import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const session = (await getServerSession(options)) as any;
    // get the email of the user
    const id = session?.id;

    if (!id) {
        throw new Error("Not logged in.");
    }

    // get all the results of the user
    const result = await prisma.result.findMany({
        where: {
            userId: id,
        },
    });

    if (!result) {
        throw new Error("Result not created.");
    }

    return NextResponse.json(result);
}
