import "dotenv/config";
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());

// Mount Better Auth handler. This handles all /api/auth routes
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

// Serve static files from the root directory
app.use(express.static(".", { index: "index.html" }));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
