export type ChildBadgeVariant =
  | "success"
  | "warning"
  | "neutral"
  | "violet";

export type SpiritualChild = {
  slug: string;
  initials: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  contact: string;
  guardian: string;
  group: string;
  groupVariant: ChildBadgeVariant;
  joinedOn: string;
  status: string;
  statusVariant: ChildBadgeVariant;
  avatarClassName: string;
  communionReady: boolean;
  repentance: {
    label: string;
    daysLeft: number;
    progress: number;
    note: string;
  };
  nextAppointment: {
    date: string;
    time: string;
    title: string;
    note: string;
  };
  appointments: Array<{
    title: string;
    date: string;
    time: string;
    note: string;
  }>;
  repentanceSteps: Array<{
    title: string;
    complete: boolean;
    note: string;
  }>;
  attendance: {
    rate: string;
    lastSeen: string;
    note: string;
  };
};

export const spiritualChildren: SpiritualChild[] = [
  {
    slug: "mekdes-assefa",
    initials: "MA",
    name: "Mekdes Assefa",
    age: 22,
    gender: "Female",
    contact: "0912 345 678",
    guardian: "Assefa Alemu",
    group: "Young Adults",
    groupVariant: "violet",
    joinedOn: "May 18, 2023",
    status: "Active",
    statusVariant: "success",
    avatarClassName: "bg-[#f4ebff] text-[#8e59ff]",
    communionReady: true,
    repentance: {
      label: "In Repentance",
      daysLeft: 9,
      progress: 72,
      note: "Continuing weekly spiritual reflection sessions.",
    },
    nextAppointment: {
      date: "July 12, 2026",
      time: "10:30 AM",
      title: "Spiritual Counseling",
      note: "Prayer and one-on-one guidance after service.",
    },
    appointments: [
      {
        title: "Spiritual Counseling",
        date: "July 12, 2026",
        time: "10:30 AM",
        note: "Prayer and one-on-one guidance after service.",
      },
      {
        title: "Bible Study Follow-up",
        date: "July 19, 2026",
        time: "2:00 PM",
        note: "Discuss scripture notes and prayer routine.",
      },
    ],
    repentanceSteps: [
      {
        title: "Initial confession received",
        complete: true,
        note: "Completed with guidance from Fr. Surafel.",
      },
      {
        title: "Weekly prayer practice",
        complete: true,
        note: "Maintaining daily morning prayers.",
      },
      {
        title: "Final follow-up session",
        complete: false,
        note: "Scheduled after current reflection period ends.",
      },
    ],
    attendance: {
      rate: "92%",
      lastSeen: "Sunday Liturgy, July 6, 2026",
      note: "Consistent weekly attendance with young adult fellowship.",
    },
  },
  {
    slug: "daniel-gebre",
    initials: "DG",
    name: "Daniel Gebre",
    age: 19,
    gender: "Male",
    contact: "0921 234 567",
    guardian: "Gebre Tesfaye",
    group: "Teens",
    groupVariant: "success",
    joinedOn: "Apr 10, 2023",
    status: "Active",
    statusVariant: "success",
    avatarClassName: "bg-[#e8fff2] text-[#2eaf67]",
    communionReady: true,
    repentance: {
      label: "Spiritually Stable",
      daysLeft: 0,
      progress: 100,
      note: "No active repentance cycle at the moment.",
    },
    nextAppointment: {
      date: "July 15, 2026",
      time: "1:00 PM",
      title: "Youth Mentorship",
      note: "Review service participation and summer plans.",
    },
    appointments: [
      {
        title: "Youth Mentorship",
        date: "July 15, 2026",
        time: "1:00 PM",
        note: "Review service participation and summer plans.",
      },
      {
        title: "Choir Practice Check-in",
        date: "July 22, 2026",
        time: "11:00 AM",
        note: "Encouragement and attendance follow-up.",
      },
    ],
    repentanceSteps: [
      {
        title: "Monthly spiritual review",
        complete: true,
        note: "Completed successfully.",
      },
      {
        title: "Prayer journal habit",
        complete: true,
        note: "Maintained regularly.",
      },
      {
        title: "Guidance session",
        complete: true,
        note: "No pending concerns.",
      },
    ],
    attendance: {
      rate: "95%",
      lastSeen: "Youth Gathering, July 7, 2026",
      note: "Strong participation in choir and mentoring sessions.",
    },
  },
  {
    slug: "hanna-tesfaye",
    initials: "HT",
    name: "Hanna Tesfaye",
    age: 24,
    gender: "Female",
    contact: "0933 456 789",
    guardian: "Tesfaye Abate",
    group: "Young Adults",
    groupVariant: "violet",
    joinedOn: "Mar 22, 2023",
    status: "Needs Follow-up",
    statusVariant: "warning",
    avatarClassName: "bg-[#ffe9f0] text-[#ef476f]",
    communionReady: false,
    repentance: {
      label: "In Repentance",
      daysLeft: 12,
      progress: 60,
      note: "Following a guided reflection and fasting schedule.",
    },
    nextAppointment: {
      date: "July 10, 2026",
      time: "2:00 PM",
      title: "Reflection",
      note: "Follow-up on repentance progress.",
    },
    appointments: [
      {
        title: "Reflection",
        date: "July 10, 2026",
        time: "2:00 PM",
        note: "Follow-up on repentance progress.",
      },
      {
        title: "Prayer Support Session",
        date: "July 18, 2026",
        time: "9:30 AM",
        note: "Discuss prayer discipline and accountability.",
      },
    ],
    repentanceSteps: [
      {
        title: "Initial meeting",
        complete: true,
        note: "Discussed spiritual goals and areas of struggle.",
      },
      {
        title: "Prayer and fasting period",
        complete: false,
        note: "12 days remaining in current repentance cycle.",
      },
      {
        title: "Holy Communion preparation",
        complete: false,
        note: "Pending successful completion of reflection period.",
      },
    ],
    attendance: {
      rate: "78%",
      lastSeen: "Evening Prayer, July 3, 2026",
      note: "Needs a little more consistency in weekday gatherings.",
    },
  },
  {
    slug: "yonas-berhe",
    initials: "YB",
    name: "Yonas Berhe",
    age: 17,
    gender: "Male",
    contact: "0918 765 432",
    guardian: "Berhe Desta",
    group: "Teens",
    groupVariant: "success",
    joinedOn: "Feb 15, 2023",
    status: "Active",
    statusVariant: "success",
    avatarClassName: "bg-[#eaf1ff] text-[#4676ff]",
    communionReady: true,
    repentance: {
      label: "On Track",
      daysLeft: 4,
      progress: 84,
      note: "Completing final follow-up tasks this week.",
    },
    nextAppointment: {
      date: "July 11, 2026",
      time: "11:15 AM",
      title: "Teen Fellowship Check-in",
      note: "Review scripture memory and attendance.",
    },
    appointments: [
      {
        title: "Teen Fellowship Check-in",
        date: "July 11, 2026",
        time: "11:15 AM",
        note: "Review scripture memory and attendance.",
      },
    ],
    repentanceSteps: [
      {
        title: "Prayer assignment",
        complete: true,
        note: "Completed and reviewed.",
      },
      {
        title: "Reflection notes",
        complete: true,
        note: "Shared with mentor.",
      },
      {
        title: "Final blessing",
        complete: false,
        note: "Expected next Sunday.",
      },
    ],
    attendance: {
      rate: "88%",
      lastSeen: "Sunday School, July 6, 2026",
      note: "Very engaged during teen group discussions.",
    },
  },
  {
    slug: "rachel-michael",
    initials: "RM",
    name: "Rachel Michael",
    age: 21,
    gender: "Female",
    contact: "0924 567 890",
    guardian: "Michael Hailu",
    group: "Young Adults",
    groupVariant: "violet",
    joinedOn: "Jan 30, 2023",
    status: "Active",
    statusVariant: "success",
    avatarClassName: "bg-[#f3ebff] text-[#8c5bff]",
    communionReady: true,
    repentance: {
      label: "Spiritually Stable",
      daysLeft: 0,
      progress: 100,
      note: "No active repentance steps needed right now.",
    },
    nextAppointment: {
      date: "July 16, 2026",
      time: "3:00 PM",
      title: "Service Planning",
      note: "Coordinate young adult volunteering schedule.",
    },
    appointments: [
      {
        title: "Service Planning",
        date: "July 16, 2026",
        time: "3:00 PM",
        note: "Coordinate young adult volunteering schedule.",
      },
    ],
    repentanceSteps: [
      {
        title: "Monthly accountability check",
        complete: true,
        note: "Positive progress maintained.",
      },
    ],
    attendance: {
      rate: "97%",
      lastSeen: "Choir Rehearsal, July 8, 2026",
      note: "Reliable and active in parish service.",
    },
  },
  {
    slug: "samuel-bekele",
    initials: "SB",
    name: "Samuel Bekele",
    age: 20,
    gender: "Male",
    contact: "0911 223 344",
    guardian: "Bekele Desta",
    group: "Young Adults",
    groupVariant: "violet",
    joinedOn: "Dec 12, 2022",
    status: "Needs Follow-up",
    statusVariant: "warning",
    avatarClassName: "bg-[#fff2da] text-[#f59e0b]",
    communionReady: false,
    repentance: {
      label: "In Repentance",
      daysLeft: 15,
      progress: 45,
      note: "Needs regular encouragement and check-ins.",
    },
    nextAppointment: {
      date: "July 13, 2026",
      time: "4:30 PM",
      title: "Pastoral Follow-up",
      note: "Discuss consistency and support needs.",
    },
    appointments: [
      {
        title: "Pastoral Follow-up",
        date: "July 13, 2026",
        time: "4:30 PM",
        note: "Discuss consistency and support needs.",
      },
    ],
    repentanceSteps: [
      {
        title: "Confession meeting",
        complete: true,
        note: "Completed last week.",
      },
      {
        title: "Daily prayer check",
        complete: false,
        note: "Still building consistency.",
      },
      {
        title: "Communion readiness review",
        complete: false,
        note: "Pending end of repentance cycle.",
      },
    ],
    attendance: {
      rate: "69%",
      lastSeen: "Sunday Liturgy, June 29, 2026",
      note: "Missed recent gatherings and needs re-engagement.",
    },
  },
  {
    slug: "aster-tadesse",
    initials: "AT",
    name: "Aster Tadesse",
    age: 18,
    gender: "Female",
    contact: "0932 334 455",
    guardian: "Tadesse Abebe",
    group: "Teens",
    groupVariant: "success",
    joinedOn: "Nov 25, 2022",
    status: "Inactive",
    statusVariant: "neutral",
    avatarClassName: "bg-[#e9fff7] text-[#31a97f]",
    communionReady: false,
    repentance: {
      label: "Needs Reconnection",
      daysLeft: 21,
      progress: 28,
      note: "Focus is on rebuilding regular fellowship rhythm.",
    },
    nextAppointment: {
      date: "July 17, 2026",
      time: "12:30 PM",
      title: "Reconnect Meeting",
      note: "Meet with guardian and discuss support plan.",
    },
    appointments: [
      {
        title: "Reconnect Meeting",
        date: "July 17, 2026",
        time: "12:30 PM",
        note: "Meet with guardian and discuss support plan.",
      },
    ],
    repentanceSteps: [
      {
        title: "Initial outreach",
        complete: true,
        note: "Guardian contacted successfully.",
      },
      {
        title: "Attendance restart plan",
        complete: false,
        note: "Needs agreement on weekly goals.",
      },
    ],
    attendance: {
      rate: "41%",
      lastSeen: "Youth Gathering, June 15, 2026",
      note: "Currently inactive and needs careful follow-up.",
    },
  },
  {
    slug: "tigist-gebremedhin",
    initials: "TG",
    name: "Tigist Gebremedhin",
    age: 23,
    gender: "Female",
    contact: "0915 667 788",
    guardian: "Gebremedhin Asrat",
    group: "Young Adults",
    groupVariant: "violet",
    joinedOn: "Oct 18, 2022",
    status: "Active",
    statusVariant: "success",
    avatarClassName: "bg-[#ffe9f5] text-[#ef476f]",
    communionReady: true,
    repentance: {
      label: "On Track",
      daysLeft: 6,
      progress: 81,
      note: "Preparing for Holy Communion with mentor support.",
    },
    nextAppointment: {
      date: "July 14, 2026",
      time: "8:45 AM",
      title: "Communion Preparation",
      note: "Final guidance and prayer before communion.",
    },
    appointments: [
      {
        title: "Communion Preparation",
        date: "July 14, 2026",
        time: "8:45 AM",
        note: "Final guidance and prayer before communion.",
      },
    ],
    repentanceSteps: [
      {
        title: "Confession completed",
        complete: true,
        note: "Completed with sincerity and clarity.",
      },
      {
        title: "Reflection week",
        complete: true,
        note: "Stayed faithful to daily readings.",
      },
      {
        title: "Communion blessing",
        complete: false,
        note: "Expected this coming week.",
      },
    ],
    attendance: {
      rate: "90%",
      lastSeen: "Bible Study, July 8, 2026",
      note: "Steady participation and warm group leadership.",
    },
  },
];

export function getSpiritualChildBySlug(slug: string) {
  return spiritualChildren.find((child) => child.slug === slug);
}
