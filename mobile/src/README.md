# Spiritual Child source inventory

Only these mobile screens and reusable React components belong in `mobile/src`.
The Spiritual Father portal remains in the root Next.js project.

```text
pages/
  LoginPage.tsx
  ChildHomePage.tsx
  AppointmentsPage.tsx
  MessagesPage.tsx
  SpiritualDatesPage.tsx
  TimelinePage.tsx
  RemindersPage.tsx
  ProfilePage.tsx
components/
  layout/AppHeader.tsx
  layout/BottomNavigation.tsx
  auth/LoginForm.tsx
  appointments/AppointmentReasonPicker.tsx
  appointments/AvailableSlotList.tsx
  appointments/AppointmentRequestList.tsx
  common/LoadingScreen.tsx
  common/EmptyState.tsx
  common/ErrorNotice.tsx
lib/
  api.ts
  auth.ts
  token-store.ts
App.tsx
main.tsx
```

The current `App.tsx` is a small working prototype containing these child-only
screens. Extract each named screen/component as it expands. Never add Drizzle,
database code, server actions, or portal-only components to this directory.
