import { z } from "zod";

const genderValues = ["MALE", "FEMALE"] as const;
const yesNoValues = ["YES", "NO"] as const;
const educationalLevelValues = [
  "NON_FORMAL",
  "PRIMARY",
  "SECONDARY",
  "TVET_DIPLOMA",
  "BACHELOR",
  "MASTER",
  "PHD",
] as const;
const spiritualEducationValues = [
  "BASIC_CHRISTIAN_EDUCATION_ONLY",
  "FORMER_SUNDAY_SCHOOL_STUDENT",
  "CURRENT_SUNDAY_SCHOOL_STUDENT",
  "CHURCH_COURSES",
  "THEOLOGICAL_COLLEGE",
  "ABINET_EDUCATION",
] as const;
const abinetDisciplineValues = [
  "ZEMA",
  "KIDASE",
  "QENE",
  "SCRIPTURE_INTERPRETATION",
] as const;
const holyCommunionFrequencyValues = [
  "EVERY_SUNDAY",
  "EVERY_MONTH",
  "SEVERAL_TIMES_A_YEAR",
  "MAJOR_FEASTS_ONLY",
  "RARELY",
  "NEVER",
] as const;
const maritalStatusValues = [
  "SINGLE",
  "ORTHODOX_HOLY_MATRIMONY",
  "CIVIL_OR_TRADITIONAL_MARRIAGE",
  "DIVORCED",
  "WIDOWED",
] as const;
const prayerBookValues = [
  "WUDASE_MARYAM",
  "PSALMS",
  "BOOK_OF_HOURS",
  "HOLY_BIBLE",
  "OTHER",
] as const;
const relationshipValues = [
  "PARENT",
  "SIBLING",
  "SPOUSE",
  "GUARDIAN",
  "RELATIVE",
  "FRIEND",
] as const;

const requiredText = (label: string, max = 500) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} is too long.`);

const optionalText = (max = 4_000) =>
  z.string().trim().max(max, "This value is too long.").default("");

const dateString = (label: string) =>
  requiredText(label, 10)
    .regex(/^\d{4}-\d{2}-\d{2}$/, `${label} must use YYYY-MM-DD.`)
    .refine((value) => {
      const date = new Date(`${value}T00:00:00.000Z`);
      return !Number.isNaN(date.getTime());
    }, `${label} is not a valid date.`);

const nonFutureDateString = (label: string) =>
  dateString(label).refine((value) => {
    const valueDate = new Date(`${value}T00:00:00.000Z`);
    const today = new Date();
    today.setUTCHours(23, 59, 59, 999);
    return valueDate <= today;
  }, `${label} cannot be in the future.`);

const phoneNumber = z
  .string()
  .trim()
  .min(7, "Phone number is too short.")
  .max(40, "Phone number is too long.")
  .regex(
    /^[0-9+()\-\s]+$/,
    "Phone number contains unsupported characters.",
  );

const optionalWholeNumberString = (label: string, max: number) =>
  z
    .string()
    .trim()
    .default("")
    .refine(
      (value) =>
        value === "" ||
        (/^\d+$/.test(value) &&
          Number(value) >= 0 &&
          Number(value) <= max),
      `${label} must be a whole number between 0 and ${max}.`,
    );

const childRowSchema = z
  .object({
    id: z.number(),
    name: z.string().trim().default(""),
    gender: z.string().trim().default(""),
    dateOfBirth: z.string().trim().default(""),
  })
  .superRefine((child, context) => {
    const hasAnyValue =
      child.name !== "" ||
      child.gender !== "" ||
      child.dateOfBirth !== "";

    if (!hasAnyValue) {
      return;
    }

    if (!child.name) {
      context.addIssue({
        code: "custom",
        path: ["name"],
        message: "Each listed child must have a name.",
      });
    }

    if (!genderValues.includes(child.gender as (typeof genderValues)[number])) {
      context.addIssue({
        code: "custom",
        path: ["gender"],
        message: "Each listed child must have a valid gender.",
      });
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(child.dateOfBirth) ||
      Number.isNaN(
        new Date(`${child.dateOfBirth}T00:00:00.000Z`).getTime(),
      )
    ) {
      context.addIssue({
        code: "custom",
        path: ["dateOfBirth"],
        message: "Each listed child must have a valid date of birth.",
      });
    }
  });

export const spiritualChildSubmissionSchema = z
  .object({
    baptismalName: requiredText("Baptismal name", 160),
    legalName: requiredText("Legal name", 200),
    gender: z.enum(genderValues),
    dateOfBirth: nonFutureDateString("Date of birth"),
    phoneNumber,
    address: requiredText("Address", 2_000),
    occupation: requiredText("Occupation", 180),
    educationalLevel: z.enum(educationalLevelValues),

    spiritualEducation: z
      .array(z.enum(spiritualEducationValues))
      .min(1, "Select at least one spiritual education option.")
      .transform((values) => [...new Set(values)]),
    sundaySchoolYears: optionalWholeNumberString(
      "Sunday school years",
      100,
    ),
    abinetDisciplines: z
      .array(z.enum(abinetDisciplineValues))
      .transform((values) => [...new Set(values)]),

    previousSpiritualFather: requiredText("Previous spiritual father", 200),
    reasonForChangingSpiritualFather: optionalText(),
    receivedPreviousFatherBlessing: z.enum(yesNoValues),
    placeOfBaptism: requiredText("Place of baptism", 240),
    dateOfBaptism: nonFutureDateString("Date of baptism"),
    holyCommunionFrequency: z.enum(holyCommunionFrequencyValues),

    prayerFrequency: requiredText("Prayer frequency", 1_000),
    prayerBooks: z
      .array(z.enum(prayerBookValues))
      .min(1, "Select at least one prayer book.")
      .transform((values) => [...new Set(values)]),
    otherPrayerBook: optionalText(240),
    fastingPractice: requiredText("Fasting practice", 4_000),
    readsSpiritualBooks: z.enum(yesNoValues),
    hasDailyProstrationRule: z.enum(yesNoValues),
    dailyProstrationCount: optionalWholeNumberString(
      "Daily prostration count",
      100_000,
    ),
    faithfullyGivesTithe: z.enum(yesNoValues),

    maritalStatus: z.enum(maritalStatusValues),
    spiritualChildJoinedDate: z
      .union([nonFutureDateString("Joined date"), z.literal("")])
      .optional()
      .default(""),
    spouseName: optionalText(200),
    children: z.array(childRowSchema).max(30),
    spouseSpiritualFather: optionalText(200),
    childrenNamesAndAges: optionalText().optional(),
    greatestFamilyChallenge: requiredText("Greatest family challenge", 4_000),
    healthStatus: requiredText("Health status", 4_000),

    bodilyTemptations: requiredText(
      "Bodily temptations or addictions",
      4_000,
    ),
    spiritualEmotionalStruggles: requiredText(
      "Spiritual and emotional struggles",
      4_000,
    ),
    significantFutureDecisions: requiredText(
      "Significant future life decisions",
      4_000,
    ),
    additionalInformation: optionalText().optional(),
  })
  .superRefine((submission, context) => {
    if (
      submission.prayerBooks.includes("OTHER") &&
      !submission.otherPrayerBook
    ) {
      context.addIssue({
        code: "custom",
        path: ["otherPrayerBook"],
        message: "Enter the name of the other prayer book.",
      });
    }

    if (
      submission.hasDailyProstrationRule === "YES" &&
      !submission.dailyProstrationCount
    ) {
      context.addIssue({
        code: "custom",
        path: ["dailyProstrationCount"],
        message: "Enter the daily prostration count.",
      });
    }

    const birthDate = new Date(
      `${submission.dateOfBirth}T00:00:00.000Z`,
    );
    const baptismDate = new Date(
      `${submission.dateOfBaptism}T00:00:00.000Z`,
    );

    if (baptismDate < birthDate) {
      context.addIssue({
        code: "custom",
        path: ["dateOfBaptism"],
        message: "Date of baptism cannot be before date of birth.",
      });
    }
  });

export type ValidatedSpiritualChildSubmission = z.infer<
  typeof spiritualChildSubmissionSchema
>;
