"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BookHeart,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  FileBadge,
  Search,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type {
  AppointmentRequestListItem,
  AppointmentRequestReason,
  AppointmentRequestStats,
  AppointmentRequestStatus,
  FatherAppointmentRequestsResponse,
} from "@/contracts/appointment-request";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

const emptyStats: AppointmentRequestStats = {
  pending: 0,
  approved: 0,
  rejected: 0,
  cancelled: 0,
  expired: 0,
  total: 0,
};

function getRequestStats(
  requests: AppointmentRequestListItem[],
): AppointmentRequestStats {
  return requests.reduce<AppointmentRequestStats>(
    (stats, request) => {
      stats.total += 1;

      switch (request.status) {
        case "PENDING":
          stats.pending += 1;
          break;
        case "APPROVED":
          stats.approved += 1;
          break;
        case "REJECTED":
          stats.rejected += 1;
          break;
        case "CANCELLED":
          stats.cancelled += 1;
          break;
        case "EXPIRED":
          stats.expired += 1;
          break;
      }

      return stats;
    },
    { ...emptyStats },
  );
}

const tabs = [
  "All Requests",
  "Pending",
  "Accepted",
  "Rejected",
] as const;

type RequestTab = (typeof tabs)[number];

const requestTypeFilters = [
  "All Types",
  "Confession",
  "Counseling",
  "Repentance",
  "Spiritual Guidance",
  "Family Issues",
  "Other",
] as const;

type RequestTypeFilter =
  (typeof requestTypeFilters)[number];

type RequestDialogMode = "accept" | "decline";

const reasonLabels: Record<
  AppointmentRequestReason,
  string
> = {
  confession: "Confession",
  counseling: "Counseling",
  repentance: "Repentance",
  "spiritual-guidance": "Spiritual Guidance",
  "family-issue": "Family Issues",
  other: "Other",
};

const tabStatus: Record<
  Exclude<RequestTab, "All Requests">,
  AppointmentRequestStatus
> = {
  Pending: "PENDING",
  Accepted: "APPROVED",
  Rejected: "REJECTED",
};

function statusLabel(status: AppointmentRequestStatus) {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "APPROVED":
      return "Accepted";
    case "REJECTED":
      return "Rejected";
    case "CANCELLED":
      return "Cancelled";
    case "EXPIRED":
      return "Expired";
  }
}

function statusVariant(
  status: AppointmentRequestStatus,
): "violet" | "success" | "danger" | "warning" {
  switch (status) {
    case "PENDING":
      return "violet";
    case "APPROVED":
      return "success";
    case "REJECTED":
    case "CANCELLED":
      return "danger";
    case "EXPIRED":
      return "warning";
  }
}

function reasonVariant(
  reason: AppointmentRequestReason,
): "violet" | "success" | "danger" | "warning" {
  switch (reason) {
    case "confession":
    case "counseling":
      return "violet";
    case "spiritual-guidance":
      return "success";
    case "family-issue":
      return "danger";
    case "repentance":
    case "other":
      return "warning";
  }
}

function formatDate(value: string) {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatSubmittedDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatSubmittedTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function displayTime(value: string) {
  const [hourText = "0", minute = "00"] =
    value.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour =
    hour % 12 === 0 ? 12 : hour % 12;

  return `${displayHour}:${minute} ${suffix}`;
}

function durationMinutes(
  startTime: string,
  endTime: string,
) {
  const [startHour = "0", startMinute = "0"] =
    startTime.split(":");
  const [endHour = "0", endMinute = "0"] =
    endTime.split(":");

  return (
    Number(endHour) * 60 +
    Number(endMinute) -
    (Number(startHour) * 60 + Number(startMinute))
  );
}

async function readErrorMessage(
  response: Response,
  fallback: string,
) {
  try {
    const body = (await response.json()) as {
      error?: string;
    };

    return body.error ?? fallback;
  } catch {
    return fallback;
  }
}

export function RequestsView() {
  const [requests, setRequests] = useState<
    AppointmentRequestListItem[]
  >([]);
  const [stats, setStats] =
    useState<AppointmentRequestStats>(emptyStats);
  const [selectedRequest, setSelectedRequest] =
    useState<AppointmentRequestListItem | null>(null);
  const [dialogMode, setDialogMode] =
    useState<RequestDialogMode>("accept");
  const [responseNote, setResponseNote] = useState("");
  const [selectedType, setSelectedType] =
    useState<RequestTypeFilter>("All Types");
  const [activeTab, setActiveTab] =
    useState<RequestTab>("All Requests");
  const [isTypeMenuOpen, setIsTypeMenuOpen] =
    useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [error, setError] = useState<string | null>(
    null,
  );

  const loadRequests = async () => {
    setError(null);

    const response = await fetch(
      "/api/appointment-requests",
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(
        await readErrorMessage(
          response,
          "Unable to load appointment requests.",
        ),
      );
    }

    const body =
      (await response.json()) as FatherAppointmentRequestsResponse;

    setRequests(body.requests);
    setStats(body.stats);
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setIsLoading(true);

      try {
        await loadRequests();
      } catch (loadError: unknown) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load appointment requests.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  const statCards = [
    {
      label: "New Requests",
      value: stats.pending,
      icon: FileBadge,
    },
    {
      label: "Accepted",
      value: stats.approved,
      icon: CircleDashed,
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: CheckCircle2,
    },
    {
      label: "Total Requests",
      value: stats.total,
      icon: BookHeart,
    },
  ] as const;

  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchText
      .trim()
      .toLowerCase();

    return requests.filter((request) => {
      if (
        activeTab !== "All Requests" &&
        request.status !== tabStatus[activeTab]
      ) {
        return false;
      }

      if (
        selectedType !== "All Types" &&
        reasonLabels[request.reason] !== selectedType
      ) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [
        request.childName,
        reasonLabels[request.reason],
        request.requestMessage ?? "",
      ].some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      );
    });
  }, [
    activeTab,
    requests,
    searchText,
    selectedType,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRequests.length / PAGE_SIZE),
  );

  const safePage = Math.min(currentPage, totalPages);

  const visibleRequests = filteredRequests.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchText, selectedType]);

  const openRequestDialog = (
    request: AppointmentRequestListItem,
    mode: RequestDialogMode,
  ) => {
    setSelectedRequest(request);
    setDialogMode(mode);
    setResponseNote("");
    setError(null);
  };

  const closeRequestDialog = () => {
    if (isSubmitting) {
      return;
    }

    setSelectedRequest(null);
    setResponseNote("");
  };

  const completeRequestAction = async () => {
    if (!selectedRequest || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/appointment-requests/${selectedRequest.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action:
              dialogMode === "accept"
                ? "ACCEPT"
                : "DECLINE",
            responseNote:
              responseNote.trim() || null,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          await readErrorMessage(
            response,
            "Unable to update the request.",
          ),
        );
      }

      const body = (await response.json()) as {
        request: AppointmentRequestListItem;
      };

      const updatedRequests = requests.map((request) =>
        request.id === body.request.id ? body.request : request,
      );

      setRequests(updatedRequests);
      setStats(getRequestStats(updatedRequests));
      setActiveTab(
        dialogMode === "accept" ? "Accepted" : "Rejected",
      );
      setSelectedRequest(null);
      setResponseNote("");
    } catch (actionError: unknown) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Unable to update the request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const firstShown =
    filteredRequests.length === 0
      ? 0
      : (safePage - 1) * PAGE_SIZE + 1;
  const lastShown = Math.min(
    safePage * PAGE_SIZE,
    filteredRequests.length,
  );

  return (
    <>
      <section className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(
          ({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="group relative min-h-[174px] overflow-hidden rounded-[24px] border border-[#ebe5d9] bg-[#fdfcf9] px-7 py-6 shadow-[0_10px_30px_rgba(26,38,67,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d9c79e] hover:shadow-[0_18px_40px_rgba(26,38,67,0.12)]"
            >
              <div className="pointer-events-none absolute -right-12 -top-14 h-32 w-32 rounded-full bg-[#d7b04d]/[0.07]" />

              <div className="relative z-10">
                <div className="flex h-[58px] w-[58px] items-center justify-center rounded-[18px] bg-[#ddb84f] text-[#18335f] shadow-[0_7px_16px_rgba(205,163,58,0.24)]">
                  <Icon className="h-7 w-7" strokeWidth={1.9} />
                </div>

                <p className="mt-6 text-[42px] font-extrabold leading-none tracking-tight text-[#17223f]">
                  {value}
                </p>

                <p className="mt-3 text-[18px] font-bold text-[#263453]">
                  {label}
                </p>
              </div>
            </div>
          ),
        )}
      </section>

      <div className="mt-6">
        <Card className="rounded-[28px] border border-[#ebe5d9] bg-[#fdfcf9] shadow-[0_14px_38px_rgba(25,38,70,0.08)]">
          <CardContent className="p-0">
            <div className="grid grid-cols-4 border-b border-[#ebe5d9] text-base font-extrabold text-[#6b7695]">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "border-b-2 px-2 py-5 text-center transition-colors sm:px-4",
                    activeTab === tab
                      ? "border-[#b99645] text-[#9b7525]"
                      : "border-transparent hover:text-[#1d2859]",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-[#e9e3d8] bg-white px-4 py-3 text-[#7b86a7]">
                  <Search className="h-5 w-5 shrink-0" />
                  <input
                    className="min-w-0 flex-1 bg-transparent text-base font-semibold text-[#33415f] outline-none placeholder:text-[#7b86a7]"
                    onChange={(event) =>
                      setSearchText(event.target.value)
                    }
                    placeholder="Search by name or request type..."
                    value={searchText}
                  />
                </label>

                <div className="relative self-start">
                  <button
                    aria-expanded={isTypeMenuOpen}
                    aria-haspopup="listbox"
                    className="flex min-h-[50px] min-w-[190px] items-center justify-between gap-5 rounded-2xl border border-[#e9e3d8] bg-white px-4 text-base font-semibold text-[#56617d] hover:border-[#d7c391]"
                    onClick={() =>
                      setIsTypeMenuOpen((open) => !open)
                    }
                    type="button"
                  >
                    {selectedType}
                    <ChevronDown className="h-4 w-4 text-[#7b86a7]" />
                  </button>

                  {isTypeMenuOpen ? (
                    <div
                      className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-[#e9e3d8] bg-white p-1.5 shadow-[0_16px_32px_rgba(25,38,70,0.14)]"
                      role="listbox"
                    >
                      {requestTypeFilters.map((type) => (
                        <button
                          key={type}
                          className={cn(
                            "flex w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold",
                            selectedType === type
                              ? "bg-[#f7efd9] text-[#9b7525]"
                              : "text-[#56617d] hover:bg-[#faf8f3]",
                          )}
                          onClick={() => {
                            setSelectedType(type);
                            setIsTypeMenuOpen(false);
                          }}
                          type="button"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              {error ? (
                <div className="mt-4 rounded-2xl border border-[#f1c7c4] bg-[#fff5f4] px-4 py-3 text-sm font-semibold text-[#b7443e]">
                  {error}
                </div>
              ) : null}

              <div className="mt-6 overflow-x-auto border border-[#ebe5d9]">
                <div className="hidden min-w-[900px] grid-cols-[1.5fr_1fr_1fr_130px_200px] items-center gap-6 border-b border-[#eee9df] bg-[#faf8f3] px-7 py-4 text-[14px] font-extrabold uppercase tracking-[0.06em] text-[#7b8499] lg:grid">
                  <p>Request</p>
                  <p>Type</p>
                  <p>Requested On</p>
                  <p>Status</p>
                  <p className="text-right">Actions</p>
                </div>

                <div className="min-w-[900px] divide-y divide-[#f0ece4] bg-white">
                  {isLoading ? (
                    <div className="px-7 py-14 text-center text-sm font-semibold text-[#7b8499]">
                      Loading appointment requests...
                    </div>
                  ) : visibleRequests.length === 0 ? (
                    <div className="px-7 py-14 text-center text-sm font-semibold text-[#7b8499]">
                      No appointment requests match the selected filters.
                    </div>
                  ) : (
                    visibleRequests.map((request) => (
                      <div
                        key={request.id}
                        className="group grid grid-cols-[1.5fr_1fr_1fr_130px_200px] items-center gap-6 px-7 py-5 hover:bg-[#fcfaf6]"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[17px] font-extrabold text-[#1d2859]">
                            {request.childName}
                          </p>
                          <p className="mt-1 truncate text-sm font-medium text-[#8992a7]">
                            {request.requestMessage ||
                              "No message was provided."}
                          </p>
                        </div>

                        <Badge
                          variant={reasonVariant(request.reason)}
                          className="w-fit rounded-full px-3 py-1 text-sm"
                        >
                          {reasonLabels[request.reason]}
                        </Badge>

                        <div>
                          <p className="text-base font-semibold text-[#56617d]">
                            {formatSubmittedDate(
                              request.createdAt,
                            )}
                          </p>
                          <p className="mt-1 text-[15px] font-medium text-[#8a93a7]">
                            {formatSubmittedTime(
                              request.createdAt,
                            )}
                          </p>
                        </div>

                        <Badge
                          variant={statusVariant(request.status)}
                          className="w-fit rounded-full px-3 py-1 text-sm"
                        >
                          {statusLabel(request.status)}
                        </Badge>

                        <div className="flex items-center justify-end gap-2">
                          {request.status === "PENDING" ? (
                            <>
                              <button
                                className="flex h-9 items-center gap-1.5 rounded-[10px] bg-[#d4ab4f] px-3 text-sm font-bold text-white hover:bg-[#c49b3f]"
                                onClick={() =>
                                  openRequestDialog(
                                    request,
                                    "accept",
                                  )
                                }
                                type="button"
                              >
                                <Check className="h-4 w-4" />
                                Accept
                              </button>

                              <button
                                className="flex h-9 items-center gap-1.5 rounded-[10px] border border-[#e67670] bg-white px-3 text-sm font-bold text-[#cf4f48] hover:bg-[#fff4f3]"
                                onClick={() =>
                                  openRequestDialog(
                                    request,
                                    "decline",
                                  )
                                }
                                type="button"
                              >
                                <X className="h-4 w-4" />
                                Decline
                              </button>
                            </>
                          ) : request.status === "APPROVED" ? (
                            <button
                              className="flex h-9 items-center gap-1.5 rounded-[10px] border border-[#e67670] bg-white px-3 text-sm font-bold text-[#cf4f48] hover:bg-[#fff4f3]"
                              onClick={() =>
                                openRequestDialog(
                                  request,
                                  "decline",
                                )
                              }
                              type="button"
                            >
                              <X className="h-4 w-4" />
                              Change to Declined
                            </button>
                          ) : request.status === "REJECTED" ? (
                            <button
                              className="flex h-9 items-center gap-1.5 rounded-[10px] bg-[#d4ab4f] px-3 text-sm font-bold text-white hover:bg-[#c49b3f]"
                              onClick={() =>
                                openRequestDialog(
                                  request,
                                  "accept",
                                )
                              }
                              type="button"
                            >
                              <Check className="h-4 w-4" />
                              Change to Accepted
                            </button>
                          ) : (
                            <span className="text-sm font-semibold text-[#8a93a7]">
                              Reviewed
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 text-sm font-semibold text-[#4c5678] sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Showing {firstShown} to {lastShown} of{" "}
                  {filteredRequests.length} requests
                </p>

                <div className="flex items-center gap-2">
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9e3d8] bg-white text-[#7d86a7] disabled:opacity-40"
                    disabled={safePage <= 1}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.max(1, page - 1),
                      )
                    }
                    type="button"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <span className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-[#b99645] px-3 text-sm font-bold text-white">
                    {safePage}
                  </span>

                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9e3d8] bg-white text-[#4c5678] disabled:opacity-40"
                    disabled={safePage >= totalPages}
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
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedRequest ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <button
            aria-label="Close request dialog"
            className="absolute inset-0 bg-[#17223f]/40 backdrop-blur-sm"
            onClick={closeRequestDialog}
            type="button"
          />

          <div
            aria-labelledby="request-dialog-title"
            aria-modal="true"
            className="relative z-10 w-full max-w-[480px] rounded-[22px] border border-[#eee4d4] bg-white p-6 shadow-[0_24px_64px_rgba(23,34,63,0.22)]"
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="request-dialog-title"
                  className="text-xl font-extrabold text-[#1d2b51]"
                >
                  {dialogMode === "accept"
                    ? selectedRequest.status === "REJECTED"
                      ? "Change to Accepted"
                      : "Accept Request"
                    : selectedRequest.status === "APPROVED"
                      ? "Change to Declined"
                      : "Decline Request"}
                </h2>

                <p className="mt-2 text-sm font-medium text-[#6d7892]">
                  Request from{" "}
                  <span className="font-extrabold text-[#1d2b51]">
                    {selectedRequest.childName}
                  </span>
                </p>
              </div>

              <button
                aria-label="Close request dialog"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#71809b] hover:bg-[#f7f3eb]"
                onClick={closeRequestDialog}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-[#eee7da] bg-[#fcfaf6] p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#8b93a5]">
                Appointment Summary
              </p>

              <dl className="mt-4 grid grid-cols-[110px_1fr] gap-x-4 gap-y-3 text-sm">
                <dt className="font-bold text-[#758098]">
                  Reason
                </dt>
                <dd className="font-extrabold text-[#263453]">
                  {reasonLabels[selectedRequest.reason]}
                </dd>

                <dt className="font-bold text-[#758098]">
                  Date
                </dt>
                <dd className="font-extrabold text-[#263453]">
                  {formatDate(selectedRequest.requestedDate)}
                </dd>

                <dt className="font-bold text-[#758098]">
                  Time
                </dt>
                <dd className="font-extrabold text-[#263453]">
                  {displayTime(
                    selectedRequest.requestedStartTime,
                  )}
                  {"–"}
                  {displayTime(
                    selectedRequest.requestedEndTime,
                  )}
                </dd>

                <dt className="font-bold text-[#758098]">
                  Duration
                </dt>
                <dd className="font-extrabold text-[#263453]">
                  {durationMinutes(
                    selectedRequest.requestedStartTime,
                    selectedRequest.requestedEndTime,
                  )}{" "}
                  min
                </dd>
              </dl>
            </div>

            <label className="mt-5 block text-sm font-bold text-[#33415f]">
              Response note{" "}
              <span className="font-medium text-[#7d89a3]">
                (optional)
              </span>

              <textarea
                className="mt-2 min-h-[110px] w-full resize-none rounded-[12px] border border-[#e4e0d8] px-4 py-3 text-sm font-medium text-[#253252] outline-none focus:border-[#c5a860] focus:ring-4 focus:ring-[#d7b04d]/10"
                onChange={(event) =>
                  setResponseNote(event.target.value)
                }
                placeholder="Add a message or instructions for the spiritual child..."
                value={responseNote}
              />
            </label>

            {error ? (
              <p className="mt-3 text-sm font-semibold text-[#b7443e]">
                {error}
              </p>
            ) : null}

            <div className="mt-5 flex gap-3">
              <button
                className="h-11 flex-1 rounded-[12px] border border-[#ded8cd] bg-white px-4 text-sm font-bold text-[#56627c] hover:bg-[#faf8f4] disabled:opacity-50"
                disabled={isSubmitting}
                onClick={closeRequestDialog}
                type="button"
              >
                Cancel
              </button>

              <button
                className={cn(
                  "flex h-11 flex-1 items-center justify-center gap-2 rounded-[12px] px-4 text-sm font-bold text-white disabled:opacity-60",
                  dialogMode === "accept"
                    ? "bg-[#d4ab4f] hover:bg-[#c49b3f]"
                    : "bg-[#d55750] hover:bg-[#bf463f]",
                )}
                disabled={isSubmitting}
                onClick={() =>
                  void completeRequestAction()
                }
                type="button"
              >
                {dialogMode === "accept" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <X className="h-4 w-4" />
                )}

                {isSubmitting
                  ? "Saving..."
                  : dialogMode === "accept"
                    ? selectedRequest.status === "REJECTED"
                      ? "Change to Accepted"
                      : "Accept Request"
                    : selectedRequest.status === "APPROVED"
                      ? "Change to Declined"
                      : "Decline Request"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
