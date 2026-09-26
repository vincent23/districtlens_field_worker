
/* -----------------------------
   TYPES
----------------------------- */

export type Status =
  | "Assigned"
  | "Active"
  | "Monitoring"
  | "Ongoing"
  | "Resolved";

export type StatusHistory = {
  status: string;
  time: string;
  comment: string;
};

export type Page = "home" | "tasks" | "notifications" | "team" | "history";

export type Task = {
  id: string;
  type: string;
  location: string;
  status: Status;
  AssignedStatus: Status;
  etr: string;
  time: string;
  team: string;
  fieldAction: boolean;
  remarks?: string;
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  status: Status;
  incidentId: string;
  time: string;
  read: boolean;
};

export type TeamMember = {
  name: string;
  role: string;
  initials: string;
  online: boolean;
};

export type HistoryLog = {
  id: string;
  incidentId: string;
  action: string;
  AssignedStatus: Status;
  time: string;
  remarks?: string;
  read: boolean;
};

/* -----------------------------
   SAMPLE DATA
----------------------------- */

export const initialTasks: Task[] = [
  {
    id: "INC-001",
    type: "Water Line Rupture",
    location: "Brgy. San Roque",
    status: "Active",
    AssignedStatus: "Assigned",
    etr: "2:30 PM",
    time: "10:30 AM",
    team: "Team Alpha",
    fieldAction: true,
  },
  {
    id: "INC-002",
    type: "Water Line Rupture",
    location: "Brgy. San Agustin",
    status: "Monitoring",
    AssignedStatus: "Assigned",
    etr: "4:00 PM",
    time: "11:15 AM",
    team: "Team Alpha",
    fieldAction: true,
  },
  {
    id: "INC-003",
    type: "Water Line Rupture",
    location: "Brgy. Daang Amaya",
    status: "Monitoring",
    AssignedStatus: "Assigned",
    etr: "5:30 PM",
    time: "12:00 PM",
    team: "Team Alpha",
    fieldAction: true,
  },
  {
    id: "INC-004",
    type: "Water Line Rupture",
    location: "Brgy. Capipisa",
    status: "Active",
    AssignedStatus: "Resolved",
    etr: "Completed",
    time: "9:30 AM",
    team: "Team Alpha",
    fieldAction: true,
  },
];

export const initialNotifications: Notification[] = [
  {
    id: "N-001",
    title: "New incident assigned",
    description: "A new incident has been assigned to your team.",
    status: "Active",
    incidentId: "INC-001",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: "N-002",
    title: "Status changed to Monitoring",
    description: "INC-002 is now being monitored.",
    status: "Monitoring",
    incidentId: "INC-002",
    time: "25 minutes ago",
    read: false,
  },
  {
    id: "N-003",
    title: "Incident resolved",
    description: "INC-004 has been marked as resolved.",
    status: "Resolved",
    incidentId: "INC-004",
    time: "1 hour ago",
    read: true,
  },
  {
    id: "N-004",
    title: "Reminder",
    description: "Please check the current status of INC-003.",
    status: "Monitoring",
    incidentId: "INC-003",
    time: "2 hours ago",
    read: true,
  },
];

export const statusHistory: StatusHistory[] = [
  {
    status: "Assigned",
    time: "Sep 25, 2026, 12:25 AM",
    comment: "Assignment created",
  },
  {
    status: "Ongoing",
    time: "",
    comment: "Field worker started task",
  },
  {
    status: "Resolved",
    time: "",
    comment: "Assignment completed",
  },
];

/* -----------------------------
   SHARED: ICON
----------------------------- */

export function Icon({
  name,
  className = "h-5 w-5",
}: {
  name:
    | "home"
    | "task"
    | "notification"
    | "users"
    | "search"
    | "arrow"
    | "history";
  className?: string;
}) {
  if (name === "home") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    );
  }

  if (name === "task") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="M12 11h4" />
        <path d="M12 16h4" />
        <path d="M8 11h.01" />
        <path d="M8 16h.01" />
      </svg>
    );
  }

  if (name === "notification") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </svg>
    );
  }

  if (name === "users") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M18 21a8 8 0 0 0-16 0" />
        <circle cx="10" cy="8" r="5" />
        <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
      </svg>
    );
  }

  if (name === "history") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
      </svg>
    );
  }

  if (name === "search") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={className}
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
    );
  }

  // "arrow"
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/* -----------------------------
   SHARED: STATUS BADGE
----------------------------- */

function statusClasses(status: Status) {
  switch (status) {
    case "Active":
      return "bg-red-50 text-red-700 ring-red-200";
    case "Monitoring":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "Assigned":
      return "bg-purple-50 text-purple-700 ring-purple-200";
    case "Ongoing":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "Resolved":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
}

function statusDot(status: Status) {
  switch (status) {
    case "Active":
      return "bg-red-500";
    case "Monitoring":
      return "bg-amber-500";
    case "Assigned":
      return "bg-purple-500";
    case "Ongoing":
      return "bg-blue-500";
    case "Resolved":
      return "bg-emerald-500";
  }
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${statusClasses(
        status
      )}`}
    >
      <span className={`h-2 w-2 rounded-full ${statusDot(status)}`} />
      {status}
    </span>
  );
}
