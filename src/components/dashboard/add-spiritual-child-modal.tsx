"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import {
  CalendarDays,
  Cross,
  Phone,
  Plus,
  Save,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  ChildRow,
  NewSpiritualChildSubmission,
} from "@/types/spiritual-child";

export type {
  ChildRow,
  NewSpiritualChildSubmission,
} from "@/types/spiritual-child";

type AddSpiritualChildModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (
    submission: NewSpiritualChildSubmission,
  ) => void | Promise<void>;
  saving?: boolean;
  submitError?: string | null;
};

const fieldClassName =
  "h-[54px] w-full rounded-[16px] border border-[#e5dece] bg-white px-4 text-[15px] font-medium text-[#253252] outline-none transition-all placeholder:text-[#9ca5b5] focus:border-[#c5a860] focus:ring-4 focus:ring-[#d7b04d]/10";

const selectClassName = cn(
  fieldClassName,
  "appearance-none bg-[linear-gradient(45deg,transparent_50%,#6f7895_50%),linear-gradient(135deg,#6f7895_50%,transparent_50%)] bg-[position:calc(100%-22px)_calc(50%-2px),calc(100%-16px)_calc(50%-2px)] bg-[size:6px_6px,6px_6px] bg-no-repeat pr-12",
);

const sectionTitleClassName =
  "border-b border-[#eee6d8] pb-4 text-[15px] font-extrabold text-[#1e2952] sm:text-[18px]";

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
const spouseEnabledMaritalStatuses = new Set([
  "ORTHODOX_HOLY_MATRIMONY",
  "CIVIL_OR_TRADITIONAL_MARRIAGE",
]);

function createChildRow(): ChildRow {
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    name: "",
    gender: "",
    dateOfBirth: "",
  };
}

function FieldLabel({
  label,
  required = false,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <label className="mb-2 block text-sm font-bold text-[#33415f]">
      {label}
      {required ? <span className="ml-1 text-[#db5d5d]">*</span> : null}
    </label>
  );
}

function InputWithIcon({
  className,
  icon,
  inputClassName,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  icon: ReactNode;
  inputClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-[54px] items-center gap-3 rounded-[16px] border border-[#e5dece] bg-white px-4 transition-all focus-within:border-[#c5a860] focus-within:ring-4 focus-within:ring-[#d7b04d]/10",
        className,
      )}
    >
      <span className="shrink-0 text-[#6f7895]">{icon}</span>
      <input
        {...props}
        className={cn(
          "w-full bg-transparent text-[15px] font-medium text-[#253252] outline-none placeholder:text-[#9ca5b5]",
          inputClassName,
        )}
      />
    </div>
  );
}

export function AddSpiritualChildModal({
  open,
  onClose,
  onSave,
  saving = false,
  submitError = null,
}: AddSpiritualChildModalProps) {
  const t = useTranslations("AddSpiritualChild");
  const [baptismalName, setBaptismalName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [educationalLevel, setEducationalLevel] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [spouseName, setSpouseName] = useState("");
  const [children, setChildren] = useState<ChildRow[]>([]);
  const [spiritualEducation, setSpiritualEducation] = useState<string[]>([]);
  const [sundaySchoolYears, setSundaySchoolYears] = useState("");
  const [abinetDisciplines, setAbinetDisciplines] = useState<string[]>([]);
  const [previousSpiritualFather, setPreviousSpiritualFather] = useState("");
  const [reasonForChangingSpiritualFather, setReasonForChangingSpiritualFather] = useState("");
  const [receivedPreviousFatherBlessing, setReceivedPreviousFatherBlessing] = useState("");
  const [placeOfBaptism, setPlaceOfBaptism] = useState("");
  const [dateOfBaptism, setDateOfBaptism] = useState("");
  const [holyCommunionFrequency, setHolyCommunionFrequency] = useState("");
  const [prayerFrequency, setPrayerFrequency] = useState("");
  const [prayerBooks, setPrayerBooks] = useState<string[]>([]);
  const [otherPrayerBook, setOtherPrayerBook] = useState("");
  const [fastingPractice, setFastingPractice] = useState("");
  const [readsSpiritualBooks, setReadsSpiritualBooks] = useState("");
  const [hasDailyProstrationRule, setHasDailyProstrationRule] = useState("");
  const [dailyProstrationCount, setDailyProstrationCount] = useState("");
  const [faithfullyGivesTithe, setFaithfullyGivesTithe] = useState("");
  const [spouseSpiritualFather, setSpouseSpiritualFather] = useState("");
  const [greatestFamilyChallenge, setGreatestFamilyChallenge] = useState("");
  const [healthStatus, setHealthStatus] = useState("");
  const [bodilyTemptations, setBodilyTemptations] = useState("");
  const [spiritualEmotionalStruggles, setSpiritualEmotionalStruggles] = useState("");
  const [significantFutureDecisions, setSignificantFutureDecisions] = useState("");

  const genderOptions = genderValues.map((value) => ({
    value,
    label: t(`options.gender.${value}`),
  }));
  const yesNoOptions = yesNoValues.map((value) => ({
    value,
    label: t(`options.common.${value}`),
  }));
  const educationalLevelOptions = educationalLevelValues.map((value) => ({
    value,
    label: t(`options.educationalLevel.${value}`),
  }));
  const spiritualEducationOptions = spiritualEducationValues.map((value) => ({
    value,
    label: t(`options.spiritualEducation.${value}`),
  }));
  const abinetDisciplineOptions = abinetDisciplineValues.map((value) => ({
    value,
    label: t(`options.abinetDisciplines.${value}`),
  }));
  const holyCommunionFrequencyOptions =
    holyCommunionFrequencyValues.map((value) => ({
      value,
      label: t(`options.holyCommunionFrequency.${value}`),
    }));
  const maritalStatusOptions = maritalStatusValues.map((value) => ({
    value,
    label: t(`options.maritalStatus.${value}`),
  }));
  const prayerBookOptions = prayerBookValues.map((value) => ({
    value,
    label: t(`options.prayerBooks.${value}`),
  }));
  const relationshipOptions = relationshipValues.map((value) => ({
    value,
    label: t(`options.relationships.${value}`),
  }));
  const isSpouseFieldEnabled =
    spouseEnabledMaritalStatuses.has(maritalStatus);
  const hasDailyProstrationRuleEnabled =
    hasDailyProstrationRule === "YES";
  const shouldShowOtherPrayerBook =
    prayerBooks.includes("OTHER");

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open, saving]);

  if (!open) {
    return null;
  }

  const addChildRow = () => {
    setChildren((currentChildren) => [...currentChildren, createChildRow()]);
  };

  const toggleCheckbox = (
  value: string,
  current: string[],
  setter: React.Dispatch<React.SetStateAction<string[]>>
) => {
  setter((prev) =>
    prev.includes(value)
      ? prev.filter((item) => item !== value)
      : [...prev, value]
  );
};
  const updateChildRow = (
    id: number,
    key: keyof Omit<ChildRow, "id">,
    value: string,
  ) => {
    setChildren((currentChildren) =>
      currentChildren.map((child) =>
        child.id === id ? { ...child, [key]: value } : child,
      ),
    );
  };

  const removeChildRow = (id: number) => {
    setChildren((currentChildren) =>
      currentChildren.filter((child) => child.id !== id),
    );
  };

  const handlePhoneChange =
    (setter: (value: string) => void) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    void onSave({
      baptismalName,
      legalName,
      gender,
      dateOfBirth,
      phoneNumber,
      address,
      occupation,
      educationalLevel,

      spiritualEducation,
      sundaySchoolYears,
      abinetDisciplines,

      previousSpiritualFather,
      reasonForChangingSpiritualFather,
      receivedPreviousFatherBlessing,
      placeOfBaptism,
      dateOfBaptism,
      holyCommunionFrequency,

      prayerFrequency,
      prayerBooks,
      otherPrayerBook,
      fastingPractice,
      readsSpiritualBooks,
      hasDailyProstrationRule,
      dailyProstrationCount,
      faithfullyGivesTithe,

      spouseSpiritualFather,
      greatestFamilyChallenge,
      healthStatus,

      bodilyTemptations,
      spiritualEmotionalStruggles,
      significantFutureDecisions,

      maritalStatus,
      spouseName,
      children: children.filter(
        (child) =>
          child.name.trim() !== "" ||
          child.gender.trim() !== "" ||
          child.dateOfBirth.trim() !== "",
      ),
    });
  };

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        aria-label={t("accessibility.closeOverlay")}
        className="absolute inset-0 bg-[#17223f]/45 backdrop-blur-[3px]"
        onClick={() => {
          if (!saving) {
            onClose();
          }
        }}
        type="button"
      />

      <div className="relative flex min-h-full items-center justify-center p-4 lg:p-8">
        <div className="relative z-10 w-full max-w-[1040px] overflow-hidden rounded-[28px] border border-[#ece4d6] bg-[#fdfcf9] shadow-[0_32px_80px_rgba(17,24,39,0.24)]">
          <form
            className="max-h-[92vh] overflow-y-auto"
            onSubmit={handleSubmit}
          >
            <div className="px-5 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6 lg:px-10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#eadfc9] bg-[#fbf6ec] text-[#ba9642] shadow-[0_8px_18px_rgba(185,150,69,0.12)]">
                    <Cross className="h-7 w-7" strokeWidth={1.8} />
                  </div>

                  <div>
                    <h2 className="text-[28px] font-extrabold leading-tight text-[#1c2850]">
                      {t("title")}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-[#73809b]">
                      {t("subtitle")}
                    </p>
                  </div>
                </div>

                <button
                  aria-label={t("accessibility.closeForm")}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#6d7690] transition-colors hover:bg-[#f4efe4] hover:text-[#1c2850]"
                  disabled={saving}
                  onClick={onClose}
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8 space-y-8">
                <section>
                  <h3 className={sectionTitleClassName}>
                    {t("sections.generalEducational")}
                  </h3>

                  <div className="mt-6 grid gap-5 lg:grid-cols-3">
                    <div>
                      <FieldLabel label={t("fields.baptismalName")} required />
                      <input
                        className={fieldClassName}
                        onChange={(event) => setBaptismalName(event.target.value)}
                        placeholder={t("placeholders.baptismalName")}
                        required
                        value={baptismalName}
                      />
                    </div>

                    <div>
                      <FieldLabel label={t("fields.legalName")} required />
                      <input
                        className={fieldClassName}
                        onChange={(event) => setLegalName(event.target.value)}
                        placeholder={t("placeholders.legalName")}
                        required
                        value={legalName}
                      />
                    </div>

                    <div>
                      <FieldLabel label={t("fields.gender")} required />
                      <select
                        className={selectClassName}
                        onChange={(event) => setGender(event.target.value)}
                        required
                        value={gender}
                      >
                        <option value="">{t("placeholders.selectGender")}</option>
                        {genderOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <FieldLabel label={t("fields.dateOfBirth")} required />
                      <InputWithIcon
                        icon={<CalendarDays className="h-5 w-5" />}
                        onChange={(event) => setDateOfBirth(event.target.value)}
                        placeholder={t("placeholders.selectDate")}
                        required
                        type={dateOfBirth ? "date" : "text"}
                        onFocus={(event) => {
                          event.currentTarget.type = "date";
                        }}
                        onBlur={(event) => {
                          if (!event.currentTarget.value) {
                            event.currentTarget.type = "text";
                          }
                        }}
                        value={dateOfBirth}
                      />
                    </div>

                    <div>
                      <FieldLabel label={t("fields.phoneNumber")} required />
                      <InputWithIcon
                        icon={<Phone className="h-5 w-5" />}
                        onChange={handlePhoneChange(setPhoneNumber)}
                        placeholder={t("placeholders.phoneNumber")}
                        required
                        type="tel"
                        value={phoneNumber}
                      />
                    </div>

                    <div>
                      <FieldLabel label={t("fields.address")} required />
                      <input
                        className={fieldClassName}
                        onChange={(event) => setAddress(event.target.value)}
                        placeholder={t("placeholders.address")}
                        required
                        value={address}
                      />
                    </div>

                    <div>
                      <FieldLabel label={t("fields.occupation")} required />
                      <input
                        className={fieldClassName}
                        onChange={(event) => setOccupation(event.target.value)}
                        placeholder={t("placeholders.occupation")}
                        required
                        value={occupation}
                      />
                    </div>

                    <div>
                      <FieldLabel label={t("fields.educationalLevel")} />
                      <select
                        className={selectClassName}
                        onChange={(event) =>
                          setEducationalLevel(event.target.value)
                        }
                        value={educationalLevel}
                      >
                        <option value="">
                          {t("placeholders.selectEducationalLevel")}
                        </option>
                        {educationalLevelOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

{/* ================= Spiritual Education Level ================= */}

<div className="lg:col-span-3 mt-8">
  <h3 className={sectionTitleClassName}>
    {t("sections.spiritualEducation")}
  </h3>

  <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">

    {/* Left Side */}
    <div>
      <FieldLabel label={t("fields.selectAllThatApply")} required />

      <div className="space-y-3">
        {spiritualEducationOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 text-[15px] text-[#2d3b5d]"
          >
            <input
              type="checkbox"
              checked={spiritualEducation.includes(option.value)}
              onChange={() =>
                toggleCheckbox(
                  option.value,
                  spiritualEducation,
                  setSpiritualEducation
                )
              }
              className="h-5 w-5 rounded border-[#d8cdb7] accent-[#c39a37]"
            />

            {option.label}
          </label>
        ))}

      </div>
    </div>

    {/* Right Side */}

    <div>
      <FieldLabel label={t("fields.sundaySchoolYears")} />

      <InputWithIcon
        icon={<CalendarDays className="h-5 w-5" />}
        placeholder={t("placeholders.sundaySchoolYears")}
        value={sundaySchoolYears}
        onChange={(e) => setSundaySchoolYears(e.target.value)}
      />
    </div>

  </div>

  {/* Abinet */}

  <div className="mt-6 mb-6 rounded-[18px] border border-[#ece3d3] bg-[#fcfaf5] p-5">

    <p className="mb-4 text-sm font-bold text-[#b6872c]">
      {t("fields.abinetDisciplines")}
    </p>

    <div className="grid gap-4 md:grid-cols-2">
      {abinetDisciplineOptions.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-3 text-[15px] text-[#2d3b5d]"
        >
          <input
            type="checkbox"
            checked={abinetDisciplines.includes(option.value)}
            onChange={() =>
              toggleCheckbox(
                option.value,
                abinetDisciplines,
                setAbinetDisciplines
              )
            }
            className="h-5 w-5 rounded border-[#d8cdb7] accent-[#c39a37]"
          />

          {option.label}
        </label>
      ))}

    </div>

  </div>

</div>      

{/* ================= Church & Sacramental Standing ================= */}

<section>
  <h3 className={sectionTitleClassName}>
    {t("sections.churchSacramental")}
  </h3>

  <div className="mt-6 mb-8 grid gap-5 lg:grid-cols-2">
    {/* Previous Spiritual Father */}
    <div>
      <FieldLabel label={t("fields.previousSpiritualFather")} />

      <input
        className={fieldClassName}
        onChange={(event) =>
          setPreviousSpiritualFather(event.target.value)
        }
        placeholder={t("placeholders.previousSpiritualFather")}
        value={previousSpiritualFather}
      />
    </div>

    {/* Reason for Changing */}
    <div>
      <FieldLabel label={t("fields.reasonForChangingSpiritualFather")} />

      <textarea
        className={cn(
          fieldClassName,
          "min-h-[90px] resize-none py-4",
        )}
        onChange={(event) =>
          setReasonForChangingSpiritualFather(event.target.value)
        }
        placeholder={t("placeholders.reasonForChangingSpiritualFather")}
        value={reasonForChangingSpiritualFather}
      />
    </div>

    {/* Previous Father's Blessing */}
    <div>
      <FieldLabel
        label={t("fields.receivedPreviousFatherBlessing")}
        required
      />

      <div className="flex min-h-[54px] flex-wrap items-center gap-x-7 gap-y-3">
        {yesNoOptions.map((option) => (
          <label
            className="flex cursor-pointer items-center gap-3 text-[15px] font-medium text-[#33415f]"
            key={option.value}
          >
            <input
              checked={receivedPreviousFatherBlessing === option.value}
              className="h-5 w-5 accent-[#c39a37]"
              name="previousFatherBlessing"
              onChange={(event) =>
                setReceivedPreviousFatherBlessing(event.target.value)
              }
              required
              type="radio"
              value={option.value}
            />

            {option.label}
          </label>
        ))}
      </div>
    </div>

    {/* Baptism Information */}
    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <FieldLabel label={t("fields.placeOfBaptism")} required />

        <input
          className={fieldClassName}
          onChange={(event) => setPlaceOfBaptism(event.target.value)}
          placeholder={t("placeholders.placeOfBaptism")}
          required
          value={placeOfBaptism}
        />
      </div>

      <div>
        <FieldLabel label={t("fields.dateOfBaptism")} required />

        <InputWithIcon
          icon={<CalendarDays className="h-5 w-5" />}
          onBlur={(event) => {
            if (!event.currentTarget.value) {
              event.currentTarget.type = "text";
            }
          }}
          onChange={(event) => setDateOfBaptism(event.target.value)}
          onFocus={(event) => {
            event.currentTarget.type = "date";
          }}
          placeholder={t("placeholders.selectDate")}
          required
          type={dateOfBaptism ? "date" : "text"}
          value={dateOfBaptism}
        />
      </div>
    </div>

    {/* Holy Communion Frequency */}
    <div>
      <FieldLabel
        label={t("fields.holyCommunionFrequency")}
        required
      />

      <select
        className={selectClassName}
        onChange={(event) =>
          setHolyCommunionFrequency(event.target.value)
        }
        required
        value={holyCommunionFrequency}
      >
        <option value="">{t("placeholders.selectFrequency")}</option>
        {holyCommunionFrequencyOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>

    {/* Marital Status */}
    <div>
      <FieldLabel label={t("fields.maritalStatus")} required />

      <select
        className={selectClassName}
        onChange={(event) => setMaritalStatus(event.target.value)}
        required
        value={maritalStatus}
      >
        <option value="">{t("placeholders.selectMaritalStatus")}</option>
        {maritalStatusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
</section>

{/* ================= Spiritual Discipline & Prayer Life ================= */}

<section>
  <h3 className={sectionTitleClassName}>
    {t("sections.spiritualDisciplinePrayer")}
  </h3>

  <div className="mt-6 grid gap-6 lg:grid-cols-2">
    {/* Prayer Frequency */}
    <div>
      <FieldLabel label={t("fields.prayerFrequency")} required />

      <input
        className={fieldClassName}
        onChange={(event) => setPrayerFrequency(event.target.value)}
        placeholder={t("placeholders.prayerFrequency")}
        required
        value={prayerFrequency}
      />
    </div>

    {/* Prayer Books */}
    <div>
      <FieldLabel label={t("fields.prayerBooks")} />

      <div className="space-y-3">
        {prayerBookOptions.map((option) => (
          <div
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
            key={option.value}
          >
            <label className="flex cursor-pointer items-center gap-3 text-[15px] font-medium text-[#33415f]">
              <input
                checked={prayerBooks.includes(option.value)}
                className="h-5 w-5 rounded border-[#d8cdb7] accent-[#c39a37]"
                onChange={() =>
                  toggleCheckbox(
                    option.value,
                    prayerBooks,
                    setPrayerBooks,
                  )
                }
                type="checkbox"
              />

              {option.label}
            </label>

            {option.value === "OTHER" && shouldShowOtherPrayerBook ? (
              <input
                className={cn(fieldClassName, "h-[48px] sm:max-w-[350px]")}
                onChange={(event) => setOtherPrayerBook(event.target.value)}
                placeholder={t("placeholders.otherPrayerBook")}
                value={otherPrayerBook}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>

    {/* Fasting Practice */}
    <div>
      <FieldLabel label={t("fields.fastingPractice")} required />

      <textarea
        className={cn(
          fieldClassName,
          "min-h-[110px] resize-none py-4",
        )}
        onChange={(event) => setFastingPractice(event.target.value)}
        placeholder={t("placeholders.fastingPractice")}
        required
        value={fastingPractice}
      />
    </div>

    {/* Reading Spiritual Books */}
    <div>
      <FieldLabel
        label={t("fields.readsSpiritualBooks")}
        required
      />

      <div className="flex min-h-[54px] items-center gap-8">
        {yesNoOptions.map((option) => (
          <label
            className="flex cursor-pointer items-center gap-3 text-[15px] font-medium text-[#33415f]"
            key={option.value}
          >
            <input
              checked={readsSpiritualBooks === option.value}
              className="h-5 w-5 accent-[#c39a37]"
              name="readsSpiritualBooks"
              onChange={(event) =>
                setReadsSpiritualBooks(event.target.value)
              }
              required
              type="radio"
              value={option.value}
            />

            {option.label}
          </label>
        ))}
      </div>
    </div>
  </div>

  <div className="mt-6 mb-6 grid gap-6 lg:grid-cols-3">
    {/* Prostration Rule */}
    <div>
      <FieldLabel
        label={t("fields.hasDailyProstrationRule")}
        required
      />

      <div className="flex min-h-[54px] items-center gap-8">
        {yesNoOptions.map((option) => (
          <label
            className="flex cursor-pointer items-center gap-3 text-[15px] font-medium text-[#33415f]"
            key={option.value}
          >
            <input
              checked={hasDailyProstrationRule === option.value}
              className="h-5 w-5 accent-[#c39a37]"
              name="dailyProstrationRule"
              onChange={(event) => {
                const value = event.target.value;
                setHasDailyProstrationRule(value);

                if (value === "NO") {
                  setDailyProstrationCount("");
                }
              }}
              required
              type="radio"
              value={option.value}
            />

            {option.label}
          </label>
        ))}
      </div>
    </div>

    {/* Prostration Count */}
    <div>
      <FieldLabel label={t("fields.dailyProstrationCount")} />

      <input
        className={cn(
          fieldClassName,
          !hasDailyProstrationRuleEnabled &&
            "cursor-not-allowed border-[#ede8dc] bg-[#f6f3ed] text-[#a1a6b4]",
        )}
        disabled={!hasDailyProstrationRuleEnabled}
        min="0"
        onChange={(event) => setDailyProstrationCount(event.target.value)}
        placeholder={t("placeholders.dailyProstrationCount")}
        type="number"
        value={dailyProstrationCount}
      />
    </div>

    {/* Tithing */}
    <div>
      <FieldLabel label={t("fields.faithfullyGivesTithe")} required />

      <div className="flex min-h-[54px] items-center gap-8">
        {yesNoOptions.map((option) => (
          <label
            className="flex cursor-pointer items-center gap-3 text-[15px] font-medium text-[#33415f]"
            key={option.value}
          >
            <input
              checked={faithfullyGivesTithe === option.value}
              className="h-5 w-5 accent-[#c39a37]"
              name="faithfullyGivesTithe"
              onChange={(event) =>
                setFaithfullyGivesTithe(event.target.value)
              }
              required
              type="radio"
              value={option.value}
            />

            {option.label}
          </label>
        ))}
      </div>
    </div>
  </div>
</section>

{/* ================= Family & Social History ================= */}

<section>
  <h3 className={sectionTitleClassName}>
    {t("sections.familySocial")}
  </h3>

  <div className="mt-6 mb-6 grid gap-5 lg:grid-cols-2">
    {/* Spouse Name */}
    <div>
      <FieldLabel label={t("fields.spouseName")} />

      <input
        className={cn(
          fieldClassName,
          !isSpouseFieldEnabled &&
            "cursor-not-allowed border-[#ede8dc] bg-[#f6f3ed] text-[#a1a6b4]",
        )}
        disabled={!isSpouseFieldEnabled}
        onChange={(event) => setSpouseName(event.target.value)}
        placeholder={
          isSpouseFieldEnabled
            ? t("placeholders.spouseName")
            : t("placeholders.availableWhenMarried")
        }
        value={spouseName}
      />
    </div>

    {/* Spouse Spiritual Father */}
    <div>
      <FieldLabel label={t("fields.spouseSpiritualFather")} />

      <input
        className={cn(
          fieldClassName,
          !isSpouseFieldEnabled &&
            "cursor-not-allowed border-[#ede8dc] bg-[#f6f3ed] text-[#a1a6b4]",
        )}
        disabled={!isSpouseFieldEnabled}
        onChange={(event) =>
          setSpouseSpiritualFather(event.target.value)
        }
        placeholder={
          isSpouseFieldEnabled
            ? t("placeholders.enterName")
            : t("placeholders.availableWhenMarried")
        }
        value={spouseSpiritualFather}
      />
    </div>

    {/* Children Names and Ages */}
                    <div>
                      <FieldLabel label={t("fields.childrenList")} />
                      <Button
                        className="h-[54px] w-full rounded-[16px] border border-[#dfd6c4] bg-white text-[15px] font-bold text-[#324061] shadow-none hover:bg-[#faf6ee]"
                        onClick={addChildRow}
                        type="button"
                        variant="outline"
                      >
                        <Plus className="h-5 w-5 text-[#2f3d5d]" />
                        {t("buttons.addChild")}
                      </Button>
                    </div>


                  <div className="mt-6 overflow-hidden rounded-[20px] border border-[#e8e0d2] bg-white">
                    <div className="border-b border-[#efe7db] px-5 py-4">
                      <p className="text-[17px] font-bold text-[#1f2b52]">
                        {t("sections.children")}
                      </p>
                    </div>

                    <div className="hidden grid-cols-[80px_1.5fr_1fr_1.2fr_100px] items-center gap-4 border-b border-[#efe7db] bg-[#fbf8f2] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#7d879d] md:grid">
                      <p>{t("childrenTable.number")}</p>
                      <p>{t("childrenTable.childName")}</p>
                      <p>{t("childrenTable.gender")}</p>
                      <p>{t("childrenTable.dateOfBirth")}</p>
                      <p className="text-right">{t("childrenTable.actions")}</p>
                    </div>

                    {children.length === 0 ? (
                      <div className="flex min-h-[190px] flex-col items-center justify-center px-6 py-10 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f2e7] text-[#8b96b0]">
                          <Users className="h-8 w-8" />
                        </div>

                        <p className="mt-4 text-[18px] font-semibold text-[#51607d]">
                          {t("childrenTable.emptyTitle")}
                        </p>

                        <p className="mt-2 max-w-[320px] text-sm font-medium text-[#8c95a8]">
                          {t("childrenTable.emptyDescription")}
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-[#f1eadf]">
                        {children.map((child, index) => (
                          <div
                            key={child.id}
                            className="grid gap-4 px-4 py-4 md:grid-cols-[80px_1.5fr_1fr_1.2fr_100px] md:items-center md:px-5"
                          >
                            <div className="text-sm font-extrabold text-[#3a4768]">
                              {index + 1}
                            </div>

                            <div>
                              <FieldLabel label={t("fields.childName")} />
                              <input
                                className={cn(fieldClassName, "md:h-12")}
                                onChange={(event) =>
                                  updateChildRow(
                                    child.id,
                                    "name",
                                    event.target.value,
                                  )
                                }
                                placeholder={t("placeholders.childName")}
                                value={child.name}
                              />
                            </div>

                            <div>
                              <FieldLabel label={t("fields.gender")} />
                              <select
                                className={cn(selectClassName, "md:h-12")}
                                onChange={(event) =>
                                  updateChildRow(
                                    child.id,
                                    "gender",
                                    event.target.value,
                                  )
                                }
                                value={child.gender}
                              >
                                <option value="">{t("placeholders.selectGender")}</option>
                                {genderOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <FieldLabel label={t("fields.dateOfBirth")} />
                              <input
                                className={cn(fieldClassName, "md:h-12")}
                                onChange={(event) =>
                                  updateChildRow(
                                    child.id,
                                    "dateOfBirth",
                                    event.target.value,
                                  )
                                }
                                type="date"
                                value={child.dateOfBirth}
                              />
                            </div>

                            <div className="flex items-end justify-end">
                              <button
                                aria-label={t("childrenTable.removeChild", {
                                  number: index + 1,
                                })}
                                className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-[#eadfc9] bg-[#fffaf0] text-[#b46f5f] transition-colors hover:bg-[#fff1ea]"
                                onClick={() => removeChildRow(child.id)}
                                type="button"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

    {/* Family Challenge */}
    <div>
      <FieldLabel label={t("fields.greatestFamilyChallenge")} />

      <textarea
        className={cn(
          fieldClassName,
          "min-h-[110px] resize-none py-4",
        )}
        onChange={(event) =>
          setGreatestFamilyChallenge(event.target.value)
        }
        placeholder={t("placeholders.greatestFamilyChallenge")}
        value={greatestFamilyChallenge}
      />
    </div>

    {/* Health Status */}
    <div>
      <FieldLabel label={t("fields.healthStatus")} />

      <textarea
        className={cn(
          fieldClassName,
          "min-h-[110px] resize-none py-4",
        )}
        onChange={(event) => setHealthStatus(event.target.value)}
        placeholder={t("placeholders.healthStatus")}
        value={healthStatus}
      />
    </div>
  </div>
</section>

{/* ================= Major Spiritual Struggles & Self-Examination ================= */}

<section>
  <h3 className={sectionTitleClassName}>
    {t("sections.selfExamination")}
  </h3>

  <div className="mt-6 mb-6 grid gap-5 lg:grid-cols-3">
    {/* Bodily Temptations / Addictions */}
    <div>
      <FieldLabel label={t("fields.bodilyTemptations")} />

      <textarea
        className={cn(
          fieldClassName,
          "min-h-[120px] resize-none py-4",
        )}
        onChange={(event) => setBodilyTemptations(event.target.value)}
        placeholder={t("placeholders.bodilyTemptations")}
        value={bodilyTemptations}
      />
    </div>

    {/* Spiritual & Emotional Struggles */}
    <div>
      <FieldLabel label={t("fields.spiritualEmotionalStruggles")} />

      <textarea
        className={cn(
          fieldClassName,
          "min-h-[120px] resize-none py-4",
        )}
        onChange={(event) =>
          setSpiritualEmotionalStruggles(event.target.value)
        }
        placeholder={t("placeholders.spiritualEmotionalStruggles")}
        value={spiritualEmotionalStruggles}
      />
    </div>

    {/* Significant Future Life Decisions */}
    <div>
      <FieldLabel label={t("fields.significantFutureDecisions")} />

      <textarea
        className={cn(
          fieldClassName,
          "min-h-[120px] resize-none py-4",
        )}
        onChange={(event) =>
          setSignificantFutureDecisions(event.target.value)
        }
        placeholder={t("placeholders.significantFutureDecisions")}
        value={significantFutureDecisions}
      />
    </div>
  </div>
</section>                   
                </section>
              </div>
            </div>

            {submitError ? (
              <div
                className="border-t border-[#f1d4cf] bg-[#fff5f3] px-5 py-3 text-sm font-semibold text-[#a3463b] sm:px-7 lg:px-10"
                role="alert"
              >
                {submitError}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-[#eee6d8] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-10">
              <Button
                className="h-11 rounded-[14px] border border-[#dccfb8] bg-white px-5 text-[15px] font-bold text-[#344163] shadow-none hover:bg-[#faf6ef]"
                disabled={saving}
                onClick={onClose}
                type="button"
                variant="outline"
              >
                {t("buttons.cancel")}
              </Button>

              <Button
                aria-busy={saving}
                className="h-11 rounded-[14px] bg-[#c39a37] px-6 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(195,154,55,0.24)] hover:bg-[#af892f] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={saving}
                type="submit"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : t("buttons.save")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
