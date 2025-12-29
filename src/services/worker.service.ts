import { Worker, type Job } from "bullmq";
import {
	QUEUE_NAMES,
	type WhatsAppNotificationJob,
	type WhatsAppNotificationResult,
} from "../types";
import { whatsappService } from "./whatsapp.service";
import { redisConnection } from "@/config";

export class WhatsAppWorker {
	private worker: Worker<WhatsAppNotificationJob, WhatsAppNotificationResult>;

	constructor() {
		this.worker = new Worker(
			QUEUE_NAMES.WHATSAPP_NOTIFICATIONS,
			async (job) => {
				return this.processWhatsAppNotification(job);
			},
			{
				connection: redisConnection,
				concurrency: 5,
				limiter: {
					max: 10,
					duration: 1000,
				},
			},
		);

		this.worker.on("completed", (job) => {
			console.log(`Job ${job.id} completed successfully`);
		});

		this.worker.on("failed", (job, err) => {
			console.error(`Job ${job?.id} failed:`, err);
		});

		this.worker.on("error", (err) => {
			console.error("Worker error:", err);
		});
	}

	private async processWhatsAppNotification(
		job: Job<WhatsAppNotificationJob>,
	): Promise<WhatsAppNotificationResult> {
		const { phoneNumber, message, metadata } = job.data;

		console.log(`Processing WhatsApp notification for ${phoneNumber}`);
		console.log(`Message: ${message}`);

		if (metadata) {
			console.log("Metadata:", metadata);
		}

		await job.updateProgress(50);

		const result = await whatsappService.sendMessage(phoneNumber, message);

		await job.updateProgress(100);

		return result;
	}

	async close() {
		await this.worker.close();
	}

	getWorker() {
		return this.worker;
	}
}

export const whatsappWorker = new WhatsAppWorker();
