import { z } from "zod";

export const appointmentRequestStatuses = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "EXPIRED",
] as const;

export const appointmentRequestStatusSchema = z.enum(
  appointmentRequestStatuses,
);

export type AppointmentRequestStatus =
  z.infer<typeof appointmentRequestStatusSchema>;

export const appointmentRequestReasons = [
  "confession",
  "spiritual-guidance",
  "counseling",
  "repentance",
  "family-issue",
  "other",
] as const;

export const appointmentRequestReasonSchema = z.enum(
  appointmentRequestReasons,
);

export type AppointmentRequestReason =
  z.infer<typeof appointmentRequestReasonSchema>;

export const meetingMethods = [
  "in-person",
  "phone",
  "online",
] as const;

export const meetingMethodSchema = z.enum(meetingMethods);

export type AppointmentRequestMeetingMethod =
  z.infer<typeof meetingMethodSchema>;

export const reviewAppointmentRequestSchema = z.object({
  action: z.enum(["ACCEPT", "DECLINE"]),
  responseNote: z
    .string()
    .trim()
    .max(1000, "The response note is too long.")
    .nullable()
    .optional(),
});

export type ReviewAppointmentRequestInput =
  z.infer<typeof reviewAppointmentRequestSchema>;

export type AppointmentRequestListItem = {
  id: string;
  childId: string;
  childName: string;
  childPhone: string | null;
  reason: AppointmentRequestReason;
  requestMessage: string | null;
  status: AppointmentRequestStatus;
  requestedDate: string;
  requestedStartTime: string;
  requestedEndTime: string;
  meetingMethod: AppointmentRequestMeetingMethod;
  location: string | null;
  responseNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

export type AppointmentRequestStats = {
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
  expired: number;
  total: number;
};

export type FatherAppointmentRequestsResponse = {
  requests: AppointmentRequestListItem[];
  stats: AppointmentRequestStats;
};
