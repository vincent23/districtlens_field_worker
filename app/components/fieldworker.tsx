"use client";

import { createContext, useContext, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

//#region TYPES (mga variables na ginagamit sa buong app)

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

export type Report = {
  id: string;
  type: string;
  location: string;
  status: Status;
  AssignedStatus: Status;
  etr: string;
  time: string;
  team: string;
  fieldAction: boolean;
  description: string;
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

//#endregion

//#region SAMPLE DATA

export const initialTasks: Report[] = [
  {
    id: "INC-001",
    type: "Water Line Rupture",
    location: "Mulawin",
    status: "Active",
    AssignedStatus: "Assigned",
    etr: "2:30 PM",
    time: "10:30 AM",
    team: "Team Alpha",
    fieldAction: true,
    description: "Description for INC-001"
  },
  {
    id: "INC-002",
    type: "Water Line Rupture",
    location: "Bagtas",
    status: "Monitoring",
    AssignedStatus: "Assigned",
    etr: "4:00 PM",
    time: "11:15 AM",
    team: "Team Alpha",
    fieldAction: true,
    description: "Description for INC-002"
  },
  {
    id: "INC-003",
    type: "Water Line Rupture",
    location: "Julugan I",
    status: "Active",
    AssignedStatus: "Assigned",
    etr: "5:30 PM",
    time: "12:00 PM",
    team: "Team Alpha",
    fieldAction: true,
    description: ""
  },
  {
    id: "INC-004",
    type: "Water Line Rupture",
    location: "Amaya I",
    status: "Active",
    AssignedStatus: "Resolved",
    etr: "Completed",
    time: "9:30 AM",
    team: "Team Alpha",
    fieldAction: true,
    description: ""
  },
];

const initialNotifications: Notification[] = [
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
    id: "N-004",
    title: "Reminder",
    description: "Please check the current status of INC-003.",
    status: "Monitoring",
    incidentId: "INC-003",
    time: "2 hours ago",
    read: true,
  },
];

const statusHistory: StatusHistory[] = [
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

//#endregion

//#region SHARED: ICON

export function Icon({
  name,
  className = "h-5 w-5",
}: {
  name:
    | "home"
    | "task"
    | "map"
    | "notification"
    | "users"
    | "search"
    | "arrow"
    | "history"
    | "refresh"
    | "logout";
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


if (name === "map") {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M31 16.5C31 7.94 24.06 1 15.5 1S0 7.94 0 16.5 6.94 32 15.5 32C24.194 32 31 24.924 31 16.5Z"
        fill="#265AA5"
      />
      <path
        d="M29.621 17.644c-.399-.541-1.024-1.42-1.51-1.796-.782-.606-1.265-1.013-1.323-1.696-.092-1.078 1.34-2.135 2.301-2.662C29.668 13.054 30 14.737 30 16.5c0 .541-.035 1.073-.093 1.598-.117-.193-.239-.39-.286-.454ZM26.362 6.927c-1.078.091-2.552.127-2.931-.246-.599-.588-.681-1.814-.692-2.725 1.365.79 2.586 1.795 3.623 2.971ZM10.008 8.5c.204.639.833 1.031 1.403 1.308.587.286 1.434.733 2.093.49.386-.142.622-.556.89-.844.328-.352.678-.684 1.091-.935.334-.203.606-.309.854-.333.371.001 1.61.422 1.91.737-.016.01-1.21.771-1.444 1.525-.1.318-.102.629-.104.903-.008.95-.517 1.955-.996 2.753-.723 1.204-1.456 1.769-2.074 1.75-.992-.065-1.682.394-1.824 1.218-.102.584.006 1.233.251 1.769.269.587.81.951 1.384 1.201.702.306 1.41.573 2.152.768.708.187 1.589.418 2.397.195 1.117-.311 2.114.079 2.973.797.419.351.799.746 1.192 1.126.357.345.935.672 1.172 1.104.401.733.216 1.74-.132 2.458-.188.387-.312.782-.433 1.165-.175.554-.358 1.223-.709 1.761-1.89.963-4.014 1.524-6.266 1.568.001-.064.967-1.44.99-1.965.023-.57-.475-1.006-1.052-1.51-.618-.541-1.388-1.214-1.608-2.113-.122-.496-.086-1.017.141-1.477.193-.39.5-.576.766-.895.355-.427.148-1.245-.164-1.628-.597-.733-1.649-.717-2.501-.631-.915.092-1.843-.063-2.696-.401-1.475-.585-2.717-1.674-3.71-2.893-.167-.206-.329-.416-.482-.633-.512-.721-.08-1.878.337-2.998.493-1.321 1.106-2.965-.362-3.734-.944-.496-2.356.099-3.294.732 1.396-3.279 3.974-5.929 7.188-7.446 1.457.559 3.159 1.32 3.605 1.688-.214.316-.559.576-.842.827-.488.435-1.033.81-1.503 1.265-.418.399-.831.871-.664 1.392Z"
        
      />
      <path
        d="M15.871 30.839l7.168-7.171c-.052-.041-.095-.085-.147-.131-.173-.153-.362-.312-.626-.51l-5.571 5.571c.057.134.102.286.078.433-.063.386-.275.733-.314.812-.008.02-.588.979-.588.996ZM18.649 30.644c.699-.156 1.368-.357 2.025-.611l1.955-1.955c.049-.142.088-.277.134-.422.121-.383.245-.778.433-1.165.087-.18.178-.41.238-.631l-4.785 4.784ZM12.539 20.754c.169-.015.336-.027.489-.027.32 0 .595.042.848.105l.437-.437c-.345-.13-.671-.274-.985-.429l-.789.788ZM15.171 22.743c-.035.108-.224.382-.314.459-.034.029-.716.489-.808 1.455l3.585-3.584c-.45.058-.888-.003-1.321-.093l-1.138 1.138c.055.379.012.572-.004.625ZM11.727 9.925l-.237-.122-6.267 6.267c.005.296.089.543.249.769.05.071.108.149.168.229l6.81-6.81c-.274-.097-.528-.229-.723-.333ZM20.107 21.186l-5.37 5.367c.219.262.465.495.706.712l5.513-5.514c-.259-.221-.54-.414-.849-.565ZM29.384 17.323l.618-.618c.002-.074-.002-.131-.002-.205 0-.389-.012-.783-.043-1.164l-1.192 1.192c.219.264.429.537.619.795ZM9.749 3.544l-6.87 6.87c.608-.306 1.288-.518 1.893-.479l5.979-5.979c-.327-.14-.663-.279-1.002-.412ZM12.015 18.692c-.151-.385-.229-.799-.229-1.185l-2.634 2.634c.322.159.662.292 1.015.399l1.848-1.848ZM16.3 12.988l-2.877 2.881c.072-.001.132-.019.208-.014.618.019 1.352-.546 2.074-1.75.19-.317.436-.751.595-1.117ZM6.256 12.451l3.821-3.821c-.02-.046-.053-.081-.069-.13-.223-.693.544-1.352 1.568-2.14.16-.122.294-.224.37-.294l.265-.237c.267-.233.562-.493.734-.749-.097-.08-.256-.179-.445-.287l-6.241 6.241c.141.428.114.915-.003 1.417ZM17.979 8.728c-.272-.154-.662-.301-1.007-.407L6.838 18.455c.229.225.479.449.747.667L17.979 8.728ZM23.099 6.194c.086.181.191.348.332.486.087.086.23.148.4.196l1.24-1.24c-.251-.222-.513-.431-.779-.635l-1.193 1.193Z"
        
      />
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

  if (name === "refresh") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    );
  }

  if (name === "logout") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M12.9999 2C10.2385 2 7.99991 4.23858 7.99991 7C7.99991 7.55228 8.44762 8 8.99991 8C9.55219 8 9.99991 7.55228 9.99991 7C9.99991 5.34315 11.3431 4 12.9999 4H16.9999C18.6568 4 19.9999 5.34315 19.9999 7V17C19.9999 18.6569 18.6568 20 16.9999 20H12.9999C11.3431 20 9.99991 18.6569 9.99991 17C9.99991 16.4477 9.55219 16 8.99991 16C8.44762 16 7.99991 16.4477 7.99991 17C7.99991 19.7614 10.2385 22 12.9999 22H16.9999C19.7613 22 21.9999 19.7614 21.9999 17V7C21.9999 4.23858 19.7613 2 16.9999 2H12.9999Z"
          fill="currentColor"
        />
        <path
          d="M13.9999 11C14.5522 11 14.9999 11.4477 14.9999 12C14.9999 12.5523 14.5522 13 13.9999 13V11Z"
          fill="currentColor"
        />
        <path
          d="M5.71783 11C5.80685 10.8902 5.89214 10.7837 5.97282 10.682C6.21831 10.3723 6.42615 10.1004 6.57291 9.90549C6.64636 9.80795 6.70468 9.72946 6.74495 9.67492L6.79152 9.61162L6.804 9.59454L6.80842 9.58848C6.80846 9.58842 6.80892 9.58778 5.99991 9L6.80842 9.58848C7.13304 9.14167 7.0345 8.51561 6.58769 8.19098C6.14091 7.86637 5.51558 7.9654 5.19094 8.41215L5.18812 8.41602L5.17788 8.43002L5.13612 8.48679C5.09918 8.53682 5.04456 8.61033 4.97516 8.7025C4.83623 8.88702 4.63874 9.14542 4.40567 9.43937C3.93443 10.0337 3.33759 10.7481 2.7928 11.2929L2.08569 12L2.7928 12.7071C3.33759 13.2519 3.93443 13.9663 4.40567 14.5606C4.63874 14.8546 4.83623 15.113 4.97516 15.2975C5.04456 15.3897 5.09918 15.4632 5.13612 15.5132L5.17788 15.57L5.18812 15.584L5.19045 15.5872C5.51509 16.0339 6.14091 16.1336 6.58769 15.809C7.0345 15.4844 7.13355 14.859 6.80892 14.4122L5.99991 15C6.80892 14.4122 6.80897 14.4123 6.80892 14.4122L6.804 14.4055L6.79152 14.3884L6.74495 14.3251C6.70468 14.2705 6.64636 14.1921 6.57291 14.0945C6.42615 13.8996 6.21831 13.6277 5.97282 13.318C5.89214 13.2163 5.80685 13.1098 5.71783 13H13.9999V11H5.71783Z"
          fill="currentColor"
        />
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

//#endregion

//#region SHARED: STATUS BADGE

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

//#endregion

//#region SHARED STATE 
// (context) - pages read this with useFieldWorker()

type FieldWorkerContextValue = {
  tasks: Report[];
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
  notifMessage: string;
  setNotifMessage: Dispatch<SetStateAction<string>>;
  historyLogs: HistoryLog[];
  setHistoryLogs: Dispatch<SetStateAction<HistoryLog[]>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  taskFilter: string;
  setTaskFilter: Dispatch<SetStateAction<string>>;
  historySearch: string;
  setHistorySearch: Dispatch<SetStateAction<string>>;
  openTask: (task: Report) => void;
};

const FieldWorkerContext = createContext<FieldWorkerContextValue | null>(null);

export function useFieldWorker() {
  const value = useContext(FieldWorkerContext);
  if (!value) {
    throw new Error("useFieldWorker must be used inside <FieldWorkerShell />");
  }
  return value;
}

//#endregion

//#region APP SHELL 
// (top bar + task details + bottom nav)

export default function FieldWorkerShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  //#region STATE
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [tasks, setTasks] = useState<Report[]>(initialTasks);
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [selectedTask, setSelectedTask] = useState<Report | null>(null);
  const [search, setSearch] = useState("");
  const [taskFilter, setTaskFilter] = useState("All");
  const [newStatus, setNewStatus] = useState<Status>("Active");
  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([]);
  const [historySearch, setHistorySearch] = useState("");

  // Close the task details when the route changes (e.g. browser Back button).
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setSelectedTask(null);
  }

  //#endregion

  //#region COUNTS 
  // (used by the top bar and bottom nav badges)
  const unreadNotifications = notifications.filter(
    (notification) => !notification.read
  ).length;

  //#endregion

  //#region OPEN TASK 
  // (nagse-set ng selected task at nagre-reset ng status, remarks, at message)
  function openTask(task: Report) {
    setSelectedTask(task);
    setNewStatus(task.AssignedStatus);
    setRemarks(task.remarks || "");
    setMessage("");
  }

  //#endregion

  //#region UPDATE STATUS 
  // (nag-uupdate ng status at nag-a-add sa history log)
  const updateStatus = (id: string, updates: Partial<Report>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );

    setSelectedTask((current) =>
      current && current.id === id ? { ...current, ...updates } : current
    );

    if (updates.AssignedStatus) {
      const assignedStatus = updates.AssignedStatus;
      setHistoryLogs((current) => [
        {
          id: `H-${Date.now()}`,
          incidentId: id,
          action: "Assignment Status Updated",
          AssignedStatus: assignedStatus,
          time: new Date().toISOString(),
          remarks: remarks || "No remarks provided",
          read: false,
        },
        ...current,
      ]);
    }

    setMessage(`${id} successfully updated.`);
    setTimeout(() => setMessage(""), 5000);
  };

  //#endregion

  //#region STATUS OPTIONS 
  // (nagbibigay ng next status depende sa current status)
  const getNextStatus = (assignedStatus: Status): Status | null => {
    switch (assignedStatus) {
      case "Assigned":
        return "Ongoing";
      case "Ongoing":
        return "Resolved";
      case "Resolved":
        return null;
      default:
        return null;
    }
  };

  //#endregion

  //#region TASK DETAILS 
  //(nagpapakita ng task details kapag may selected task)
  function renderTaskDetails() {
    if (!selectedTask) return null;

    const statusSteps = ["Assigned", "Ongoing", "Resolved"];
    const trackerStatus = selectedTask.AssignedStatus;
    const currentIndex = statusSteps.indexOf(trackerStatus);
    const nextStatus = getNextStatus(selectedTask.AssignedStatus);
    const resolvedLog = historyLogs.find(
      (log) =>
        log.incidentId === selectedTask.id &&
        log.AssignedStatus === "Resolved"
    );

    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <button
          onClick={() => setSelectedTask(null)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <span className="text-lg">❮</span>
          Back
        </button>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {selectedTask.id}
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900">
                {selectedTask.type}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {selectedTask.location}
              </p>
            </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedTask.status} />
                <StatusBadge status={selectedTask.AssignedStatus} />
              </div>
            </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Status</p>
              <p className="mt-1 font-semibold text-slate-800">
                {selectedTask.status}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Estimated Time</p>
              <p className="mt-1 font-semibold text-slate-800">
                {selectedTask.AssignedStatus === "Resolved"
                  ? "Completed"
                  : selectedTask.etr}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Assigned Team</p>
              <p className="mt-1 font-semibold text-slate-800">
                {selectedTask.team}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Field Action</p>
              <p className="mt-1 font-semibold text-slate-800">
                {selectedTask.fieldAction ? "Required" : "Not Required"}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Description</p>
              <p className="text-sm font-semibold text-slate-800">
                {selectedTask.description || "No description provided."}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">Status Tracker</h2>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200" />

              <div className="relative space-y-7">
                {statusHistory.map((step: StatusHistory, index: number) => {
                  const completed = index <= currentIndex;
                  return (
                    <div key={step.status} className="relative flex gap-4">
                      <div
                        className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-white text-xs font-bold shadow-sm ${
                          completed
                            ? "bg-[#0f2a5c] text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <div className="min-w-0 pt-0.5">
                        <p
                          className={`text-sm font-semibold ${
                            completed ? "text-[#0f2a5c]" : "text-slate-400"
                          }`}
                        >
                          {step.status}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {step.time || "Waiting..."}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {step.comment}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

       {selectedTask.AssignedStatus === "Resolved" ? (

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-slate-900">Field Remarks</h2>
            <p className="mt-1 text-sm text-slate-500">
              Remarks recorded when the task was completed.
            </p>

        
            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="whitespace-pre-wrap text-sm text-slate-700">
                {resolvedLog?.remarks || selectedTask.remarks || "No remarks provided."}
              </p>
            </div>
    

          </section>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="font-bold text-slate-900">Update Task</h2>
              <p className="mt-1 text-sm text-slate-500">
                Update the current status and add field remarks.
              </p>
            </div>

        <div className="mt-5 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Remarks
            </label>

            <textarea
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              rows={5}
              placeholder="Enter field observations, actions taken, or other remarks..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {nextStatus && (
            <button
              onClick={async () => {
                setIsUpdating(true);

                await new Promise((resolve) => setTimeout(resolve, 300));

                await updateStatus(selectedTask.id, {
                  AssignedStatus: nextStatus,
                });

                setIsUpdating(false);
              }}
              disabled={isUpdating}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0f2a5c] px-5 py-3 font-semibold text-white transition hover:bg-[#163b7c] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isUpdating ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Updating...
                </>
              ) : (
                `Mark as ${nextStatus}`
              )}
            </button>
          )}

        </div>

          </section>
        )}

      {/* Message para malaman ng user na update na */}
            {message && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                {message}
              </div>
            )}

      </div>
    );
  }

  //#endregion

  //#region ACTIVE ROUTE (from usePathname)
  const isActiveRoute = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const homeActive = isActiveRoute("/") && !selectedTask;
  const tasksActive = isActiveRoute("/task") && !selectedTask;
  const notificationsActive = isActiveRoute("/notification");
  const teamActive = isActiveRoute("/team");
  const mapActive = isActiveRoute("/map");

  //#endregion

  //#region Refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
    const handleRefresh = () => {
      setIsRefreshing(true);
  
      setTimeout(() => {
        window.location.reload();
      }, 800);
    };
  //#endregion 

  //#region MAIN LAYOUT
  return (
    <FieldWorkerContext.Provider
      value={{
        tasks,
        notifications,
        setNotifications,
        notifMessage,
        setNotifMessage,
        historyLogs,
        setHistoryLogs,
        search,
        setSearch,
        taskFilter,
        setTaskFilter,
        historySearch,
        setHistorySearch,
        openTask,
      }}
    >
      <div className="min-h-screen bg-slate-50 pb-24 text-slate-900">
        {/* TOP BAR */}
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
          {/* Top Loading Spinner */}
          {isRefreshing && (
            <div className="fixed left-1/2 top-4 z-[9999] -translate-x-1/2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0f2a5c] bg-white shadow-md" />
            </div>
          )}
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
            <Link
              href="/"
              onClick={() => setSelectedTask(null)}
              className="flex min-w-0 items-center gap-2 sm:gap-3"
            >
              <img
                src="./Icons/tanza logo.webp"
                alt="Tanza Water District Logo"
                className="h-13 w-13 object-contain"
              />
              <div className="min-w-0 text-left">
                <p className="text-[11px] text-slate-400">
                  TANZA WATER DISTRICT
                </p>
                <p className="whitespace-nowrap text-sm font-bold text-[#0f2a5c] sm:text-base">
                  DistrictLens
                </p>
              </div>
            </Link>

            <div className="flex shrink-0 items-center gap-1 sm:gap-3">
              <button
              onClick={handleRefresh}
              className="relative rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#0f2a5c] sm:p-2.5"
              >
              <Icon name="refresh" className="h-4 w-4" />
              </button>

              <Link
                href="/team"
                onClick={() => setSelectedTask(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 sm:h-10 sm:w-10 sm:text-sm"
              >
                TA
              </Link>
            </div>
          </div>
        </header>

        {/* CONTENT: task details if a task is open, otherwise the current route's page */}
        <main
          className={
            mapActive && !selectedTask
              ? "mx-auto max-w-7xl" // the map page brings its own padding (same as the public map)
              : "mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
          }
        >
          {selectedTask ? renderTaskDetails() : children}
        </main>

        {/* BOTTOM NAV */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 pb-5 border-t border-slate-200 bg-white/95 px-2 pb-safe backdrop-blur">
          <div className="mx-auto grid max-w-2xl grid-cols-5">
            <Link
              href="/"
              onClick={() => setSelectedTask(null)}
              aria-current={homeActive ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-3 text-xs font-semibold cursor-pointer transition ${
                homeActive
                  ? "text-[#0f2a5c]"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon name="home" className="h-5 w-5" />
              Home
            </Link>

            <Link
              href="/task"
              onClick={() => setSelectedTask(null)}
              aria-current={tasksActive ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-3 text-xs font-semibold cursor-pointer transition ${
                tasksActive
                  ? "text-[#0f2a5c]"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon name="task" className="h-5 w-5" />
              Tasks
            </Link>

            {/* MAP */}
            <Link
              href="/map"
              onClick={() => {
                setSelectedTask(null);
              }}
              aria-current={mapActive ? "page" : undefined}
              aria-label="Map"
              className="flex flex-col items-center gap-1 py-3 text-xs font-semibold cursor-pointer transition"
            >
              <span className="flex h-8 w-13 items-center justify-center rounded-2xl bg-[#0f2a5c] shadow-md transition hover:bg-[#1765E8] active:scale-95">
                <Icon name="map" className="h-6 w-6 text-white" />
              </span>
            </Link>

            <Link
              href="/notification"
              onClick={() => setSelectedTask(null)}
              aria-current={notificationsActive ? "page" : undefined}
              className={`relative flex flex-col items-center gap-1 py-3 text-xs font-semibold cursor-pointer transition ${
                notificationsActive
                  ? "text-[#0f2a5c]"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <div className="relative">
                <Icon name="notification" className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                    {unreadNotifications}
                  </span>
                )}
              </div>
              Alerts
            </Link>
            
            <Link
              href="/team"
              onClick={() => setSelectedTask(null)}
              aria-current={teamActive ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-3 text-xs font-semibold cursor-pointer transition ${
                teamActive
                  ? "text-[#0f2a5c]"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon name="users" className="h-5 w-5" />
              Team
            </Link>
          </div>
        </nav>
      </div>
    </FieldWorkerContext.Provider>
  );
  //#endregion
}

//#endregion
