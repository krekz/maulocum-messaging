import { Elysia, status } from "elysia";

const API_KEY = process.env.HTTP_API_KEY;

if (!API_KEY) {
	throw new Error("Missing HTTP_API_KEY in environment variables");
}

export const apiKeyAuth = new Elysia().derive(
	{ as: "global" },
	({ headers }) => {
		const apiKey = headers["x-api-key"];

		if (!apiKey || apiKey !== API_KEY) {
			throw status(401, "Unauthorized: Invalid or missing API key");
		}

		return {};
	},
);
