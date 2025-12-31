export interface WhatsAppNotificationJob {
    phoneNumber: string;
    message: string;
    metadata?: {
        doctorName?: string;
        jobTitle?: string;
        facilityName?: string;
        startDate?: string;
        endDate?: string;
        confirmationUrl?: string;
        applicationId?: string;
    };
}

export interface WhatsAppNotificationResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

export const QUEUE_NAMES = {
    WHATSAPP_NOTIFICATIONS: "whatsapp-notifications",
} as const;
