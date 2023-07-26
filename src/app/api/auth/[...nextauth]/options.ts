import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const options: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    /*custom sign in / create account / or signout pages*/
    /*
    pages: {
        signIn: "/path/to/signin",
        signOut: "/path/to/signout",
    }
    */
    providers: [
        /*Removed github because user can't login with both and it might confuse the user*/
        /*
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        */
        /*Google only provides a refresh token the FIRST time so it needs to be stored in the database*/
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email/Username:",
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
                if (credentials === undefined) {
                    throw new Error("Please enter your email and password");
                }
                /*this is where i would retrieve the credentials from the database storing the user information*/
                /*example: https://next-auth.js.org/configuration/providers/credentials*/
                // check to ensure email and password are given
                if (!credentials.email || !credentials.password) {
                    throw new Error("Please enter your email and password");
                }

                // check if user exists
                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: credentials.email },
                            { username: credentials.email },
                        ],
                    },
                });

                // if no user is found by that username or email OR if the user has no password stored (if they signed in with google or github)
                if (!user) {
                    throw new Error("No user found");
                }
                /*
                const emailToDelete = "mynameissantiagogarcia@gmail.com";

                // Use Prisma's delete method to remove the user with the specified email
                const deletedUser = await prisma.user.delete({
                    where: {
                        email: emailToDelete,
                    },
                });

                throw new Error("Deleted user: " + deletedUser);
                */
                if (!user.password) {
                    throw new Error("Signed in with Google");
                }

                // check if the password is correct
                const passwordMatch = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!passwordMatch) {
                    throw new Error("Incorrect password");
                }

                return user;
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    debug: process.env.NODE_ENV === "development",
};
