export const appointmentStatuses = [
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
  "RESCHEDULED",
] as const;

export type AppointmentStatus =
  (typeof appointmentStatuses)[number];

export type FatherAppointmentListItem = {
  id: string;
  childId: string;
  childName: string;
  childPhone: string | null;
  reason: string;
  status: AppointmentStatus;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  meetingMethod: string;
  location: string | null;
  notes: string | null;
};

export type FatherAppointmentsResponse = {
  appointments: FatherAppointmentListItem[];
};

export const updateAppointmentStatusSchema = z.object({
  action: z.enum(["COMPLETE", "CANCEL", "REOPEN", "FOLLOW_UP"]),
});

export type UpdateAppointmentStatusInput = z.infer<
  typeof updateAppointmentStatusSchema
>;
import { z } from "zod";
