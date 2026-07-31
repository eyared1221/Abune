import "server-only";

import type {
  FatherAppointmentRequestsResponse,
  ReviewAppointmentRequestInput,
} from "@/contracts/appointment-request";
import {
  getRequestStatsForFather,
  listRequestsForFather,
  reviewRequestForFather,
} from "@/server/repositories/appointment-request.repository";

export async function getFatherAppointmentRequests(
  fatherUserId: string,
): Promise<FatherAppointmentRequestsResponse> {
  const [requests, stats] = await Promise.all([
    listRequestsForFather(fatherUserId),
    getRequestStatsForFather(fatherUserId),
  ]);

  return { requests, stats };
}

export async function reviewFatherAppointmentRequest({
  fatherUserId,
  input,
  requestId,
  reviewedByUserId,
}: {
  fatherUserId: string;
  input: ReviewAppointmentRequestInput;
  requestId: string;
  reviewedByUserId: string;
}) {
  return reviewRequestForFather({
    ...input,
    fatherUserId,
    requestId,
    reviewedByUserId,
  });
}
