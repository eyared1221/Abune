import {
  createSpiritualChild,
  listSpiritualChildrenByFather,
  type CreateSpiritualChildRepositoryInput,
  type SpiritualChildAggregate,
} from "@/server/repositories/child.repository";
import type {
  NewSpiritualChildSubmission,
  PersistedSpiritualChild,
} from "@/types/spiritual-child";
import { spiritualChildSubmissionSchema } from "@/lib/validators/spiritual-child";

function nullIfEmpty(value: string) {
  const cleaned = value.trim();
  return cleaned === "" ? null : cleaned;
}

function toOptionalNumber(value: string) {
  return value === "" ? null : Number(value);
}

function toBoolean(value: "YES" | "NO") {
  return value === "YES";
}

function mapStatus(
  value: string,
): PersistedSpiritualChild["status"] {
  switch (value) {
    case "NEEDS_FOLLOW_UP":
      return "Needs Follow-up";
    case "INACTIVE":
      return "Inactive";
    default:
      return "Active";
  }
}

function mapAggregateToDto(
  aggregate: SpiritualChildAggregate,
): PersistedSpiritualChild {
  const { profile, privateIntake, children } = aggregate;

  const submission: NewSpiritualChildSubmission = {
    baptismalName: profile.baptismalName,
    legalName: profile.legalName,
    gender: profile.gender,
    dateOfBirth: profile.dateOfBirth,
    phoneNumber: profile.phoneNumber,
    address: profile.address,
    occupation: profile.occupation,
    educationalLevel: profile.educationalLevel ?? "",

    spiritualEducation: profile.spiritualEducation,
    sundaySchoolYears:
      profile.sundaySchoolYears === null
        ? ""
        : String(profile.sundaySchoolYears),
    abinetDisciplines: profile.abinetDisciplines,

    previousSpiritualFather: profile.previousSpiritualFather ?? "",
    reasonForChangingSpiritualFather:
      profile.reasonForChangingSpiritualFather ?? "",
    receivedPreviousFatherBlessing:
      profile.receivedPreviousFatherBlessing ? "YES" : "NO",
    placeOfBaptism: profile.placeOfBaptism,
    dateOfBaptism: profile.dateOfBaptism,
    holyCommunionFrequency: profile.holyCommunionFrequency,

    prayerFrequency: profile.prayerFrequency,
    prayerBooks: profile.prayerBooks,
    otherPrayerBook: profile.otherPrayerBook ?? "",
    fastingPractice: profile.fastingPractice,
    readsSpiritualBooks: profile.readsSpiritualBooks ? "YES" : "NO",
    hasDailyProstrationRule: profile.hasDailyProstrationRule
      ? "YES"
      : "NO",
    dailyProstrationCount:
      profile.dailyProstrationCount === null
        ? ""
        : String(profile.dailyProstrationCount),
    faithfullyGivesTithe: profile.faithfullyGivesTithe ? "YES" : "NO",

    maritalStatus: profile.maritalStatus,
    spiritualChildJoinedDate: profile.spiritualChildJoinedDate,
    spouseName: profile.spouseName ?? "",
    children: children.map((child, index) => ({
      id: index + 1,
      name: child.name,
      gender: child.gender,
      dateOfBirth: child.dateOfBirth,
    })),
    spouseSpiritualFather: profile.spouseSpiritualFather ?? "",
    childrenNamesAndAges: profile.childrenNamesAndAges ?? "",
    greatestFamilyChallenge:
      privateIntake?.greatestFamilyChallenge ?? "",
    healthStatus: privateIntake?.healthStatus ?? "",

    bodilyTemptations: privateIntake?.bodilyTemptations ?? "",
    spiritualEmotionalStruggles:
      privateIntake?.spiritualEmotionalStruggles ?? "",
    significantFutureDecisions:
      privateIntake?.significantFutureDecisions ?? "",
    additionalInformation:
      privateIntake?.additionalInformation ?? "",
  };

  return {
    id: profile.id,
    slug: profile.slug,
    status: mapStatus(profile.status),
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
    submission,
  };
}

function toRepositoryInput(
  fatherUserId: string,
  submission: NewSpiritualChildSubmission,
): CreateSpiritualChildRepositoryInput {
  const validated =
    spiritualChildSubmissionSchema.parse(submission);

  const isMarried =
    validated.maritalStatus === "ORTHODOX_HOLY_MATRIMONY" ||
    validated.maritalStatus ===
      "CIVIL_OR_TRADITIONAL_MARRIAGE";

  return {
    fatherUserId,

    baptismalName: validated.baptismalName,
    legalName: validated.legalName,
    gender: validated.gender,
    dateOfBirth: validated.dateOfBirth,
    phoneNumber: validated.phoneNumber,
    address: validated.address,
    occupation: validated.occupation,
    educationalLevel: nullIfEmpty(validated.educationalLevel),

    spiritualEducation: validated.spiritualEducation,
    sundaySchoolYears: toOptionalNumber(validated.sundaySchoolYears),
    abinetDisciplines: validated.abinetDisciplines,

    previousSpiritualFather: nullIfEmpty(
      validated.previousSpiritualFather,
    ),
    reasonForChangingSpiritualFather: nullIfEmpty(
      validated.reasonForChangingSpiritualFather,
    ),
    receivedPreviousFatherBlessing: toBoolean(
      validated.receivedPreviousFatherBlessing,
    ),
    placeOfBaptism: validated.placeOfBaptism,
    dateOfBaptism: validated.dateOfBaptism,
    holyCommunionFrequency: validated.holyCommunionFrequency,

    prayerFrequency: validated.prayerFrequency,
    prayerBooks: validated.prayerBooks,
    otherPrayerBook: validated.prayerBooks.includes("OTHER")
      ? nullIfEmpty(validated.otherPrayerBook)
      : null,
    fastingPractice: validated.fastingPractice,
    readsSpiritualBooks: toBoolean(validated.readsSpiritualBooks),
    hasDailyProstrationRule: toBoolean(
      validated.hasDailyProstrationRule,
    ),
    dailyProstrationCount:
      validated.hasDailyProstrationRule === "YES"
        ? toOptionalNumber(validated.dailyProstrationCount)
        : null,
    faithfullyGivesTithe: toBoolean(
      validated.faithfullyGivesTithe,
    ),

    maritalStatus: validated.maritalStatus,
    spiritualChildJoinedDate:
      validated.spiritualChildJoinedDate ||
      new Date().toISOString().slice(0, 10),
    spouseName: isMarried
      ? nullIfEmpty(validated.spouseName)
      : null,
    spouseSpiritualFather: isMarried
      ? nullIfEmpty(validated.spouseSpiritualFather)
      : null,
    childrenNamesAndAges: nullIfEmpty(
      validated.childrenNamesAndAges ?? "",
    ),

    privateIntake: {
      greatestFamilyChallenge: nullIfEmpty(
        validated.greatestFamilyChallenge,
      ),
      healthStatus: nullIfEmpty(validated.healthStatus),
      bodilyTemptations: nullIfEmpty(validated.bodilyTemptations),
      spiritualEmotionalStruggles: nullIfEmpty(
        validated.spiritualEmotionalStruggles,
      ),
      significantFutureDecisions: nullIfEmpty(
        validated.significantFutureDecisions,
      ),
      additionalInformation: nullIfEmpty(
        validated.additionalInformation ?? "",
      ),
    },

    children: validated.children
      .filter(
        (child) =>
          child.name !== "" ||
          child.gender !== "" ||
          child.dateOfBirth !== "",
      )
      .map((child) => ({
        name: child.name,
        gender: child.gender,
        dateOfBirth: child.dateOfBirth,
      })),
  };
}

export async function registerSpiritualChild(
  fatherUserId: string,
  submission: NewSpiritualChildSubmission,
): Promise<PersistedSpiritualChild> {
  const repositoryInput = toRepositoryInput(
    fatherUserId,
    submission,
  );
  const created = await createSpiritualChild(repositoryInput);
  return mapAggregateToDto(created);
}

export { mapAggregateToDto };

export async function listChildren(
  fatherUserId: string,
): Promise<PersistedSpiritualChild[]> {
  const children = await listSpiritualChildrenByFather(fatherUserId);
  return children.map(mapAggregateToDto);
}
