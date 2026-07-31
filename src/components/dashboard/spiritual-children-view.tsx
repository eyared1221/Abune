"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
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
import type { SpiritualChild } from "@/lib/spiritual-children";
import {
  createSpiritualChildAction,
  listSpiritualChildrenAction,
} from "@/server/actions/spiritual-children.actions";
import type { PersistedSpiritualChild } from "@/types/spiritual-child";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const avatarClassNames = [
  "bg-[#f4ebff] text-[#8e59ff]",
  "bg-[#e8fff2] text-[#2eaf67]",
  "bg-[#eaf1ff] text-[#4676ff]",
  "bg-[#ffe9f0] text-[#ef476f]",
  "bg-[#fff2da] text-[#f59e0b]",
] as const;

function normalizeGender(value?: string) {
  switch (value) {
    case "Male":
    case "MALE":
      return "MALE";
    case "Female":
    case "FEMALE":
      return "FEMALE";
    default:
      return value;
  }
}

function normalizeEducationalLevel(value?: string) {
  switch (value) {
    case "non formal":
    case "NON_FORMAL":
      return "NON_FORMAL";
    case "Primary School":
    case "PRIMARY":
      return "PRIMARY";
    case "Secondary School":
    case "SECONDARY":
      return "SECONDARY";
    case "College":
    case "TVET_DIPLOMA":
      return "TVET_DIPLOMA";
    case "University":
    case "BACHELOR":
      return "BACHELOR";
    case "Graduate Studies":
    case "MASTER":
      return "MASTER";
    case "phd":
    case "PHD":
      return "PHD";
    default:
      return value;
  }
}

function normalizeMaritalStatus(value?: string) {
  switch (value) {
    case "Single":
    case "SINGLE":
      return "SINGLE";
    case "Orthodox Holy Matrimony":
    case "ORTHODOX_HOLY_MATRIMONY":
      return "ORTHODOX_HOLY_MATRIMONY";
    case "Civil or Traditional Marriage":
    case "CIVIL_OR_TRADITIONAL_MARRIAGE":
      return "CIVIL_OR_TRADITIONAL_MARRIAGE";
    case "Divorced":
    case "DIVORCED":
      return "DIVORCED";
    case "Widowed":
    case "WIDOWED":
      return "WIDOWED";
    default:
      return value;
  }
}

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

function getAgeGroup(age: number) {
  if (age < 18) {
    return { label: "Under 18", variant: "success" as const };
  }

  if (age < 40) {
    return { label: "Young Adults", variant: "violet" as const };
  }

  if (age < 65) {
    return { label: "Middle-Aged", variant: "neutral" as const };
  }

  return { label: "Older Adults", variant: "warning" as const };
}

function formatJoinedDate(
  dateValue: string | undefined,
  locale: string,
) {
  const date = dateValue ? new Date(dateValue) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;

  return new Intl.DateTimeFormat(
    locale === "am" ? "am-ET" : "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(safeDate);
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
  persisted?: Pick<
    PersistedSpiritualChild,
    "slug" | "status"
  >,
  locale = "en",
  t?: (key: string) => string,
): FilterableSpiritualChild {
  const age = calculateAge(submission.dateOfBirth);
  const ageGroup = getAgeGroup(age);
  const formattedName = submission.baptismalName.trim();
  const nextAppointmentTitle = submission.children.length
    ? (t?.("appointments.familyGuidance") || "Family Guidance Session")
    : (t?.("appointments.pastoralIntroduction") || "Pastoral Introduction");

return {
  slug:
    persisted?.slug ??
    createUniqueSlug(formattedName, existingChildren),
  initials: getInitials(formattedName) || "SC",
  name: formattedName,
  age,
  gender: submission.gender as SpiritualChild["gender"],
  contact: submission.phoneNumber,
  guardian: "",

  // Registration details used by the advanced filter
  dateOfBirth: submission.dateOfBirth,
  occupation: submission.occupation,
  educationalLevel: submission.educationalLevel,
  maritalStatus: submission.maritalStatus,
  spouseName: submission.spouseName,
  spiritualChildJoinedDate: submission.spiritualChildJoinedDate ?? "",

  group: ageGroup.label,
  groupVariant: ageGroup.variant,

  // Use the actual joined date instead of today's date
  joinedOn: formatJoinedDate(
    submission.spiritualChildJoinedDate,
    locale,
  ),

  status: persisted?.status ?? "Active",
  statusVariant: "success",
  avatarClassName:
    avatarClassNames[existingChildren.length % avatarClassNames.length],
  communionReady: false,

  repentance: {
    label: t?.("repentance.newRegistration") || "New Registration",
    daysLeft: 7,
    progress: 18,
    note: t?.("repentance.note") || "Recently added and awaiting first pastoral follow-up.",
  },

  nextAppointment: {
    date: t?.("appointment.toBeScheduled") || "To be scheduled",
    time: t?.("appointment.pending") || "Pending",
    title: nextAppointmentTitle,
    note: t?.("appointment.note") || "Schedule an introductory follow-up with the spiritual child.",
  },

  appointments: [
    {
      title: nextAppointmentTitle,
      date: t?.("appointment.toBeScheduled") || "To be scheduled",
      time: t?.("appointment.pending") || "Pending",
      note: t?.("appointment.initialMeeting") || "Initial pastoral meeting will be added after review.",
    },
  ],

  repentanceSteps: [
    {
      title: t?.("steps.registrationCompleted") || "Registration completed",
      complete: true,
      note: t?.("steps.registrationNote") || "Profile created successfully from the add child form.",
    },
    {
      title: t?.("steps.pastoralWelcome") || "Pastoral welcome session",
      complete: false,
      note: t?.("steps.pastoralNote") || "Needs to be scheduled with the spiritual child.",
    },
    {
      title: t?.("steps.communionPreparation") || "Holy Communion preparation review",
      complete: false,
      note: t?.("steps.communionNote") || "Pending initial spiritual guidance.",
    },
  ],

  attendance: {
    rate: t?.("attendance.new") || "New",
    lastSeen: t?.("attendance.noVisits") || "No visits recorded yet",
    note: submission.occupation
      ? `${t?.("attendance.occupationNoted") || "Occupation noted as"} ${submission.occupation}.`
      : t?.("attendance.noActivity") || "No attendance activity recorded yet.",
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
};


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

const availableFilterFields: FilterField[] = [
  "baptismalName",
  "gender",
  "dateOfBirthFrom",
  "dateOfBirthTo",
  "phoneNumber",
  "occupation",
  "educationalLevel",
  "maritalStatus",
  "spouseName",
  "joinedFrom",
  "joinedTo",
  "group",
  "status",
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

const PAGE_SIZE = 10;

type PaginationItem =
  | number
  | "left-ellipsis"
  | "right-ellipsis";

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
  }

  if (currentPage <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      "right-ellipsis",
      totalPages,
    ];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "left-ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "left-ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "right-ellipsis",
    totalPages,
  ];
}

export function SpiritualChildrenView() {
  const [currentPage, setCurrentPage] = useState(1);
  const t = useTranslations("SpiritualChildren");
  const locale = useLocale();

  const genderFilterOptions: Array<[string, string]> = [
    ["MALE", t("options.gender.MALE")],
    ["FEMALE", t("options.gender.FEMALE")],
  ];

  const educationalLevelFilterOptions: Array<[string, string]> = [
    ["NON_FORMAL", t("options.educationalLevel.NON_FORMAL")],
    ["PRIMARY", t("options.educationalLevel.PRIMARY")],
    ["SECONDARY", t("options.educationalLevel.SECONDARY")],
    ["TVET_DIPLOMA", t("options.educationalLevel.TVET_DIPLOMA")],
    ["BACHELOR", t("options.educationalLevel.BACHELOR")],
    ["MASTER", t("options.educationalLevel.MASTER")],
    ["PHD", t("options.educationalLevel.PHD")],
  ];

  const maritalStatusFilterOptions: Array<[string, string]> = [
    ["SINGLE", t("options.maritalStatus.SINGLE")],
    [
      "ORTHODOX_HOLY_MATRIMONY",
      t("options.maritalStatus.ORTHODOX_HOLY_MATRIMONY"),
    ],
    [
      "CIVIL_OR_TRADITIONAL_MARRIAGE",
      t("options.maritalStatus.CIVIL_OR_TRADITIONAL_MARRIAGE"),
    ],
    ["DIVORCED", t("options.maritalStatus.DIVORCED")],
    ["WIDOWED", t("options.maritalStatus.WIDOWED")],
  ];

  const groupFilterOptions: Array<[string, string]> = [
    ["Under 18", t("options.group.under18")],
    ["Young Adults", t("options.group.youngAdults")],
    ["Middle-Aged", t("options.group.middleAged")],
    ["Older Adults", t("options.group.olderAdults")],
  ];

  const statusFilterOptions: Array<[string, string]> = [
    ["Active", t("options.status.active")],
    ["Needs Follow-up", t("options.status.needsFollowUp")],
    ["Inactive", t("options.status.inactive")],
  ];

  const groupLabels = Object.fromEntries(
    groupFilterOptions,
  ) as Record<string, string>;
  const statusLabels = Object.fromEntries(
    statusFilterOptions,
  ) as Record<string, string>;

  const getGroupLabel = (value: string) =>
    groupLabels[value] ?? value;
  const getStatusLabel = (value: string) =>
    statusLabels[value] ?? value;

  const filterFieldLabels: Record<FilterField, string> = {
    baptismalName: t("filters.fields.baptismalName"),
    gender: t("filters.fields.gender"),
    dateOfBirthFrom: t("filters.fields.dateOfBirthFrom"),
    dateOfBirthTo: t("filters.fields.dateOfBirthTo"),
    phoneNumber: t("filters.fields.phoneNumber"),
    occupation: t("filters.fields.occupation"),
    educationalLevel: t("filters.fields.educationalLevel"),
    maritalStatus: t("filters.fields.maritalStatus"),
    spouseName: t("filters.fields.spouseName"),
    joinedFrom: t("filters.fields.joinedFrom"),
    joinedTo: t("filters.fields.joinedTo"),
    group: t("filters.fields.group"),
    status: t("filters.fields.status"),
  };

  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [registeredChildren, setRegisteredChildren] =
    useState<FilterableSpiritualChild[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSavingChild, setIsSavingChild] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] =
    useState<SpiritualChildFilters>(initialFilters);
  const [visibleFilterFields, setVisibleFilterFields] =
    useState<FilterField[]>(defaultVisibleFields);
  const [isFieldSelectorOpen, setIsFieldSelectorOpen] = useState(false);
  const [openQuickFilter, setOpenQuickFilter] = useState<"status" | "group" | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadChildren() {
      setIsLoadingChildren(true);
      setLoadError(null);

      const result = await listSpiritualChildrenAction();

      if (cancelled) {
        return;
      }

      if (!result.success) {
        setLoadError(result.error);
        setRegisteredChildren([]);
        setIsLoadingChildren(false);
        return;
      }

      const loadedChildren =
        result.children.reduce<FilterableSpiritualChild[]>(
          (currentChildren, child) => {
            currentChildren.push(
              buildSpiritualChild(
                child.submission,
                currentChildren,
                child,
                locale,
                t,
              ),
            );
            return currentChildren;
          },
          [],
        );

      setRegisteredChildren(loadedChildren);
      setIsLoadingChildren(false);
    }

    void loadChildren();

    return () => {
      cancelled = true;
    };
  }, [locale]);

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

  const groupOptions = groupFilterOptions.map(([value]) => value);

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
    filters.gender.length === 0 ||
    filters.gender.includes(normalizeGender(child.gender) ?? "");

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
    (child.educationalLevel &&
      filters.educationalLevel.includes(
        normalizeEducationalLevel(child.educationalLevel) ?? "",
      ));

  const matchesMaritalStatus =
    filters.maritalStatus.length === 0 ||
    (child.maritalStatus &&
      filters.maritalStatus.includes(
        normalizeMaritalStatus(child.maritalStatus) ?? "",
      ));

  const matchesSpouse =
    !filters.spouseName ||
    child.spouseName
      ?.toLowerCase()
      .includes(filters.spouseName.toLowerCase());

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
    matchesStatus &&
    matchesGroup &&
    matchesBirthFrom &&
    matchesBirthTo &&
    matchesJoinedFrom &&
    matchesJoinedTo
  );

});

  const totalResults = filteredChildren.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalResults / PAGE_SIZE),
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages,
  );

  const firstResultIndex =
    (safeCurrentPage - 1) * PAGE_SIZE;

  const paginatedChildren = filteredChildren.slice(
    firstResultIndex,
    firstResultIndex + PAGE_SIZE,
  );

  const fromResult =
    totalResults === 0 ? 0 : firstResultIndex + 1;

  const toResult =
    totalResults === 0
      ? 0
      : Math.min(
          firstResultIndex + PAGE_SIZE,
          totalResults,
        );

  const paginationItems = getPaginationItems(
    safeCurrentPage,
    totalPages,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const statusQuickFilterLabel
 =
    filters.status.length === 0
      ? t("quickFilters.allStatus")
      : filters.status.length === 1
        ? getStatusLabel(filters.status[0])
        : t("quickFilters.selectedStatuses", {
            count: filters.status.length,
          });

  const groupQuickFilterLabel =
    filters.group.length === 0
      ? t("quickFilters.allGroups")
      : filters.group.length === 1
        ? getGroupLabel(filters.group[0])
        : t("quickFilters.selectedGroups", {
            count: filters.group.length,
          });

const stats = [
  {
    label: t("stats.total"),
    value: String(registeredChildren.length),
    icon: Users,
  },
  {
    label: t("stats.newThisMonth"),
    value: String(
      registeredChildren.filter((child) => {
        if (!child.spiritualChildJoinedDate) {
          return false;
        }

        const joinedDate = new Date(
          `${child.spiritualChildJoinedDate}T00:00:00`,
        );
        const today = new Date();

        return (
          joinedDate.getFullYear() === today.getFullYear() &&
          joinedDate.getMonth() === today.getMonth()
        );
      }).length,
    ),
    icon: UserPlus,
  },
  {
    label: t("stats.activeThisWeek"),
    value: String(
      registeredChildren.filter(
        (child) => child.status === "Active",
      ).length,
    ),
    icon: ShieldAlert,
  },
  {
    label: t("stats.needFollowUp"),
    value: String(
      registeredChildren.filter(
        (child) => child.status === "Needs Follow-up",
      ).length,
    ),
    icon: Users,
  },
] as const;

  const handleSaveSpiritualChild = async (
    submission: NewSpiritualChildSubmission,
  ) => {
    if (isSavingChild) {
      return;
    }

    setIsSavingChild(true);
    setSaveError(null);

    const result = await createSpiritualChildAction(submission);

    if (!result.success) {
      setSaveError(result.error);
      setIsSavingChild(false);
      return;
    }

    setRegisteredChildren((currentChildren) => [
      buildSpiritualChild(
        result.child.submission,
        currentChildren,
        result.child,
        locale,
        t,
      ),
      ...currentChildren,
    ]);
    setIsSavingChild(false);
    setIsAddChildModalOpen(false);
  };

  return (
    <>
      <div className="space-y-6 bg-[#fdfcf9]">
        {isLoadingChildren ? (
          <div className="rounded-[18px] border border-[#e8e0d2] bg-[#fdfcf9] px-5 py-4 text-sm font-semibold text-[#68728a] shadow-sm">
            {t("loading")}
          </div>
        ) : null}

        {loadError ? (
          <div
            className="rounded-[18px] border border-[#f0d0ca] bg-[#fff5f3] px-5 py-4 text-sm font-semibold text-[#a3463b]"
            role="alert"
          >
            {loadError}
          </div>
        ) : null}

<section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
  {stats.map(({ icon: Icon, label, value }) => (
    <div
      key={label}
      className="group relative min-h-[190px] overflow-hidden rounded-[24px] border border-[#ebe5d9] bg-[#fdfcf9] px-7 py-6 shadow-[0_10px_30px_rgba(26,38,67,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d9c79e] hover:shadow-[0_18px_40px_rgba(26,38,67,0.12)]"
    >
      <div className="pointer-events-none absolute -right-12 -top-14 h-32 w-32 rounded-full bg-[#d7b04d]/[0.07] transition-transform duration-500 group-hover:scale-125" />

      <div className="relative z-10">
        <div className="flex h-[58px] w-[58px] items-center justify-center rounded-[18px] bg-[#ddb84f] text-[#18335f] shadow-[0_7px_16px_rgba(205,163,58,0.24)] ring-1 ring-black/[0.025] transition-transform duration-300 group-hover:scale-105">
          <Icon className="h-7 w-7" strokeWidth={1.9} />
        </div>

        <div className="mt-6">
          <p className="text-[38px] font-extrabold leading-none tracking-tight text-[#17223f]">
            {value}
          </p>

          <p className="mt-3 text-[16px] font-bold text-[#263453]">
            {label}
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#b99645] to-[#e0bf68] transition-transform duration-300 group-hover:scale-x-100" />
    </div>
  ))}
</section>

        <Card className="overflow-hidden rounded-[28px] border border-[#ebe5d9] bg-[#fdfcf9] shadow-[0_14px_38px_rgba(25,38,70,0.08)]">
          <CardContent className="p-0">
            <div className="border-b border-[#eee9df] px-5 py-5 sm:px-7">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="text-[22px] font-extrabold text-[#17223f]">
                    {t("header.title")}
                  </h2>

                  <p className="mt-1 text-sm font-medium text-[#8992a7]">
                    {t("header.description")}
                  </p>
                </div>

                <Button
                  className="h-12 rounded-[16px] bg-[#b99645] px-5 text-[15px] font-bold text-white shadow-[0_8px_18px_rgba(185,150,69,0.24)] transition-all hover:-translate-y-0.5 hover:bg-[#a98437]"
                  onClick={() => setIsAddChildModalOpen(true)}
                >
                  <Plus className="h-5 w-5" />
                  {t("header.addButton")}
                </Button>
              </div>

              <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
                <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-[16px] border border-[#e9e3d8] bg-[#fcfaf6] px-4 text-[#7b86a7] transition-all focus-within:border-[#c9ae6b] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#d7b04d]/10">
                  <Search className="h-5 w-5 shrink-0" />

                  <input
                    className="w-full bg-transparent text-sm font-medium text-[#3f4964] outline-none placeholder:text-[#9299aa]"
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={t("header.searchPlaceholder")}
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
                      {statusQuickFilterLabel}
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
                            {t("quickFilters.status")}
                          </p>

                          <button
                            className="text-xs font-bold text-[#a47e2d] hover:text-[#8d6b22]"
                            onClick={() => clearQuickArrayFilter("status")}
                            type="button"
                          >
                            {t("quickFilters.clear")}
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
                              {getStatusLabel(option)}
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
                      {groupQuickFilterLabel}
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
                            {t("quickFilters.group")}
                          </p>

                          <button
                            className="text-xs font-bold text-[#a47e2d] hover:text-[#8d6b22]"
                            onClick={() => clearQuickArrayFilter("group")}
                            type="button"
                          >
                            {t("quickFilters.clear")}
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
                              {getGroupLabel(option)}
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
                    {t("quickFilters.filter")}

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
            {t("filters.advancedTitle")}
          </h3>

          <p className="text-xs font-medium text-[#8a93a7]">
            {t("filters.advancedDescription")}
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
          {t("filters.selectFields")}
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
          {t("filters.reset")}
        </button>

        <button
          aria-label={t("accessibility.closeFilters")}
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
          {t("filters.selectFilterFields")}
        </h4>
        <div className="space-y-4">
          <div>
            <h5 className="mb-2 text-xs font-bold text-[#5e6881]">
              {t("filters.personalInformation")}
            </h5>
            <div className="flex flex-wrap gap-3">
              {availableFilterFields.map((field) => (
                <label
                  key={field}
                  className="flex items-center gap-2 cursor-pointer rounded-lg border border-[#e5dece] bg-white px-3 py-2 text-sm font-semibold text-[#33415f] transition-colors hover:bg-[#faf7f0]"
                >
                  <input
                    checked={visibleFilterFields.includes(field)}
                    className="h-4 w-4 rounded accent-[#b99645]"
                    onChange={() => {
                      if (visibleFilterFields.includes(field)) {
                        setVisibleFilterFields(
                          visibleFilterFields.filter(
                            (visibleField) => visibleField !== field,
                          ),
                        );
                      } else {
                        setVisibleFilterFields([
                          ...visibleFilterFields,
                          field,
                        ]);
                      }
                    }}
                    type="checkbox"
                  />
                  {filterFieldLabels[field]}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}

    <div className="p-5">
      <h4 className="mb-4 text-sm font-extrabold uppercase tracking-[0.08em] text-[#7d8496]">
        {t("filters.personalInformation")}
      </h4>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {visibleFilterFields.includes("baptismalName") && (
          <FilterTextInput
            label={t("filters.fields.baptismalName")}
            placeholder={t("filters.placeholders.name")}
            value={filters.baptismalName}
            onChange={(value) =>
              updateFilter("baptismalName", value)
            }
          />
        )}

        {visibleFilterFields.includes("gender") && (
          <FilterCheckboxGroup
            label={t("filters.fields.gender")}
            values={filters.gender}
            onChange={(values) => updateFilter("gender", values)}
            options={[...genderFilterOptions]}
          />
        )}

        {visibleFilterFields.includes("dateOfBirthFrom") && (
          <FilterDateInput
            label={t("filters.fields.dateOfBirthFrom")}
            value={filters.dateOfBirthFrom}
            onChange={(value) =>
              updateFilter("dateOfBirthFrom", value)
            }
          />
        )}

        {visibleFilterFields.includes("dateOfBirthTo") && (
          <FilterDateInput
            label={t("filters.fields.dateOfBirthTo")}
            value={filters.dateOfBirthTo}
            onChange={(value) =>
              updateFilter("dateOfBirthTo", value)
            }
          />
        )}

        {visibleFilterFields.includes("phoneNumber") && (
          <FilterTextInput
            label={t("filters.fields.phoneNumber")}
            placeholder={t("filters.placeholders.phone")}
            value={filters.phoneNumber}
            onChange={(value) =>
              updateFilter("phoneNumber", value)
            }
          />
        )}

        {visibleFilterFields.includes("occupation") && (
          <FilterTextInput
            label={t("filters.fields.occupation")}
            placeholder={t("filters.placeholders.occupation")}
            value={filters.occupation}
            onChange={(value) =>
              updateFilter("occupation", value)
            }
          />
        )}

        {visibleFilterFields.includes("educationalLevel") && (
          <FilterCheckboxGroup
            label={t("filters.fields.educationalLevel")}
            values={filters.educationalLevel}
            onChange={(values) =>
              updateFilter("educationalLevel", values)
            }
            options={[...educationalLevelFilterOptions]}
          />
        )}

        {visibleFilterFields.includes("maritalStatus") && (
          <FilterCheckboxGroup
            label={t("filters.fields.maritalStatus")}
            values={filters.maritalStatus}
            onChange={(values) =>
              updateFilter("maritalStatus", values)
            }
            options={[...maritalStatusFilterOptions]}
          />
        )}

        {visibleFilterFields.includes("spouseName") && (
          <FilterTextInput
            label={t("filters.fields.spouseName")}
            placeholder={t("filters.placeholders.spouseName")}
            value={filters.spouseName}
            onChange={(value) =>
              updateFilter("spouseName", value)
            }
          />
        )}

        {visibleFilterFields.includes("joinedFrom") && (
          <FilterDateInput
            label={t("filters.fields.joinedFrom")}
            value={filters.joinedFrom}
            onChange={(value) =>
              updateFilter("joinedFrom", value)
            }
          />
        )}

        {visibleFilterFields.includes("joinedTo") && (
          <FilterDateInput
            label={t("filters.fields.joinedTo")}
            value={filters.joinedTo}
            onChange={(value) =>
              updateFilter("joinedTo", value)
            }
          />
        )}

        {visibleFilterFields.includes("group") && (
          <FilterCheckboxGroup
            label={t("filters.fields.group")}
            values={filters.group}
            onChange={(values) => updateFilter("group", values)}
            options={groupFilterOptions}
          />
        )}

        {visibleFilterFields.includes("status") && (
          <FilterCheckboxGroup
            label={t("filters.fields.status")}
            values={filters.status}
            onChange={(values) => updateFilter("status", values)}
            options={statusFilterOptions}
          />
        )}
      </div>

      <div className="my-6 border-t border-[#e9e2d6]" />

      <div className="mt-6 flex flex-col gap-3 border-t border-[#e9e2d6] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-[#747e96]">
          {t("filters.showingMatching", { count: filteredChildren.length })}

        </p>

        <button
          className="flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#b99645] px-5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(185,150,69,0.22)] transition-colors hover:bg-[#a98437]"
          onClick={() => setIsFilterOpen(false)}
          type="button"
        >
          <Filter className="h-4 w-4" />
          {t("filters.viewResults")}
        </button>
      </div>
    </div>
  </div>
)}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <div className="min-w-[980px]">
                <div className="grid grid-cols-7 items-center gap-4 border-b border-[#eee9df] bg-[#faf8f3] px-7 py-4 text-[13px] font-extrabold uppercase tracking-[0.06em] text-[#7b8499]">
                  <p>{t("table.name")}</p>
                  <p>{t("table.ageLabel")}</p>
                  <p>{t("table.contact")}</p>
                  <p>{t("table.group")}</p>
                  <p>{t("table.joinedOn")}</p>
                  <p>{t("table.status")}</p>
                  <p className="text-right">{t("table.actions")}</p>
                </div>

                {filteredChildren.length === 0 ? (
                  <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f2e8] text-[#8c95a8]">
                      <Users className="h-8 w-8" />
                    </div>

                    <p className="text-lg font-bold text-[#22304f]">
                      {t("empty.title")}
                    </p>

                    <p className="max-w-[320px] text-sm font-medium text-[#8690a5]">
                      {t("empty.desktopDescription")}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#f0ece4]">
                    {paginatedChildren.map((child) => (
                      <div
                        key={child.slug}
                        className="group grid grid-cols-7 items-center gap-4 px-7 py-4 transition-all duration-200 hover:bg-[#fcfaf6]"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="min-w-0">
                            <p className="truncate text-[15px] font-normal text-[#1d2859]">
                              {child.name}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm font-semibold text-[#56617d]">
                          {child.age}
                        </p>

                        <p className="text-sm font-semibold text-[#56617d]">
                          {child.contact}
                        </p>

                        <div>
                          <Badge
                            variant={child.groupVariant}
                            className="rounded-full px-3 py-1"
                          >
                            {getGroupLabel(child.group)}
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
                            {getStatusLabel(child.status)}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          <Link
                            aria-label={t("accessibility.viewChild", { name: child.name })}
                            href={`/father/children/${child.slug}`}
                            className="flex h-9 w-9 items-center justify-center rounded-[12px] border border-transparent text-[#7d86a7] transition-all hover:border-[#e7dfcf] hover:bg-white hover:text-[#a47e2d] hover:shadow-sm"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <button
                            aria-label={t("accessibility.moreOptions", { name: child.name })}
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
                    {t("empty.title")}
                  </p>

                  <p className="mt-2 text-sm font-medium text-[#8690a5]">
                    {t("empty.mobileDescription")}
                  </p>
                </div>
              ) : (
                paginatedChildren.map((child) => (
                  <div
                    key={child.slug}
                    className="rounded-[20px] border border-[#eee8dc] bg-[#fcfaf6] p-4 shadow-[0_5px_14px_rgba(25,38,70,0.04)]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-normal text-[#1d2859]">
                          {child.name}
                        </p>

                        <p className="mt-1 text-sm text-[#7b8499]">
                          {t("table.age", { age: child.age })} - {child.contact}
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
                          {t("table.group")}
                        </p>

                        <div className="mt-2">
                          <Badge variant={child.groupVariant}>{getGroupLabel(child.group)}</Badge>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-[#9a9faa]">
                          {t("table.status")}
                        </p>

                        <div className="mt-2">
                          <Badge variant={child.statusVariant}>
                            {getStatusLabel(child.status)}
                          </Badge>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#9a9faa]">
                          {t("table.joinedOn")}
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
                      {t("actions.viewProfile")}
                    </Link>
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-col gap-4 border-t border-[#eee9df] bg-[#fcfbf8] px-5 py-5 text-sm font-semibold text-[#667089] sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <p>
                {t("pagination.summary", {
                  from: fromResult,
                  to: toResult,
                  total: totalResults,
                })}
              </p>

              {totalResults > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    aria-label="Previous page"
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#e5dfd4] bg-white transition-colors",
                      safeCurrentPage === 1
                        ? "cursor-not-allowed text-[#c4c8d1]"
                        : "text-[#7d86a7] hover:bg-[#f7f2e8]",
                    )}
                    disabled={safeCurrentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.max(1, page - 1),
                      )
                    }
                    type="button"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {paginationItems.map((item) => {
                    if (
                      item === "left-ellipsis" ||
                      item === "right-ellipsis"
                    ) {
                      return (
                        <span
                          key={item}
                          className="px-1 text-[#969dac]"
                        >
                          ...
                        </span>
                      );
                    }

                    const isSelected =
                      item === safeCurrentPage;

                    return (
                      <button
                        key={item}
                        aria-current={
                          isSelected ? "page" : undefined
                        }
                        className={cn(
                          "flex h-10 min-w-10 items-center justify-center rounded-[12px] px-3 text-sm font-bold transition-colors",
                          isSelected
                            ? "bg-[#b99645] text-white shadow-[0_6px_14px_rgba(185,150,69,0.25)]"
                            : "border border-[#e5dfd4] bg-white text-[#4c5678] hover:bg-[#f7f2e8]",
                        )}
                        onClick={() => setCurrentPage(item)}
                        type="button"
                      >
                        {item}
                      </button>
                    );
                  })}

                  <button
                    aria-label="Next page"
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#e5dfd4] bg-white transition-colors",
                      safeCurrentPage === totalPages
                        ? "cursor-not-allowed text-[#c4c8d1]"
                        : "text-[#4c5678] hover:bg-[#f7f2e8]",
                    )}
                    disabled={safeCurrentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1),
                      )
                    }
                    type="button"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      <AddSpiritualChildModal
        open={isAddChildModalOpen}
        onClose={() => {
          if (!isSavingChild) {
            setSaveError(null);
            setIsAddChildModalOpen(false);
          }
        }}
        onSave={handleSaveSpiritualChild}
        saving={isSavingChild}
        submitError={saveError}
      />
    </>
  );
}
