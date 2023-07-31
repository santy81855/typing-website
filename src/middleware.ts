// this line applies next-auth to the entire app
export { default } from "next-auth/middleware";

// to only apply it to certain pages use a matcher
export const config = { matcher: ["/user-setup", "/page2"] };
