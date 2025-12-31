import {
	QUEUE_NAMES,
	redisConnection,
	type WhatsAppNotificationJob,
} from "@maulocum/shared";
import { Queue } from "bullmq";

export class QueueService {
	private whatsappQueue: Queue<WhatsAppNotificationJob>;

	constructor() {
		this.whatsappQueue = new Queue<WhatsAppNotificationJob>(
			QUEUE_NAMES.WHATSAPP_NOTIFICATIONS,
			{
				connection: redisConnection,
				defaultJobOptions: {
					attempts: 3,
					backoff: {
						type: "exponential",
						delay: 2000,
					},
					removeOnComplete: {
						count: 100,
						age: 24 * 3600,
					},
					removeOnFail: {
						count: 1000,
						age: 7 * 24 * 3600,
					},
				},
			},
		);
	}

	async addWhatsAppNotification(data: WhatsAppNotificationJob) {
		try {
			const job = await this.whatsappQueue.add(
				"send-whatsapp-notification",
				data,
				{
					priority: 1,
				},
			);

			console.log(`WhatsApp notification job added: ${job.id}`);
			return { success: true, jobId: job.id };
		} catch (error) {
			console.error("Failed to add WhatsApp notification job:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	async getJobStatus(jobId: string) {
		try {
			const job = await this.whatsappQueue.getJob(jobId);
			if (!job) {
				return { status: "not_found" };
			}

			const state = await job.getState();
			return {
				status: state,
				data: job.data,
				progress: job.progress,
				returnvalue: job.returnvalue,
				failedReason: job.failedReason,
			};
		} catch (error) {
			console.error("Failed to get job status:", error);
			return { status: "error", error };
		}
	}

	async close() {
		await this.whatsappQueue.close();
	}
}

export const queueService = new QueueService();
