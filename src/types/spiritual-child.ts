export type ChildRow = {
  id: number;
  name: string;
  gender: string;
  dateOfBirth: string;
};

export type NewSpiritualChildSubmission = {
  baptismalName: string;
  legalName: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  occupation: string;
  educationalLevel: string;

  spiritualEducation: string[];
  sundaySchoolYears: string;
  abinetDisciplines: string[];

  previousSpiritualFather: string;
  reasonForChangingSpiritualFather: string;
  receivedPreviousFatherBlessing: string;
  placeOfBaptism: string;
  dateOfBaptism: string;
  holyCommunionFrequency: string;

  prayerFrequency: string;
  prayerBooks: string[];
  otherPrayerBook: string;
  fastingPractice: string;
  readsSpiritualBooks: string;
  hasDailyProstrationRule: string;
  dailyProstrationCount: string;
  faithfullyGivesTithe: string;

  maritalStatus: string;
  spiritualChildJoinedDate?: string;
  spouseName: string;
  children: ChildRow[];
  spouseSpiritualFather: string;
  childrenNamesAndAges?: string;
  greatestFamilyChallenge: string;
  healthStatus: string;

  bodilyTemptations: string;
  spiritualEmotionalStruggles: string;
  significantFutureDecisions: string;
  additionalInformation?: string;
};

export type PersistedSpiritualChild = {
  id: string;
  slug: string;
  status: "Active" | "Needs Follow-up" | "Inactive";
  createdAt: string;
  updatedAt: string;
  submission: NewSpiritualChildSubmission;
};

export type SpiritualChildActionResult =
  | {
      success: true;
      child: PersistedSpiritualChild;
    }
  | {
      success: false;
      error: string;
      field?: string;
    };

export type SpiritualChildrenListActionResult =
  | {
      success: true;
      children: PersistedSpiritualChild[];
    }
  | {
      success: false;
      error: string;
    };
