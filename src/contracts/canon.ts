import { z } from "zod";

export const createCanonSchema = z.object({
  appointmentId: z.string().uuid(),
  tasks: z
    .array(z.string().trim().min(1).max(500))
    .min(1, "Add at least one canon guidance item."),
  fethaDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fethaTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export type CreateCanonInput = z.infer<typeof createCanonSchema>;

export const updateCanonSchema = createCanonSchema.omit({
  appointmentId: true,
});

export type UpdateCanonInput = z.infer<typeof updateCanonSchema>;

export type FatherCanonListItem = {
  id: string;
  childName: string;
  childPhone: string | null;
  fethaDate: string;
  fethaTime: string;
  appointmentDate: string;
  appointmentStartTime: string;
  appointmentEndTime: string;
  tasks: string[];
  createdAt: string;
};

export type FatherCanonsResponse = {
  canons: FatherCanonListItem[];
};
