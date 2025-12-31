import { Elysia, status } from "elysia";
import { apiKeyAuth } from "./middleware/auth";
import { message } from "./modules/message";

const app = new Elysia()
	.onError(({ code, error }) => {
		switch (code) {
			case "VALIDATION":
				console.error("Validation Error: ", error.message);
				console.error("Summary: ", error.all[0].summary);
				return status(error.status, {
					success: false,
					message: error.all[0].summary,
				});

			case 401:
				console.error("Unauthorized Error: ", error.response);
				return status(error.code, {
					success: false,
					message: error.response,
				});
		}
	})
	.get("/", () => "OK")
	.use(apiKeyAuth)
	.use(message)
	.listen(3002);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
