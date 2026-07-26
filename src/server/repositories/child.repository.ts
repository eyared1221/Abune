import { randomUUID } from "node:crypto";

import { and, desc, eq, inArray } from "drizzle-orm";

import {
  spiritualChildFamilyChildren,
  spiritualChildPrivateIntake,
  spiritualChildren,
  type SpiritualChildFamilyChildRecord,
  type SpiritualChildPrivateIntakeRecord,
  type SpiritualChildRecord,
} from "@/db/schema";
import { db } from "@/lib/db";

export type CreateSpiritualChildRepositoryInput = {
  fatherUserId: string;

  baptismalName: string;
  legalName: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  occupation: string;
  educationalLevel: string | null;

  spiritualEducation: string[];
  sundaySchoolYears: number | null;
  abinetDisciplines: string[];

  previousSpiritualFather: string | null;
  reasonForChangingSpiritualFather: string | null;
  receivedPreviousFatherBlessing: boolean;
  placeOfBaptism: string;
  dateOfBaptism: string;
  holyCommunionFrequency: string;

  prayerFrequency: string;
  prayerBooks: string[];
  otherPrayerBook: string | null;
  fastingPractice: string;
  readsSpiritualBooks: boolean;
  hasDailyProstrationRule: boolean;
  dailyProstrationCount: number | null;
  faithfullyGivesTithe: boolean;

  maritalStatus: string;
  spiritualChildJoinedDate: string;
  spouseName: string | null;
  spouseSpiritualFather: string | null;
  childrenNamesAndAges: string | null;

  privateIntake: {
    greatestFamilyChallenge: string | null;
    healthStatus: string | null;
    bodilyTemptations: string | null;
    spiritualEmotionalStruggles: string | null;
    significantFutureDecisions: string | null;
    additionalInformation: string | null;
  };

  children: Array<{
    name: string;
    gender: string;
    dateOfBirth: string;
  }>;
};

export type SpiritualChildAggregate = {
  profile: SpiritualChildRecord;
  privateIntake: SpiritualChildPrivateIntakeRecord | null;
  children: SpiritualChildFamilyChildRecord[];
};

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140);
}

function createUniqueSlug(name: string) {
  const base = slugify(name) || "spiritual-child";
  return `${base}-${randomUUID().slice(0, 8)}`;
}

export async function createSpiritualChild(
  input: CreateSpiritualChildRepositoryInput,
): Promise<SpiritualChildAggregate> {
  return db.transaction(async (tx) => {
    const now = new Date();

    const [profile] = await tx
      .insert(spiritualChildren)
      .values({
        fatherUserId: input.fatherUserId,
        slug: createUniqueSlug(input.baptismalName),
        status: "ACTIVE",

        baptismalName: input.baptismalName,
        legalName: input.legalName,
        gender: input.gender,
        dateOfBirth: input.dateOfBirth,
        phoneNumber: input.phoneNumber,
        address: input.address,
        occupation: input.occupation,
        educationalLevel: input.educationalLevel,

        spiritualEducation: input.spiritualEducation,
        sundaySchoolYears: input.sundaySchoolYears,
        abinetDisciplines: input.abinetDisciplines,

        previousSpiritualFather: input.previousSpiritualFather,
        reasonForChangingSpiritualFather:
          input.reasonForChangingSpiritualFather,
        receivedPreviousFatherBlessing:
          input.receivedPreviousFatherBlessing,
        placeOfBaptism: input.placeOfBaptism,
        dateOfBaptism: input.dateOfBaptism,
        holyCommunionFrequency: input.holyCommunionFrequency,

        prayerFrequency: input.prayerFrequency,
        prayerBooks: input.prayerBooks,
        otherPrayerBook: input.otherPrayerBook,
        fastingPractice: input.fastingPractice,
        readsSpiritualBooks: input.readsSpiritualBooks,
        hasDailyProstrationRule: input.hasDailyProstrationRule,
        dailyProstrationCount: input.dailyProstrationCount,
        faithfullyGivesTithe: input.faithfullyGivesTithe,

        maritalStatus: input.maritalStatus,
        spiritualChildJoinedDate: input.spiritualChildJoinedDate,
        spouseName: input.spouseName,
        spouseSpiritualFather: input.spouseSpiritualFather,
        childrenNamesAndAges: input.childrenNamesAndAges,

        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (!profile) {
      throw new Error("The spiritual child profile could not be created.");
    }

    const [privateIntake] = await tx
      .insert(spiritualChildPrivateIntake)
      .values({
        spiritualChildId: profile.id,
        ...input.privateIntake,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    const familyChildren =
      input.children.length === 0
        ? []
        : await tx
            .insert(spiritualChildFamilyChildren)
            .values(
              input.children.map((child) => ({
                spiritualChildId: profile.id,
                name: child.name,
                gender: child.gender,
                dateOfBirth: child.dateOfBirth,
                createdAt: now,
              })),
            )
            .returning();

    return {
      profile,
      privateIntake: privateIntake ?? null,
      children: familyChildren,
    };
  });
}

export async function listSpiritualChildrenByFather(
  fatherUserId: string,
): Promise<SpiritualChildAggregate[]> {
  const profiles = await db
    .select()
    .from(spiritualChildren)
    .where(eq(spiritualChildren.fatherUserId, fatherUserId))
    .orderBy(desc(spiritualChildren.createdAt));

  if (profiles.length === 0) {
    return [];
  }

  const profileIds = profiles.map((profile) => profile.id);

  const [privateRows, familyChildren] = await Promise.all([
    db
      .select()
      .from(spiritualChildPrivateIntake)
      .where(
        inArray(
          spiritualChildPrivateIntake.spiritualChildId,
          profileIds,
        ),
      ),
    db
      .select()
      .from(spiritualChildFamilyChildren)
      .where(
        inArray(
          spiritualChildFamilyChildren.spiritualChildId,
          profileIds,
        ),
      ),
  ]);

  const privateByChildId = new Map(
    privateRows.map((row) => [row.spiritualChildId, row]),
  );
  const childrenByChildId = new Map<
    string,
    SpiritualChildFamilyChildRecord[]
  >();

  for (const child of familyChildren) {
    const current = childrenByChildId.get(child.spiritualChildId) ?? [];
    current.push(child);
    childrenByChildId.set(child.spiritualChildId, current);
  }

  return profiles.map((profile) => ({
    profile,
    privateIntake: privateByChildId.get(profile.id) ?? null,
    children: childrenByChildId.get(profile.id) ?? [],
  }));
}

export async function getSpiritualChildBySlugForFather(
  fatherUserId: string,
  slug: string,
): Promise<SpiritualChildAggregate | null> {
  const [profile] = await db
    .select()
    .from(spiritualChildren)
    .where(
      and(
        eq(spiritualChildren.fatherUserId, fatherUserId),
        eq(spiritualChildren.slug, slug),
      ),
    )
    .limit(1);

  if (!profile) {
    return null;
  }

  const [privateRows, familyChildren] = await Promise.all([
    db
      .select()
      .from(spiritualChildPrivateIntake)
      .where(
        eq(
          spiritualChildPrivateIntake.spiritualChildId,
          profile.id,
        ),
      )
      .limit(1),
    db
      .select()
      .from(spiritualChildFamilyChildren)
      .where(
        eq(
          spiritualChildFamilyChildren.spiritualChildId,
          profile.id,
        ),
      ),
  ]);

  return {
    profile,
    privateIntake: privateRows[0] ?? null,
    children: familyChildren,
  };
}

// Compatibility wrapper for older imports.
export function childRepository() {
  return {
    create: createSpiritualChild,
    listByFather: listSpiritualChildrenByFather,
    getBySlugForFather: getSpiritualChildBySlugForFather,
  };
}
