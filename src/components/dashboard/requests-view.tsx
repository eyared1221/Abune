"use client";

import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "New Requests",
    value: "14",
    icon: FileBadge,
    iconClassName: "bg-[#ddb84f] text-[#18335f]",
  },
  {
    label: "In Progress",
    value: "8",
    icon: CircleDashed,
    iconClassName: "bg-[#ddb84f] text-[#18335f]",
  },
  {
    label: "Completed",
    value: "23",
    icon: CheckCircle2,
    iconClassName: "bg-[#ddb84f] text-[#18335f]",
  },
  {
    label: "Total Requests",
    value: "56",
    icon: BookHeart,
    iconClassName: "bg-[#ddb84f] text-[#18335f]",
  },
] as const;

const tabs = ["All Requests", "Accepted", "Cancelled"] as const;

const requestTypeFilters = [
  "All Types",
  "Confession",
  "Counseling",
  "Repentance",
  "Spiritual Guidance",
  "Family Issues",
  "Other",
] as const;

const requests = [
  {
    initials: "MA",
    name: "Mekdes Assefa",
    description: "Request for spiritual counseling on a personal matter.",
    avatarClassName: "bg-[#f4ebff] text-[#8e59ff]",
    type: "Counseling",
    typeVariant: "violet" as const,
    requestedOn: "May 16, 2025",
    requestedAt: "10:15 AM",
    status: "New",
    statusVariant: "violet" as const,
  },
  {
    initials: "DG",
    name: "Daniel Gebre",
    description: "Request for guidance about choosing a career path.",
    avatarClassName: "bg-[#ddb84f] text-[#18335f]",
    type: "Guidance",
    typeVariant: "success" as const,
    requestedOn: "May 15, 2025",
    requestedAt: "09:45 AM",
    status: "In Progress",
    statusVariant: "warning" as const,
  },
  {
    initials: "HT",
    name: "Hanna Tesfaye",
    description: "Request for prayers for healing for a family member.",
    avatarClassName: "bg-[#ffe9f0] text-[#ef476f]",
    type: "Prayer",
    typeVariant: "danger" as const,
    requestedOn: "May 14, 2025",
    requestedAt: "04:30 PM",
    status: "In Progress",
    statusVariant: "warning" as const,
  },
  {
    initials: "YB",
    name: "Yonas Berhe",
    description: "Request to prepare for first confession.",
    avatarClassName: "bg-[#eaf1ff] text-[#4676ff]",
    type: "Confession",
    typeVariant: "violet" as const,
    requestedOn: "May 13, 2025",
    requestedAt: "02:20 PM",
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    initials: "RM",
    name: "Rachel Michael",
    description: "Request for advice on spiritual discipline and routines.",
    avatarClassName: "bg-[#f3ebff] text-[#8c5bff]",
    type: "Counseling",
    typeVariant: "violet" as const,
    requestedOn: "May 12, 2025",
    requestedAt: "11:00 AM",
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    initials: "SB",
    name: "Samuel Bekele",
    description: "Request for prayers before important exam.",
    avatarClassName: "bg-[#fff2da] text-[#f59e0b]",
    type: "Prayer",
    typeVariant: "danger" as const,
    requestedOn: "May 11, 2025",
    requestedAt: "08:30 AM",
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    initials: "AT",
    name: "Aster Tadesse",
    description: "Request for support during a difficult time.",
    avatarClassName: "bg-[#e9fff7] text-[#31a97f]",
    type: "Counseling",
    typeVariant: "violet" as const,
    requestedOn: "May 10, 2025",
    requestedAt: "06:10 PM",
    status: "New",
    statusVariant: "violet" as const,
  },
  {
    initials: "TG",
    name: "Tigist Gebremedhin",
    description: "Request for spiritual reading recommendation.",
    avatarClassName: "bg-[#ffe9f5] text-[#ef476f]",
    type: "Guidance",
    typeVariant: "success" as const,
    requestedOn: "May 9, 2025",
    requestedAt: "04:25 PM",
    status: "New",
    statusVariant: "violet" as const,
  },
] as const;

type RequestItem = (typeof requests)[number];
type RequestDialogMode = "accept" | "decline";

function requestKey(request: RequestItem) {
  return `${request.name}-${request.requestedOn}`;
}

export function RequestsView() {
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [dialogMode, setDialogMode] = useState<RequestDialogMode>("accept");
  const [responseNote, setResponseNote] = useState("");
  const [selectedType, setSelectedType] = useState<(typeof requestTypeFilters)[number]>("All Types");
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);

  const filteredRequests =
    selectedType === "All Types"
      ? requests
      : requests.filter((request) => request.type === selectedType);

  const openRequestDialog = (
    request: RequestItem,
    mode: RequestDialogMode,
  ) => {
    setSelectedRequest(request);
    setDialogMode(mode);
    setResponseNote("");
  };

  const closeRequestDialog = () => {
    setSelectedRequest(null);
    setResponseNote("");
  };

  const completeRequestAction = () => {
    if (!selectedRequest) return;

    closeRequestDialog();
  };

  return (
    <>
      <section className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(
          ({
            icon: Icon,
            label,
            value,
          }) => (
            <div
              key={label}
              className="group relative min-h-[174px] overflow-hidden rounded-[24px] border border-[#ebe5d9] bg-[#fdfcf9] px-7 py-6 shadow-[0_10px_30px_rgba(26,38,67,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d9c79e] hover:shadow-[0_18px_40px_rgba(26,38,67,0.12)]"
            >
              <div className="pointer-events-none absolute -right-12 -top-14 h-32 w-32 rounded-full bg-[#d7b04d]/[0.07] transition-transform duration-500 group-hover:scale-125" />

              <div className="relative z-10">
                <div className="flex h-[58px] w-[58px] items-center justify-center rounded-[18px] bg-[#ddb84f] text-[#18335f] shadow-[0_7px_16px_rgba(205,163,58,0.24)] ring-1 ring-black/[0.025] transition-transform duration-300 group-hover:scale-105">
                  <Icon className="h-7 w-7" strokeWidth={1.9} />
                </div>

                <div className="mt-6">
                  <p className="text-[42px] font-extrabold leading-none tracking-tight text-[#17223f]">
                    {value}
                  </p>

                  <p className="mt-3 text-[18px] font-bold text-[#263453]">
                    {label}
                  </p>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#b99645] to-[#e0bf68] transition-transform duration-300 group-hover:scale-x-100" />
            </div>
          ),
        )}
      </section>

      <div className="mt-6">
        <Card className="rounded-[28px] border border-[#ebe5d9] bg-[#fdfcf9] shadow-[0_14px_38px_rgba(25,38,70,0.08)]">
          <CardContent className="p-0">
            <div className="grid grid-cols-3 border-b border-[#ebe5d9] text-base font-extrabold text-[#6b7695]">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  className={cn(
                    "border-b-2 px-4 py-5 text-center transition-colors",
                    index === 0 ? "border-[#b99645] text-[#9b7525]" : "border-transparent hover:text-[#1d2859]",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-[#e9e3d8] bg-white px-4 py-3 text-[#7b86a7]">
                  <Search className="h-5 w-5 shrink-0" />
                  <span className="truncate text-base font-semibold">Search by name or request type...</span>
                </div>

                <div className="relative self-start">
                  <button
                    aria-expanded={isTypeMenuOpen}
                    aria-haspopup="listbox"
                    className="flex h-full min-h-[50px] min-w-[164px] items-center justify-between gap-5 rounded-2xl border border-[#e9e3d8] bg-white px-4 text-base font-semibold text-[#56617d] transition-colors hover:border-[#d7c391]"
                    onClick={() => setIsTypeMenuOpen((isOpen) => !isOpen)}
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
                            "flex w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors",
                            selectedType === type
                              ? "bg-[#f7efd9] text-[#9b7525]"
                              : "text-[#56617d] hover:bg-[#faf8f3]",
                          )}
                          onClick={() => {
                            setSelectedType(type);
                            setIsTypeMenuOpen(false);
                          }}
                          role="option"
                          type="button"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-6 overflow-x-auto border border-[#ebe5d9]">
                <div className="hidden min-w-[860px] grid-cols-[1.5fr_1fr_1fr_200px] items-center gap-6 border-b border-[#eee9df] bg-[#faf8f3] px-7 py-4 text-[14px] font-extrabold uppercase tracking-[0.06em] text-[#7b8499] lg:grid">
                  <p>Request</p>
                  <p>Type</p>
                  <p>Requested On</p>
                  <p className="text-right">Actions</p>
                </div>

                <div className="min-w-[860px] divide-y divide-[#f0ece4] bg-white">
                  {filteredRequests.map((request) => {
                    const key = requestKey(request);

                    return (
                    <div
                      key={key}
                      className="group grid grid-cols-[1.5fr_1fr_1fr_200px] items-center gap-6 px-7 py-5 transition-all duration-200 hover:bg-[#fcfaf6]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[17px] font-extrabold text-[#1d2859]">{request.name}</p>
                      </div>

                      <div>
                        <Badge variant={request.typeVariant} className="rounded-full px-3 py-1 text-sm">
                          {request.type}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-base font-semibold text-[#56617d]">{request.requestedOn}</p>
                        <p className="mt-1 text-[15px] font-medium text-[#8a93a7]">{request.requestedAt}</p>
                      </div>

                      <div className="flex items-center justify-end gap-2 text-[#7d86a7]">
                        <button
                          className="flex h-9 items-center gap-1.5 rounded-[10px] bg-[#d4ab4f] px-3 text-sm font-bold text-white transition-colors hover:bg-[#c49b3f]"
                          onClick={() => openRequestDialog(request, "accept")}
                          type="button"
                        >
                          <Check className="h-4 w-4" />
                          Accept
                        </button>
                        <button
                          className="flex h-9 items-center gap-1.5 rounded-[10px] border border-[#e67670] bg-white px-3 text-sm font-bold text-[#cf4f48] transition-colors hover:bg-[#fff4f3]"
                          onClick={() => openRequestDialog(request, "decline")}
                          type="button"
                        >
                          <X className="h-4 w-4" />
                          Decline
                        </button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 text-sm font-semibold text-[#4c5678] sm:flex-row sm:items-center sm:justify-between">
                <p>Showing 1 to 8 of 14 requests</p>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9e3d8] bg-white text-[#7d86a7]"
                    type="button"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b99645] text-sm font-bold text-white" type="button">
                    1
                  </button>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9e3d8] bg-white text-sm font-bold text-[#4c5678]"
                    type="button"
                  >
                    2
                  </button>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9e3d8] bg-white text-[#4c5678]"
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
            className="relative z-10 w-full max-w-[440px] rounded-[22px] border border-[#eee4d4] bg-white p-6 shadow-[0_24px_64px_rgba(23,34,63,0.22)]"
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="request-dialog-title" className="text-xl font-extrabold text-[#1d2b51]">
                  {dialogMode === "accept"
                    ? "Accept Request"
                    : "Decline Request"}
                </h2>
                <p className="mt-2 text-sm font-medium text-[#6d7892]">
                  Request from <span className="font-extrabold text-[#1d2b51]">{selectedRequest.name}</span>
                </p>
              </div>

              <button
                aria-label="Close request dialog"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#71809b] transition-colors hover:bg-[#f7f3eb]"
                onClick={closeRequestDialog}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mt-5 block text-sm font-bold text-[#33415f]">
              Response note <span className="font-medium text-[#7d89a3]">(optional)</span>
              <textarea
                className="mt-2 min-h-[110px] w-full resize-none rounded-[12px] border border-[#e4e0d8] px-4 py-3 text-sm font-medium text-[#253252] outline-none focus:border-[#c5a860] focus:ring-4 focus:ring-[#d7b04d]/10"
                onChange={(event) => setResponseNote(event.target.value)}
                placeholder="Add a message or instructions for the spiritual child..."
                value={responseNote}
              />
            </label>

            <div className="mt-5 flex gap-3">
              <button
                className="h-11 flex-1 rounded-[12px] border border-[#ded8cd] bg-white px-4 text-sm font-bold text-[#56627c] hover:bg-[#faf8f4]"
                onClick={closeRequestDialog}
                type="button"
              >
                Cancel
              </button>
              {dialogMode !== "decline" ? (
                <button
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[12px] bg-[#d4ab4f] px-4 text-sm font-bold text-white hover:bg-[#c49b3f]"
                  onClick={completeRequestAction}
                  type="button"
                >
                  <Check className="h-4 w-4" />
                  Accept Request
                </button>
              ) : (
                <button
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[12px] bg-[#d55750] px-4 text-sm font-bold text-white hover:bg-[#bf463f]"
                  onClick={completeRequestAction}
                  type="button"
                >
                  <X className="h-4 w-4" />
                  Decline Request
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}

    </>
  );
}
