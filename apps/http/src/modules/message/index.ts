import { type Elysia, t } from "elysia";
import { queueService } from "../../services/queue.service";

export const message = (app: Elysia) =>
	app.group("/api/whatsapp", (app) =>
		// POST /api/whatsapp/job/application/approve
		app.post(
			"/job",
			async ({ body }) => {
				await queueService.addWhatsAppNotification({
					phoneNumber: body.phoneNumber,
					message: body.message,
					metadata: {
						doctorName: body.metadata.doctorName,
						jobTitle: body.metadata.jobTitle,
						facilityName: body.metadata.facilityName,
						startDate: body.metadata.startDate.toISOString(),
						endDate: body.metadata.endDate.toISOString(),
						confirmationUrl: body.metadata.confirmationUrl,
						applicationId: body.metadata.applicationId,
					},
				});

				console.log("Message sent successfully ✅");
				return {
					success: true,
					message: "Message sent successfully",
				};
			},
			{
				body: t.Object({
					phoneNumber: t.String({
						minLength: 9,
						maxLength: 13,
						pattern: "^[0-9]+$",
					}),
					message: t.String(),
					metadata: t.Object({
						doctorName: t.String(),
						jobTitle: t.String(),
						facilityName: t.String(),
						startDate: t.Date(),
						endDate: t.Date(),
						confirmationUrl: t.String(),
						applicationId: t.String(),
					}),
				}),
				detail: {
					description: "Send message notification",
				},
			},
		),
	);
