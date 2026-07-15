"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  ShieldAlert,
  UserPlus,
  Users,
  CalendarDays,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  AddSpiritualChildModal,
  type NewSpiritualChildSubmission,
} from "@/components/dashboard/add-spiritual-child-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  spiritualChildren,
  type SpiritualChild,
} from "@/lib/spiritual-children";
import { cn } from "@/lib/utils";

const avatarClassNames = [
  "bg-[#f4ebff] text-[#8e59ff]",
  "bg-[#e8fff2] text-[#2eaf67]",
  "bg-[#eaf1ff] text-[#4676ff]",
  "bg-[#ffe9f0] text-[#ef476f]",
  "bg-[#fff2da] text-[#f59e0b]",
] as const;

function getInitials(name: string) {
  const segments = name
    .split(" ")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .slice(0, 2);

  return (segments[0]?.[0] ?? "").concat(segments[1]?.[0] ?? "").toUpperCase();
}

function calculateAge(dateOfBirth: string) {
  const birthDate = new Date(dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) {
    return 0;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return age;
}

function formatJoinedDate(dateValue?: string) {
  const date = dateValue ? new Date(dateValue) : new Date();

  if (Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date());
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createUniqueSlug(name: string, children: SpiritualChild[]) {
  const baseSlug = slugify(name) || "spiritual-child";
  let nextSlug = baseSlug;
  let index = 2;

  while (children.some((child) => child.slug === nextSlug)) {
    nextSlug = `${baseSlug}-${index}`;
    index += 1;
  }

  return nextSlug;
}

function buildSpiritualChild(
  submission: NewSpiritualChildSubmission,
  existingChildren: FilterableSpiritualChild[],
): FilterableSpiritualChild {
  const age = calculateAge(submission.dateOfBirth);
  const isTeen = age > 0 && age < 20;
  const formattedName = submission.baptismalName.trim();
  const nextAppointmentTitle = submission.children.length
    ? "Family Guidance Session"
    : "Pastoral Introduction";

return {
  slug: createUniqueSlug(formattedName, existingChildren),
  initials: getInitials(formattedName) || "SC",
  name: formattedName,
  age,
  gender: submission.gender as SpiritualChild["gender"],
  contact: submission.phoneNumber,
  guardian: submission.emergencyContactName,

  // Registration details used by the advanced filter
  dateOfBirth: submission.dateOfBirth,
  occupation: submission.occupation,
  educationalLevel: submission.educationalLevel,
  maritalStatus: submission.maritalStatus,
  spouseName: submission.spouseName,
  spiritualChildJoinedDate: submission.spiritualChildJoinedDate,
  emergencyContactName: submission.emergencyContactName,
  emergencyRelationship: submission.emergencyRelationship,
  emergencyPhoneNumber: submission.emergencyPhoneNumber,

  group: isTeen ? "Teens" : "Young Adults",
  groupVariant: isTeen ? "success" : "violet",

  // Use the actual joined date instead of today's date
  joinedOn: submission.spiritualChildJoinedDate
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(submission.spiritualChildJoinedDate))
    : formatJoinedDate(),

  status: "Active",
  statusVariant: "success",
  avatarClassName:
    avatarClassNames[existingChildren.length % avatarClassNames.length],
  communionReady: false,

  repentance: {
    label: "New Registration",
    daysLeft: 7,
    progress: 18,
    note: "Recently added and awaiting first pastoral follow-up.",
  },

  nextAppointment: {
    date: "To be scheduled",
    time: "Pending",
    title: nextAppointmentTitle,
    note: "Schedule an introductory follow-up with the spiritual child.",
  },

  appointments: [
    {
      title: nextAppointmentTitle,
      date: "To be scheduled",
      time: "Pending",
      note: "Initial pastoral meeting will be added after review.",
    },
  ],

  repentanceSteps: [
    {
      title: "Registration completed",
      complete: true,
      note: "Profile created successfully from the add child form.",
    },
    {
      title: "Pastoral welcome session",
      complete: false,
      note: "Needs to be scheduled with the spiritual child.",
    },
    {
      title: "Holy Communion preparation review",
      complete: false,
      note: "Pending initial spiritual guidance.",
    },
  ],

  attendance: {
    rate: "New",
    lastSeen: "No visits recorded yet",
    note: submission.occupation
      ? `Occupation noted as ${submission.occupation}.`
      : "No attendance activity recorded yet.",
  },
};
}

type SpiritualChildFilters = {
  baptismalName: string;
  gender: string[];
  dateOfBirthFrom: string;
  dateOfBirthTo: string;
  phoneNumber: string;
  occupation: string;
  educationalLevel: string[];
  maritalStatus: string[];
  spouseName: string;
  joinedFrom: string;
  joinedTo: string;
  emergencyContactName: string;
  emergencyRelationship: string[];
  emergencyPhoneNumber: string;
  status: string[];
  group: string[];
};

const initialFilters: SpiritualChildFilters = {
  baptismalName: "",
  gender: [],
  dateOfBirthFrom: "",
  dateOfBirthTo: "",
  phoneNumber: "",
  occupation: "",
  educationalLevel: [],
  maritalStatus: [],
  spouseName: "",
  joinedFrom: "",
  joinedTo: "",
  emergencyContactName: "",
  emergencyRelationship: [],
  emergencyPhoneNumber: "",
  status: [],
  group: [],
};

type FilterableSpiritualChild = SpiritualChild & {
  dateOfBirth?: string;
  occupation?: string;
  educationalLevel?: string;
  maritalStatus?: string;
  spouseName?: string;
  spiritualChildJoinedDate?: string;
  emergencyContactName?: string;
  emergencyRelationship?: string;
  emergencyPhoneNumber?: string;
};

function toIsoDateString(value?: string) {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function hydrateFilterableChild(child: SpiritualChild): FilterableSpiritualChild {
  return {
    ...child,
    spiritualChildJoinedDate: toIsoDateString(child.joinedOn),
  };
}

function getQuickFilterLabel(
  fallbackLabel: string,
  selectedValues: string[],
  singularLabel: string,
) {
  if (selectedValues.length === 0) {
    return fallbackLabel;
  }

  if (selectedValues.length === 1) {
    return selectedValues[0];
  }

  return `${selectedValues.length} ${singularLabel}`;
}

const filterInputClassName =
  "h-11 w-full rounded-[13px] border border-[#e5dece] bg-white px-3.5 text-sm font-semibold text-[#33415f] outline-none transition-all placeholder:text-[#a0a7b5] focus:border-[#c4a45a] focus:ring-4 focus:ring-[#d7b04d]/10";

function FilterTextInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.05em] text-[#68728a]">
        {label}
      </span>

      <input
        className={filterInputClassName}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="text"
        value={value}
      />
    </label>
  );
}

function FilterDateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.05em] text-[#68728a]">
        {label}
      </span>

      <div className="relative">
        <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b86a0]" />

        <input
          className={cn(filterInputClassName, "pl-10")}
          onChange={(event) => onChange(event.target.value)}
          type="date"
          value={value}
        />
      </div>
    </label>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.05em] text-[#68728a]">
        {label}
      </span>

      <select
        className={cn(
          filterInputClassName,
          "appearance-none pr-10",
        )}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue || optionLabel} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function FilterCheckboxGroup({
  label,
  values,
  options,
  onChange,
}: {
  label: string;
  values: string[];
  options: Array<[string, string]>;
  onChange: (values: string[]) => void;
}) {
  const handleToggle = (optionValue: string) => {
    if (values.includes(optionValue)) {
      onChange(values.filter((v) => v !== optionValue));
    } else {
      onChange([...values, optionValue]);
    }
  };

  return (
    <div>
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.05em] text-[#68728a]">
        {label}
      </span>

      <div className="space-y-2">
        {options.map(([optionValue, optionLabel]) => (
          <label
            key={optionValue || optionLabel}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              checked={values.includes(optionValue)}
              className="h-4 w-4 rounded border-[#e5dece] accent-[#b99645]"
              onChange={() => handleToggle(optionValue)}
              type="checkbox"
              value={optionValue}
            />
            <span className="text-sm font-semibold text-[#33415f]">
              {optionLabel}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

type FilterField = keyof SpiritualChildFilters;

const availableFilterFields: Array<{ key: FilterField; label: string; category: string }> = [
  { key: "baptismalName", label: "Baptismal Name", category: "Personal Information" },
  { key: "gender", label: "Gender", category: "Personal Information" },
  { key: "dateOfBirthFrom", label: "Born From", category: "Personal Information" },
  { key: "dateOfBirthTo", label: "Born To", category: "Personal Information" },
  { key: "phoneNumber", label: "Phone Number", category: "Personal Information" },
  { key: "occupation", label: "Occupation", category: "Personal Information" },
  { key: "educationalLevel", label: "Educational Level", category: "Personal Information" },
  { key: "maritalStatus", label: "Marital Status", category: "Personal Information" },
  { key: "spouseName", label: "Spouse Name", category: "Personal Information" },
  { key: "joinedFrom", label: "Joined From", category: "Personal Information" },
  { key: "joinedTo", label: "Joined To", category: "Personal Information" },
  { key: "group", label: "Group", category: "Personal Information" },
  { key: "status", label: "Profile Status", category: "Personal Information" },
  { key: "emergencyContactName", label: "Contact Name", category: "Emergency Contact" },
  { key: "emergencyRelationship", label: "Relationship", category: "Emergency Contact" },
  { key: "emergencyPhoneNumber", label: "Emergency Phone", category: "Emergency Contact" },
];

const defaultVisibleFields: FilterField[] = [
  "baptismalName",
  "gender",
  "phoneNumber",
  "educationalLevel",
  "maritalStatus",
  "group",
  "status",
];

export function SpiritualChildrenView() {
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [registeredChildren, setRegisteredChildren] =
    useState<FilterableSpiritualChild[]>(
      spiritualChildren.map(hydrateFilterableChild),
    );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] =
    useState<SpiritualChildFilters>(initialFilters);
  const [visibleFilterFields, setVisibleFilterFields] =
    useState<FilterField[]>(defaultVisibleFields);
  const [isFieldSelectorOpen, setIsFieldSelectorOpen] = useState(false);
  const [openQuickFilter, setOpenQuickFilter] = useState<"status" | "group" | null>(
    null,
  );

  const updateFilter = (
    field: keyof SpiritualChildFilters,
    value: string | string[],
  ) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setSearchQuery("");
    setOpenQuickFilter(null);
  };

  const activeFilterCount = Object.values(filters).filter(
    (value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value.trim() !== "";
    },
  ).length;

  const toggleQuickArrayFilter = (
    field: "status" | "group",
    optionValue: string,
  ) => {
    const currentValues = filters[field];
    updateFilter(
      field,
      currentValues.includes(optionValue)
        ? currentValues.filter((value) => value !== optionValue)
        : [...currentValues, optionValue],
    );
  };

  const clearQuickArrayFilter = (field: "status" | "group") => {
    updateFilter(field, []);
  };

  const statusOptions = Array.from(
    new Set(registeredChildren.map((child) => child.status)),
  ).sort((left, right) => left.localeCompare(right));

  const groupOptions = Array.from(
    new Set(registeredChildren.map((child) => child.group)),
  ).sort((left, right) => left.localeCompare(right));

const filteredChildren = registeredChildren.filter((originalChild) => {
  const child = originalChild as FilterableSpiritualChild;
  const normalizedSearch = searchQuery.trim().toLowerCase();

  const matchesGeneralSearch =
    !normalizedSearch ||
    child.name.toLowerCase().includes(normalizedSearch) ||
    child.contact.toLowerCase().includes(normalizedSearch) ||
    child.guardian?.toLowerCase().includes(normalizedSearch);

  const matchesBaptismalName =
    !filters.baptismalName ||
    child.name
      .toLowerCase()
      .includes(filters.baptismalName.toLowerCase());

  const matchesGender =
    filters.gender.length === 0 || filters.gender.includes(child.gender);

  const matchesPhone =
    !filters.phoneNumber ||
    child.contact
      .replace(/\s/g, "")
      .includes(filters.phoneNumber.replace(/\s/g, ""));

  const matchesOccupation =
    !filters.occupation ||
    child.occupation
      ?.toLowerCase()
      .includes(filters.occupation.toLowerCase());

  const matchesEducation =
    filters.educationalLevel.length === 0 ||
    (child.educationalLevel && filters.educationalLevel.includes(child.educationalLevel));

  const matchesMaritalStatus =
    filters.maritalStatus.length === 0 ||
    (child.maritalStatus && filters.maritalStatus.includes(child.maritalStatus));

  const matchesSpouse =
    !filters.spouseName ||
    child.spouseName
      ?.toLowerCase()
      .includes(filters.spouseName.toLowerCase());

  const matchesEmergencyName =
    !filters.emergencyContactName ||
    child.emergencyContactName
      ?.toLowerCase()
      .includes(filters.emergencyContactName.toLowerCase());

  const matchesEmergencyRelationship =
    filters.emergencyRelationship.length === 0 ||
    (child.emergencyRelationship && filters.emergencyRelationship.includes(child.emergencyRelationship));

  const matchesEmergencyPhone =
    !filters.emergencyPhoneNumber ||
    child.emergencyPhoneNumber
      ?.replace(/\s/g, "")
      .includes(filters.emergencyPhoneNumber.replace(/\s/g, ""));

  const matchesStatus =
    filters.status.length === 0 || filters.status.includes(child.status);

  const matchesGroup =
    filters.group.length === 0 || filters.group.includes(child.group);

  const birthDate = child.dateOfBirth
    ? new Date(child.dateOfBirth)
    : null;

  const joinedDate = child.spiritualChildJoinedDate
    ? new Date(child.spiritualChildJoinedDate)
    : null;

  const matchesBirthFrom =
    !filters.dateOfBirthFrom ||
    (birthDate &&
      birthDate >= new Date(filters.dateOfBirthFrom));

  const matchesBirthTo =
    !filters.dateOfBirthTo ||
    (birthDate &&
      birthDate <= new Date(filters.dateOfBirthTo));

  const matchesJoinedFrom =
    !filters.joinedFrom ||
    (joinedDate &&
      joinedDate >= new Date(filters.joinedFrom));

  const matchesJoinedTo =
    !filters.joinedTo ||
    (joinedDate &&
      joinedDate <= new Date(filters.joinedTo));

  return (
    matchesGeneralSearch &&
    matchesBaptismalName &&
    matchesGender &&
    matchesPhone &&
    matchesOccupation &&
    matchesEducation &&
    matchesMaritalStatus &&
    matchesSpouse &&
    matchesEmergencyName &&
    matchesEmergencyRelationship &&
    matchesEmergencyPhone &&
    matchesStatus &&
    matchesGroup &&
    matchesBirthFrom &&
    matchesBirthTo &&
    matchesJoinedFrom &&
    matchesJoinedTo
  );
});

  const stats = [
    {
      label: "Total Spiritual Children",
      value: String(registeredChildren.length),
      icon: Users,
      iconClassName: "bg-[#f3e8ff] text-[#8d5df6]",
    },
    {
      label: "New This Month",
      value: String(
        Math.max(registeredChildren.length - spiritualChildren.length, 0),
      ),
      icon: UserPlus,
      iconClassName: "bg-[#ebfff3] text-[#2eaf67]",
    },
    {
      label: "Active This Week",
      value: String(
        registeredChildren.filter((child) => child.status === "Active").length,
      ),
      icon: ShieldAlert,
      iconClassName: "bg-[#ebf1ff] text-[#3f72ff]",
    },
    {
      label: "Need Follow-up",
      value: String(
        registeredChildren.filter((child) => child.status === "Needs Follow-up")
          .length,
      ),
      icon: Users,
      iconClassName: "bg-[#fff5df] text-[#f59e0b]",
    },
  ] as const;

  const handleSaveSpiritualChild = (
    submission: NewSpiritualChildSubmission,
  ) => {
    setRegisteredChildren((currentChildren) => [
      buildSpiritualChild(submission, currentChildren),
      ...currentChildren,
    ]);
    setIsAddChildModalOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ icon: Icon, iconClassName, label, value }) => (
            <div
              key={label}
              className="group relative min-h-[190px] overflow-hidden rounded-[24px] border border-[#ebe5d9] bg-white px-7 py-6 shadow-[0_10px_30px_rgba(26,38,67,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d9c79e] hover:shadow-[0_18px_40px_rgba(26,38,67,0.12)]"
            >
              <div className="pointer-events-none absolute -right-12 -top-14 h-32 w-32 rounded-full bg-[#d7b04d]/[0.07] transition-transform duration-500 group-hover:scale-125" />

              <div className="relative z-10 flex items-start justify-between">
                <div
                  className={cn(
                    "flex h-[58px] w-[58px] items-center justify-center rounded-[18px] shadow-sm ring-1 ring-black/[0.025] transition-transform duration-300 group-hover:scale-105",
                    iconClassName,
                  )}
                >
                  <Icon className="h-7 w-7" strokeWidth={1.8} />
                </div>

                <span className="rounded-full bg-[#f7f2e8] px-3 py-1 text-xs font-bold text-[#a17c2e]">
                  Overview
                </span>
              </div>

              <div className="relative z-10 mt-6">
                <p className="text-[38px] font-extrabold leading-none tracking-tight text-[#17223f]">
                  {value}
                </p>

                <p className="mt-3 text-[16px] font-bold text-[#263453]">
                  {label}
                </p>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#b99645] to-[#e0bf68] transition-transform duration-300 group-hover:scale-x-100" />
            </div>
          ))}
        </section>

        <Card className="overflow-hidden rounded-[28px] border border-[#ebe5d9] bg-white shadow-[0_14px_38px_rgba(25,38,70,0.08)]">
          <CardContent className="p-0">
            <div className="border-b border-[#eee9df] px-5 py-5 sm:px-7">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="text-[22px] font-extrabold text-[#17223f]">
                    Spiritual Children
                  </h2>

                  <p className="mt-1 text-sm font-medium text-[#8992a7]">
                    View and manage all spiritual children under your guidance.
                  </p>
                </div>

                <Button
                  className="h-12 rounded-[16px] bg-[#b99645] px-5 text-[15px] font-bold text-white shadow-[0_8px_18px_rgba(185,150,69,0.24)] transition-all hover:-translate-y-0.5 hover:bg-[#a98437]"
                  onClick={() => setIsAddChildModalOpen(true)}
                >
                  <Plus className="h-5 w-5" />
                  Add Spiritual Child
                </Button>
              </div>

              <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
                <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-[16px] border border-[#e9e3d8] bg-[#fcfaf6] px-4 text-[#7b86a7] transition-all focus-within:border-[#c9ae6b] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#d7b04d]/10">
                  <Search className="h-5 w-5 shrink-0" />

                  <input
                    className="w-full bg-transparent text-sm font-medium text-[#3f4964] outline-none placeholder:text-[#9299aa]"
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by name or phone number..."
                    type="search"
                    value={searchQuery}
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-3 lg:flex">
                  <div className="relative">
                    <button
                      className={cn(
                        "flex h-12 items-center justify-between gap-4 rounded-[16px] border px-4 text-sm font-semibold transition-colors sm:min-w-[145px]",
                        filters.status.length > 0 || openQuickFilter === "status"
                          ? "border-[#c4a45a] bg-[#fbf6e9] text-[#9b7525]"
                          : "border-[#e9e3d8] bg-white text-[#4c5678] hover:bg-[#faf7f0]",
                      )}
                      onClick={() =>
                        setOpenQuickFilter((current) =>
                          current === "status" ? null : "status",
                        )
                      }
                      type="button"
                    >
                      {getQuickFilterLabel(
                        "All Status",
                        filters.status,
                        "Statuses",
                      )}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openQuickFilter === "status" && "rotate-180",
                        )}
                      />
                    </button>

                    {openQuickFilter === "status" && (
                      <div className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-[220px] rounded-[18px] border border-[#e7dfcf] bg-white p-3 shadow-[0_20px_40px_rgba(25,38,70,0.12)]">
                        <div className="flex items-center justify-between border-b border-[#efe7db] px-1 pb-2">
                          <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#7b8499]">
                            Status
                          </p>

                          <button
                            className="text-xs font-bold text-[#a47e2d] hover:text-[#8d6b22]"
                            onClick={() => clearQuickArrayFilter("status")}
                            type="button"
                          >
                            Clear
                          </button>
                        </div>

                        <div className="mt-3 space-y-2">
                          {statusOptions.map((option) => (
                            <label
                              key={option}
                              className="flex cursor-pointer items-center gap-2 rounded-[12px] px-2 py-2 text-sm font-semibold text-[#43516f] transition-colors hover:bg-[#faf7f0]"
                            >
                              <input
                                checked={filters.status.includes(option)}
                                className="h-4 w-4 rounded accent-[#b99645]"
                                onChange={() =>
                                  toggleQuickArrayFilter("status", option)
                                }
                                type="checkbox"
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      className={cn(
                        "flex h-12 items-center justify-between gap-4 rounded-[16px] border px-4 text-sm font-semibold transition-colors sm:min-w-[145px]",
                        filters.group.length > 0 || openQuickFilter === "group"
                          ? "border-[#c4a45a] bg-[#fbf6e9] text-[#9b7525]"
                          : "border-[#e9e3d8] bg-white text-[#4c5678] hover:bg-[#faf7f0]",
                      )}
                      onClick={() =>
                        setOpenQuickFilter((current) =>
                          current === "group" ? null : "group",
                        )
                      }
                      type="button"
                    >
                      {getQuickFilterLabel(
                        "All Groups",
                        filters.group,
                        "Groups",
                      )}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openQuickFilter === "group" && "rotate-180",
                        )}
                      />
                    </button>

                    {openQuickFilter === "group" && (
                      <div className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-[220px] rounded-[18px] border border-[#e7dfcf] bg-white p-3 shadow-[0_20px_40px_rgba(25,38,70,0.12)]">
                        <div className="flex items-center justify-between border-b border-[#efe7db] px-1 pb-2">
                          <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#7b8499]">
                            Group
                          </p>

                          <button
                            className="text-xs font-bold text-[#a47e2d] hover:text-[#8d6b22]"
                            onClick={() => clearQuickArrayFilter("group")}
                            type="button"
                          >
                            Clear
                          </button>
                        </div>

                        <div className="mt-3 space-y-2">
                          {groupOptions.map((option) => (
                            <label
                              key={option}
                              className="flex cursor-pointer items-center gap-2 rounded-[12px] px-2 py-2 text-sm font-semibold text-[#43516f] transition-colors hover:bg-[#faf7f0]"
                            >
                              <input
                                checked={filters.group.includes(option)}
                                className="h-4 w-4 rounded accent-[#b99645]"
                                onChange={() =>
                                  toggleQuickArrayFilter("group", option)
                                }
                                type="checkbox"
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    className={cn(
                      "relative flex h-12 items-center justify-center gap-2 rounded-[16px] border px-4 text-sm font-semibold transition-all sm:min-w-[120px]",
                      isFilterOpen || activeFilterCount > 0
                        ? "border-[#c4a45a] bg-[#fbf6e9] text-[#9b7525]"
                        : "border-[#e9e3d8] bg-white text-[#4c5678] hover:bg-[#faf7f0]",
                    )}
                    onClick={() => {
                      setOpenQuickFilter(null);
                      setIsFilterOpen((current) => !current);
                    }}
                    type="button"
                  >
                    <Filter className="h-4 w-4" />
                    Filter

                    {activeFilterCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b99645] px-1.5 text-[11px] font-extrabold text-white">
                        {activeFilterCount}
                      </span>
                    )}

                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isFilterOpen && "rotate-180",
                      )}
                    />
                  </button>
                </div>
              </div>
              {isFilterOpen && (
  <div className="mt-5 overflow-hidden rounded-[22px] border border-[#e8e0d2] bg-[#fcfaf6] shadow-[0_10px_30px_rgba(25,38,70,0.06)]">
    <div className="flex flex-col gap-3 border-b border-[#ece5d9] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#f4eddf] text-[#a37d2d]">
          <SlidersHorizontal className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-extrabold text-[#1d294d]">
            Advanced Filters
          </h3>

          <p className="text-xs font-medium text-[#8a93a7]">
            Filter using registration and emergency-contact information.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="relative flex h-10 items-center gap-2 rounded-[12px] border border-[#e3dccf] bg-white px-4 text-sm font-bold text-[#5e6881] transition-colors hover:bg-[#f7f3eb]"
          onClick={() => setIsFieldSelectorOpen(!isFieldSelectorOpen)}
          type="button"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Select Fields
          {visibleFilterFields.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b99645] px-1.5 text-[11px] font-extrabold text-white">
              {visibleFilterFields.length}
            </span>
          )}
        </button>

        <button
          className="flex h-10 items-center gap-2 rounded-[12px] border border-[#e3dccf] bg-white px-4 text-sm font-bold text-[#5e6881] transition-colors hover:bg-[#f7f3eb]"
          onClick={resetFilters}
          type="button"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>

        <button
          aria-label="Close filters"
          className="flex h-10 w-10 items-center justify-center rounded-[12px] text-[#77819c] hover:bg-[#f4efe5]"
          onClick={() => setIsFilterOpen(false)}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>

    {isFieldSelectorOpen && (
      <div className="border-b border-[#ece5d9] bg-[#f8f5ed] px-5 py-4">
        <h4 className="mb-3 text-sm font-extrabold uppercase tracking-[0.08em] text-[#7d8496]">
          Select Filter Fields
        </h4>
        <div className="space-y-4">
          {["Personal Information", "Emergency Contact"].map((category) => (
            <div key={category}>
              <h5 className="mb-2 text-xs font-bold text-[#5e6881]">
                {category}
              </h5>
              <div className="flex flex-wrap gap-3">
                {availableFilterFields
                  .filter((field) => field.category === category)
                  .map((field) => (
                    <label
                      key={field.key}
                      className="flex items-center gap-2 cursor-pointer rounded-lg border border-[#e5dece] bg-white px-3 py-2 text-sm font-semibold text-[#33415f] transition-colors hover:bg-[#faf7f0]"
                    >
                      <input
                        checked={visibleFilterFields.includes(field.key)}
                        className="h-4 w-4 rounded accent-[#b99645]"
                        onChange={() => {
                          if (visibleFilterFields.includes(field.key)) {
                            setVisibleFilterFields(
                              visibleFilterFields.filter((f) => f !== field.key),
                            );
                          } else {
                            setVisibleFilterFields([...visibleFilterFields, field.key]);
                          }
                        }}
                        type="checkbox"
                      />
                      {field.label}
                    </label>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="p-5">
      <h4 className="mb-4 text-sm font-extrabold uppercase tracking-[0.08em] text-[#7d8496]">
        Personal Information
      </h4>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {visibleFilterFields.includes("baptismalName") && (
          <FilterTextInput
            label="Baptismal Name"
            placeholder="Enter name"
            value={filters.baptismalName}
            onChange={(value) =>
              updateFilter("baptismalName", value)
            }
          />
        )}

        {visibleFilterFields.includes("gender") && (
          <FilterCheckboxGroup
            label="Gender"
            values={filters.gender}
            onChange={(values) => updateFilter("gender", values)}
            options={[
              ["Male", "Male"],
              ["Female", "Female"],
            ]}
          />
        )}

        {visibleFilterFields.includes("dateOfBirthFrom") && (
          <FilterDateInput
            label="Born From"
            value={filters.dateOfBirthFrom}
            onChange={(value) =>
              updateFilter("dateOfBirthFrom", value)
            }
          />
        )}

        {visibleFilterFields.includes("dateOfBirthTo") && (
          <FilterDateInput
            label="Born To"
            value={filters.dateOfBirthTo}
            onChange={(value) =>
              updateFilter("dateOfBirthTo", value)
            }
          />
        )}

        {visibleFilterFields.includes("phoneNumber") && (
          <FilterTextInput
            label="Phone Number"
            placeholder="0912..."
            value={filters.phoneNumber}
            onChange={(value) =>
              updateFilter("phoneNumber", value)
            }
          />
        )}

        {visibleFilterFields.includes("occupation") && (
          <FilterTextInput
            label="Occupation"
            placeholder="Enter occupation"
            value={filters.occupation}
            onChange={(value) =>
              updateFilter("occupation", value)
            }
          />
        )}

        {visibleFilterFields.includes("educationalLevel") && (
          <FilterCheckboxGroup
            label="Educational Level"
            values={filters.educationalLevel}
            onChange={(values) =>
              updateFilter("educationalLevel", values)
            }
            options={[
              ["Primary School", "Primary School"],
              ["Secondary School", "Secondary School"],
              ["College", "College"],
              ["University", "University"],
              ["Graduate Studies", "Graduate Studies"],
            ]}
          />
        )}

        {visibleFilterFields.includes("maritalStatus") && (
          <FilterCheckboxGroup
            label="Marital Status"
            values={filters.maritalStatus}
            onChange={(values) =>
              updateFilter("maritalStatus", values)
            }
            options={[
              ["Single", "Single"],
              ["Married", "Married"],
              ["Divorced", "Divorced"],
              ["Widowed", "Widowed"],
            ]}
          />
        )}

        {visibleFilterFields.includes("spouseName") && (
          <FilterTextInput
            label="Spouse Name"
            placeholder="Enter spouse name"
            value={filters.spouseName}
            onChange={(value) =>
              updateFilter("spouseName", value)
            }
          />
        )}

        {visibleFilterFields.includes("joinedFrom") && (
          <FilterDateInput
            label="Joined From"
            value={filters.joinedFrom}
            onChange={(value) =>
              updateFilter("joinedFrom", value)
            }
          />
        )}

        {visibleFilterFields.includes("joinedTo") && (
          <FilterDateInput
            label="Joined To"
            value={filters.joinedTo}
            onChange={(value) =>
              updateFilter("joinedTo", value)
            }
          />
        )}

        {visibleFilterFields.includes("group") && (
          <FilterCheckboxGroup
            label="Group"
            values={filters.group}
            onChange={(values) => updateFilter("group", values)}
            options={[
              ["Teens", "Teens"],
              ["Young Adults", "Young Adults"],
              ["Adults", "Adults"],
              ["Families", "Families"],
            ]}
          />
        )}

        {visibleFilterFields.includes("status") && (
          <FilterCheckboxGroup
            label="Profile Status"
            values={filters.status}
            onChange={(values) => updateFilter("status", values)}
            options={[
              ["Active", "Active"],
              ["Needs Follow-up", "Needs Follow-up"],
              ["Inactive", "Inactive"],
            ]}
          />
        )}
      </div>

      <div className="my-6 border-t border-[#e9e2d6]" />

      <h4 className="mb-4 text-sm font-extrabold uppercase tracking-[0.08em] text-[#7d8496]">
        Emergency Contact
      </h4>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleFilterFields.includes("emergencyContactName") && (
          <FilterTextInput
            label="Contact Name"
            placeholder="Enter emergency contact"
            value={filters.emergencyContactName}
            onChange={(value) =>
              updateFilter("emergencyContactName", value)
            }
          />
        )}

        {visibleFilterFields.includes("emergencyRelationship") && (
          <FilterCheckboxGroup
            label="Relationship"
            values={filters.emergencyRelationship}
            onChange={(values) =>
              updateFilter("emergencyRelationship", values)
            }
            options={[
              ["Parent", "Parent"],
              ["Sibling", "Sibling"],
              ["Spouse", "Spouse"],
              ["Guardian", "Guardian"],
              ["Relative", "Relative"],
              ["Friend", "Friend"],
            ]}
          />
        )}

        {visibleFilterFields.includes("emergencyPhoneNumber") && (
          <FilterTextInput
            label="Emergency Phone"
            placeholder="0912..."
            value={filters.emergencyPhoneNumber}
            onChange={(value) =>
              updateFilter("emergencyPhoneNumber", value)
            }
          />
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-[#e9e2d6] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-[#747e96]">
          Showing{" "}
          <span className="font-extrabold text-[#24314e]">
            {filteredChildren.length}
          </span>{" "}
          matching spiritual children.
        </p>

        <button
          className="flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#b99645] px-5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(185,150,69,0.22)] transition-colors hover:bg-[#a98437]"
          onClick={() => setIsFilterOpen(false)}
          type="button"
        >
          <Filter className="h-4 w-4" />
          View Results
        </button>
      </div>
    </div>
  </div>
)}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <div className="min-w-[980px]">
                <div className="grid grid-cols-[2fr_1.3fr_1.15fr_1.2fr_1fr_100px] items-center gap-4 border-b border-[#eee9df] bg-[#faf8f3] px-7 py-4 text-[13px] font-extrabold uppercase tracking-[0.06em] text-[#7b8499]">
                  <p>Name</p>
                  <p>Contact</p>
                  <p>Group</p>
                  <p>Joined On</p>
                  <p>Status</p>
                  <p className="text-right">Actions</p>
                </div>

                {filteredChildren.length === 0 ? (
                  <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f2e8] text-[#8c95a8]">
                      <Users className="h-8 w-8" />
                    </div>

                    <p className="text-lg font-bold text-[#22304f]">
                      No spiritual children found
                    </p>

                    <p className="max-w-[320px] text-sm font-medium text-[#8690a5]">
                      Try a different search term or add a new spiritual child.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#f0ece4]">
                    {filteredChildren.map((child) => (
                      <div
                        key={child.slug}
                        className="group grid grid-cols-[2fr_1.3fr_1.15fr_1.2fr_1fr_100px] items-center gap-4 px-7 py-4 transition-all duration-200 hover:bg-[#fcfaf6]"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div
                            className={cn(
                              "flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] text-sm font-extrabold shadow-sm transition-transform duration-200 group-hover:scale-105",
                              child.avatarClassName,
                            )}
                          >
                            {child.initials}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-[15px] font-extrabold text-[#1d2859]">
                              {child.name}
                            </p>

                            <p className="mt-1 text-sm font-medium text-[#8a93a7]">
                              Age {child.age}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm font-semibold text-[#56617d]">
                          {child.contact}
                        </p>

                        <div>
                          <Badge
                            variant={child.groupVariant}
                            className="rounded-full px-3 py-1"
                          >
                            {child.group}
                          </Badge>
                        </div>

                        <p className="text-sm font-semibold text-[#56617d]">
                          {child.joinedOn}
                        </p>

                        <div>
                          <Badge
                            variant={child.statusVariant}
                            className="rounded-full px-3 py-1"
                          >
                            {child.status}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          <Link
                            aria-label={`View ${child.name}`}
                            href={`/father/children/${child.slug}`}
                            className="flex h-9 w-9 items-center justify-center rounded-[12px] border border-transparent text-[#7d86a7] transition-all hover:border-[#e7dfcf] hover:bg-white hover:text-[#a47e2d] hover:shadow-sm"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <button
                            aria-label={`More options for ${child.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-[12px] border border-transparent text-[#7d86a7] transition-all hover:border-[#e7dfcf] hover:bg-white hover:text-[#a47e2d] hover:shadow-sm"
                            type="button"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 p-4 md:hidden">
              {filteredChildren.length === 0 ? (
                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[20px] border border-[#eee8dc] bg-[#fcfaf6] px-6 py-10 text-center shadow-[0_5px_14px_rgba(25,38,70,0.04)]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f2e8] text-[#8c95a8]">
                    <Users className="h-8 w-8" />
                  </div>

                  <p className="mt-4 text-lg font-bold text-[#22304f]">
                    No spiritual children found
                  </p>

                  <p className="mt-2 text-sm font-medium text-[#8690a5]">
                    Try another search or add a new spiritual child.
                  </p>
                </div>
              ) : (
                filteredChildren.map((child) => (
                  <div
                    key={child.slug}
                    className="rounded-[20px] border border-[#eee8dc] bg-[#fcfaf6] p-4 shadow-[0_5px_14px_rgba(25,38,70,0.04)]"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] text-sm font-extrabold",
                          child.avatarClassName,
                        )}
                      >
                        {child.initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-extrabold text-[#1d2859]">
                          {child.name}
                        </p>

                        <p className="mt-1 text-sm text-[#7b8499]">
                          Age {child.age} - {child.contact}
                        </p>
                      </div>

                      <button
                        className="flex h-9 w-9 items-center justify-center rounded-[12px] text-[#7d86a7] hover:bg-white"
                        type="button"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#eee8dc] pt-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-[#9a9faa]">
                          Group
                        </p>

                        <div className="mt-2">
                          <Badge variant={child.groupVariant}>{child.group}</Badge>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-[#9a9faa]">
                          Status
                        </p>

                        <div className="mt-2">
                          <Badge variant={child.statusVariant}>
                            {child.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#9a9faa]">
                          Joined On
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#56617d]">
                          {child.joinedOn}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/father/children/${child.slug}`}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#f4efe5] py-2.5 text-sm font-bold text-[#947126]"
                    >
                      <Eye className="h-4 w-4" />
                      View Profile
                    </Link>
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-col gap-4 border-t border-[#eee9df] bg-[#fcfbf8] px-5 py-5 text-sm font-semibold text-[#667089] sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <p>
                Showing{" "}
                <span className="font-extrabold text-[#24314e]">
                  {filteredChildren.length === 0 ? 0 : 1}-{filteredChildren.length}
                </span>{" "}
                of{" "}
                <span className="font-extrabold text-[#24314e]">
                  {registeredChildren.length}
                </span>{" "}
                results
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#e5dfd4] bg-white text-[#7d86a7] transition-colors hover:bg-[#f7f2e8]"
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#b99645] text-sm font-bold text-white shadow-[0_6px_14px_rgba(185,150,69,0.25)]"
                  type="button"
                >
                  1
                </button>

                {[2, 3].map((page) => (
                  <button
                    key={page}
                    className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#e5dfd4] bg-white text-sm font-bold text-[#4c5678] transition-colors hover:bg-[#f7f2e8]"
                    type="button"
                  >
                    {page}
                  </button>
                ))}

                <span className="px-1 text-[#969dac]">...</span>

                <button
                  className="flex h-10 min-w-10 items-center justify-center rounded-[12px] border border-[#e5dfd4] bg-white px-3 text-sm font-bold text-[#4c5678] transition-colors hover:bg-[#f7f2e8]"
                  type="button"
                >
                  20
                </button>

                <button
                  className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#e5dfd4] bg-white text-[#4c5678] transition-colors hover:bg-[#f7f2e8]"
                  type="button"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddSpiritualChildModal
        open={isAddChildModalOpen}
        onClose={() => setIsAddChildModalOpen(false)}
        onSave={handleSaveSpiritualChild}
      />
    </>
  );
}
