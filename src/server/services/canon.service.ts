import "server-only";

import type {
  CreateCanonInput,
  FatherCanonsResponse,
  UpdateCanonInput,
} from "@/contracts/canon";
import {
  createCanonForFather,
  deleteCanonForFather,
  listCanonsForFather,
  updateCanonForFather,
} from "@/server/repositories/canon.repository";

export function createFatherCanon(
  fatherUserId: string,
  input: CreateCanonInput,
) {
  return createCanonForFather({ fatherUserId, input });
}

export async function getFatherCanons(
  fatherUserId: string,
): Promise<FatherCanonsResponse> {
  return { canons: await listCanonsForFather(fatherUserId) };
}

export function updateFatherCanon(
  fatherUserId: string,
  canonId: string,
  input: UpdateCanonInput,
) {
  return updateCanonForFather({ fatherUserId, canonId, input });
}

export function deleteFatherCanon(fatherUserId: string, canonId: string) {
  return deleteCanonForFather(canonId, fatherUserId);
}
