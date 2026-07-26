import { z } from "zod";

import {
  meetingMethodValues,
} from "@/types/availability";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

function normalizeTime(value: string) {
  return value.slice(0, 5);
}

function isValidDate(value: string) {
  if (!datePattern.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export const availabilityRangeSchema = z
  .object({
    startDate: z.string().refine(isValidDate, "Start date is invalid."),
    endDate: z.string().refine(isValidDate, "End date is invalid."),
  })
  .superRefine((range, context) => {
    if (range.endDate < range.startDate) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date cannot be before start date.",
      });
    }

    const start = new Date(`${range.startDate}T00:00:00.000Z`);
    const end = new Date(`${range.endDate}T00:00:00.000Z`);
    const days = Math.round((end.getTime() - start.getTime()) / 86_400_000);

    if (days > 62) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Load no more than 63 calendar days at once.",
      });
    }
  });

export const availabilityIdSchema = z.string().uuid("Calendar entry ID is invalid.");

export const availabilitySubmissionSchema = z
  .object({
    date: z.string().refine(isValidDate, "Date is invalid."),
    startTime: z
      .string()
      .regex(timePattern, "Start time must use HH:mm format.")
      .transform(normalizeTime),
    endTime: z
      .string()
      .regex(timePattern, "End time must use HH:mm format.")
      .transform(normalizeTime),
    meetingMethod: z.enum(meetingMethodValues),
    location: z
      .string()
      .trim()
      .min(1, "Location is required.")
      .max(1_000, "Location is too long."),
    notes: z.string().trim().max(250, "Notes cannot exceed 250 characters.").default(""),
  })
  .superRefine((submission, context) => {
    const [hours = 0, minutes = 0] = submission.startTime
      .split(":")
      .map(Number);
    const startMinutes = hours * 60 + minutes;
    const [endHours = 0, endMinuteValue = 0] = submission.endTime
      .split(":")
      .map(Number);
    const endMinutes = endHours * 60 + endMinuteValue;

    if (endMinutes <= startMinutes) {
      context.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "End time must be after start time.",
      });
    } else if (endMinutes - startMinutes > 240) {
      context.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "An appointment time cannot exceed four hours.",
      });
    }
  });

export type ValidatedAvailabilitySubmission = z.infer<
  typeof availabilitySubmissionSchema
>;
