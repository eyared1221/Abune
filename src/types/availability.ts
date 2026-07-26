export const meetingMethodValues = ["in-person", "phone", "online"] as const;
export type MeetingMethod = (typeof meetingMethodValues)[number];

export const appointmentReasonValues = [
  "confession",
  "spiritual-guidance",
  "counseling",
  "repentance",
  "family-issue",
  "other",
] as const;
export type AppointmentReason = (typeof appointmentReasonValues)[number];

export type ScheduleStatus = "available";

export type AvailabilityFormSubmission = {
  date: string;
  startTime: string;
  endTime: string;
  meetingMethod: MeetingMethod;
  location: string;
  notes: string;
};

// Kept so existing imports using the old name do not need to change immediately.
export type NewAppointmentSubmission = AvailabilityFormSubmission;

export type CalendarEntryDto = AvailabilityFormSubmission & {
  id: string;
  endTime: string;
  status: ScheduleStatus;
  editable: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AvailabilityCalendarData = {
  entries: CalendarEntryDto[];
};

export type AvailabilityCalendarActionResult =
  | {
      success: true;
      data: AvailabilityCalendarData;
    }
  | {
      success: false;
      error: string;
      field?: string;
    };

export type AvailabilityMutationActionResult =
  | {
      success: true;
      entry: CalendarEntryDto;
    }
  | {
      success: false;
      error: string;
      field?: string;
    };

export type AvailabilityDeleteActionResult =
  | {
      success: true;
      id: string;
    }
  | {
      success: false;
      error: string;
    };
