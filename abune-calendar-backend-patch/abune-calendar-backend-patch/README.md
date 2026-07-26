# Abune Availability Calendar — Database Patch

This patch replaces the static father-side availability calendar with a PostgreSQL/Drizzle-backed implementation.

## Included behavior

- Spiritual-father authentication and role enforcement on every action.
- Create, list, edit, and delete availability slots and blocked periods.
- Server-side Zod validation.
- Server-side overlap prevention.
- Serializable database transactions with retry protection for simultaneous writes.
- Date-level daily appointment limits.
- Addis Ababa timezone checks that reject new or moved slots in the past.
- Calendar statuses derived from the database:
  - Available
  - Awaiting Approval
  - Booked
  - Blocked
  - Past
- Reserved and booked slots cannot be edited or deleted from the Calendar page.
- Appointment-request and appointment tables prepared for the later child-request, Requests-page, and Appointments-page integration.

## Files to copy

Copy the `src` folder from this patch into the project root and allow it to merge with the existing `src` folder.

The patch adds or replaces:

```text
src/db/schema/availability.ts
src/db/schema/appointments.ts
src/db/schema/index.ts
src/types/availability.ts
src/lib/validators/availability.ts
src/server/repositories/availability.repository.ts
src/server/services/availability.service.ts
src/server/actions/availability.actions.ts
src/components/dashboard/calendar-view.tsx
src/components/dashboard/new-appointment-modal.tsx
```

## Important filename check

This patch follows the filename supplied during the review:

```text
src/db/schema/profile.ts
```

Therefore these imports use `./profile`.

When the real project file is named `profiles.ts` instead, change:

```ts
import { spiritualChildren } from "./profile";
```

to:

```ts
import { spiritualChildren } from "./profiles";
```

and change the schema index export from `./profile` to `./profiles`.

## Database migration

From the project root in PowerShell:

```powershell
npm run db:generate
npm run db:migrate
```

Then start the project:

```powershell
npm run dev
```

Review the generated migration before applying it when the database already contains production data.

## Page requirement

The existing Calendar page only needs to render:

```tsx
import { CalendarView } from "@/components/dashboard/calendar-view";

export default function CalendarPage() {
  return <CalendarView />;
}
```

No database URL, password, token, or `.env.local` file is included in this patch.

## Scope boundary

The father Calendar is connected now. The schema is ready to display pending requests and confirmed appointments once those pages write records using:

- `appointmentRequests.activeAvailabilityEntryId` while a request reserves a slot.
- `appointments.activeAvailabilityEntryId` while an appointment occupies a slot.

When a request expires, is rejected, or is cancelled, clear its active slot field. When an appointment is cancelled or moved, clear its active slot field. The historical `availabilityEntryId` remains for audit/history.

The child-side slot reservation action, request approval action, and appointment completion action are intentionally not included because their current page/component files were not part of this review.
