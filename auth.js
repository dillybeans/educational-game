import "dotenv/config";
import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET || "development_secret_string_do_not_use_in_prod",
    baseURL: "http://localhost:3000",
    database: new Database("sqlite.db"),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "placeholder",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "placeholder",
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "placeholder",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder",
        }
    }
});
