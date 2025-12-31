const WAHA_CONTAINER_URL =
	process.env.CONTAINER_WAHA_PUBLIC_URL || "http://waha:3000";
const WAHA_SESSION = process.env.WAHA_START_SESSION || "default";
const WAHA_API_KEY = process.env.WAHA_API_KEY || "api-key";

export class WhatsAppService {
	private baseUrl: string;
	private session: string;

	constructor() {
		this.baseUrl = WAHA_CONTAINER_URL;
		this.session = WAHA_SESSION;
	}

	async sendMessage(phoneNumber: string, message: string) {
		try {
			const formattedPhone = this.formatPhoneNumber(phoneNumber);

			console.log(this.baseUrl);
			console.log(WAHA_API_KEY);

			const response = await fetch(`${this.baseUrl}/api/sendText`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",

					"X-Api-Key": WAHA_API_KEY,
				},
				body: JSON.stringify({
					session: this.session,
					chatId: formattedPhone,
					text: message,
				}),
			});

			if (!response.ok) {
				const error = await response.text();
				throw new Error(`Waha API error: ${error}`);
			}

			const result = (await response.json()) as { id: string };
			return {
				success: true,
				messageId: result.id,
			};
		} catch (error) {
			console.error("Failed to send WhatsApp message:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	private formatPhoneNumber(phoneNumber: string): string {
		let cleaned = phoneNumber.replace(/\D/g, "");

		if (cleaned.startsWith("0")) {
			cleaned = `60${cleaned.substring(1)}`;
		} else if (!cleaned.startsWith("60")) {
			cleaned = `60${cleaned}`;
		}

		return `${cleaned}@c.us`;
	}

	async getSessionStatus() {
		try {
			const response = await fetch(
				`${this.baseUrl}/api/sessions/${this.session}`,
			);

			if (!response.ok) {
				return { status: "disconnected" };
			}

			return await response.json();
		} catch (error) {
			console.error("Failed to get session status:", error);
			return { status: "error", error };
		}
	}
}

export const whatsappService = new WhatsAppService();
