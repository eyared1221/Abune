import "server-only";

import type {
  FatherAppointmentsResponse,
  UpdateAppointmentStatusInput,
} from "@/contracts/appointment";
import {
  listAppointmentsForFather,
  updateAppointmentStatusForFather,
} from "@/server/repositories/appointment.repository";

export async function getFatherAppointments(
  fatherUserId: string,
): Promise<FatherAppointmentsResponse> {
  return {
    appointments: await listAppointmentsForFather(fatherUserId),
  };
}

export async function updateFatherAppointmentStatus({
  appointmentId,
  fatherUserId,
  input,
}: {
  appointmentId: string;
  fatherUserId: string;
  input: UpdateAppointmentStatusInput;
}) {
  return updateAppointmentStatusForFather({
    ...input,
    appointmentId,
    fatherUserId,
  });
}
