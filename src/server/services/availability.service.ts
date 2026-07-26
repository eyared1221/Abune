import {
  createAvailabilityEntryForFather,
  deleteAvailabilityEntryForFather,
  listAvailabilityCalendarByFather,
  updateAvailabilityEntryForFather,
  type CalendarRepositoryEntry,
  type SaveAvailabilityRepositoryInput,
} from "@/server/repositories/availability.repository";
import {
  availabilityIdSchema,
  availabilityRangeSchema,
  availabilitySubmissionSchema,
} from "@/lib/validators/availability";
import type {
  AvailabilityCalendarData,
  AvailabilityFormSubmission,
  CalendarEntryDto,
} from "@/types/availability";

function nullIfEmpty(value: string) {
  const cleaned = value.trim();
  return cleaned === "" ? null : cleaned;
}

function formatTime(value: string) {
  return value.slice(0, 5);
}

function toRepositoryInput(
  submission: AvailabilityFormSubmission,
): SaveAvailabilityRepositoryInput {
  const validated = availabilitySubmissionSchema.parse(submission);
  return {
    scheduleDate: validated.date,
    startTime: validated.startTime,
    endTime: validated.endTime,
    meetingMethod: validated.meetingMethod,
    location: validated.location,
    notes: nullIfEmpty(validated.notes),
  };
}

function mapRepositoryEntryToDto(
  value: CalendarRepositoryEntry,
): CalendarEntryDto {
  const { entry } = value;
  return {
    id: entry.id,
    date: entry.scheduleDate,
    startTime: formatTime(entry.startTime),
    endTime: formatTime(entry.endTime),
    meetingMethod: entry.meetingMethod,
    location: entry.location,
    notes: entry.notes ?? "",
    status: "available",
    editable: true,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

export async function listAvailabilityCalendar(
  fatherUserId: string,
  range: { startDate: string; endDate: string },
): Promise<AvailabilityCalendarData> {
  const validated = availabilityRangeSchema.parse(range);
  const data = await listAvailabilityCalendarByFather(
    fatherUserId,
    validated.startDate,
    validated.endDate,
  );

  return {
    entries: data.entries.map(mapRepositoryEntryToDto),
  };
}

export async function createAvailability(
  fatherUserId: string,
  submission: AvailabilityFormSubmission,
): Promise<CalendarEntryDto> {
  console.log("Service: Creating availability for father:", fatherUserId);
  console.log("Service: Submission data:", submission);
  const input = toRepositoryInput(submission);
  console.log("Service: Repository input:", input);
  const created = await createAvailabilityEntryForFather(fatherUserId, input);
  console.log("Service: Created entry from repository:", created);

  const dto = mapRepositoryEntryToDto({
    entry: created,
  });
  console.log("Service: Returning DTO:", dto);
  return dto;
}

export async function updateAvailability(
  fatherUserId: string,
  entryId: string,
  submission: AvailabilityFormSubmission,
): Promise<CalendarEntryDto> {
  const validId = availabilityIdSchema.parse(entryId);
  const input = toRepositoryInput(submission);
  const updated = await updateAvailabilityEntryForFather(
    fatherUserId,
    validId,
    input,
  );

  return mapRepositoryEntryToDto({
    entry: updated,
  });
}

export async function deleteAvailability(
  fatherUserId: string,
  entryId: string,
): Promise<string> {
  const validId = availabilityIdSchema.parse(entryId);
  await deleteAvailabilityEntryForFather(fatherUserId, validId);
  return validId;
}
