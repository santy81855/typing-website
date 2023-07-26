import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { username, email, password } = body;

    // if they are missing any fileds, return an error
    if (!username || !email || !password) {
        return new NextResponse("Missing required fields", { status: 400 });
    }

    // if there is already a user with that username or email, return an error
    const exist = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (exist) {
        throw new Error("Email already exists");
    }

    // if the user is valid then hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create the user in the database
    const user = await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: hashedPassword,
        },
    });

    console.log(user);

    return NextResponse.json(user);
}
