import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        /*Google only provides a refresh token the FIRST time so it needs to be stored in the database*/
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username:",
                    type: "text",
                    placeholder: "your-username",
                },
                email: {
                    label: "Email:",
                    type: "text",
                    placeholder: "your-email",
                },
                password: {
                    label: "Password:",
                    type: "password",
                    placeholder: "your-password",
                },
            },
            async authorize(credentials) {
                /*this is where i would retrieve the credentials from the database storing the user information*/
                /*example: https://next-auth.js.org/configuration/providers/credentials*/
                const user = {
                    id: "42",
                    username: "testusername",
                    email: "TestUser@test.com",
                    password: "testpassword",
                };

                if (
                    credentials?.username === user.username &&
                    credentials?.password === user.password
                ) {
                    return user;
                } else {
                    return null;
                }
            },
        }),
    ],
};
