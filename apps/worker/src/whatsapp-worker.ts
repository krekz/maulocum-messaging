import { whatsappWorker } from "./services/worker.service";

console.log("🚀 WhatsApp Worker started");

const gracefulShutdown = async (signal: string) => {
	console.log(`\n${signal} received, closing worker gracefully...`);
	await whatsappWorker.close();
	process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

const worker = whatsappWorker.getWorker();

worker.on("ready", () => {
	console.log("✅ Worker is ready and waiting for jobs");
});

worker.on("active", (job) => {
	console.log(`📤 Processing job ${job.id}`);
});

worker.on("completed", (job, result) => {
	console.log(`✅ Job ${job.id} completed:`, result);
});

worker.on("failed", (job, err) => {
	console.error(`❌ Job ${job?.id} failed:`, err.message);
});

worker.on("error", (err) => {
	console.error("❌ Worker error:", err);
});

console.log("👂 Worker is listening for jobs...");
