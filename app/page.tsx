"use client";

// #region VARIABLES
import { useMemo, useState } from "react";

type Status =
  | "Assigned"
  | "Active"
  | "Monitoring"
  | "Dispatched"
  | "Ongoing"
  | "Resolved";

type Page = "home" | "tasks" | "notifications" | "team";

type Task = {
  id: string;
  type: string;
  location: string;
  status: Status;
  etr: string;
  team: string;
  fieldAction: boolean;
  remarks?: string;
};

type Notification = {
  id: string;
  title: string;
  description: string;
  status: Status;
  incidentId: string;
  time: string;
  read: boolean;
};

type TeamMember = {
  name: string;
  role: string;
  initials: string;
  online: boolean;
};

// #endregion

// #region DATABASE
/* -----------------------------
   SAMPLE DATA
----------------------------- */

const initialTasks: Task[] = [
  {
    id: "INC-001",
    type: "Water Line Rupture",
    location: "Brgy. San Roque",
    status: "Active",
    etr: "2:30 PM",
    team: "Team Alpha",
    fieldAction: true,
  },
  {
    id: "INC-002",
    type: "Water Line Rupture",
    location: "Brgy. San Agustin",
    status: "Monitoring",
    etr: "4:00 PM",
    team: "Team Alpha",
    fieldAction: true,
  },
  {
    id: "INC-003",
    type: "Water Line Rupture",
    location: "Brgy. Daang Amaya",
    status: "Monitoring",
    etr: "5:30 PM",
    team: "Team Alpha",
    fieldAction: true,
  },
  {
    id: "INC-004",
    type: "Water Line Rupture",
    location: "Brgy. Capipisa",
    status: "Resolved",
    etr: "Completed",
    team: "Team Alpha",
    fieldAction: true,
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

const teamMembers: TeamMember[] = [
  {
    name: "Marco Villanueva",
    role: "Team Leader",
    initials: "MV",
    online: true,
  },
  {
    name: "Angelica Reyes",
    role: "Field Technician",
    initials: "AR",
    online: true,
  },
  {
    name: "Julius Santos",
    role: "Field Technician",
    initials: "JS",
    online: false,
  },
  {
    name: "Bea Fernandez",
    role: "Dispatch Coordinator",
    initials: "BF",
    online: true,
  },
];

// #endregion 

/* -----------------------------
   HELPERS
----------------------------- */

function statusClasses(status: Status) {
  switch (status) {
    case "Active":
      return "bg-red-50 text-red-700 ring-red-200";

    case "Monitoring":
      return "bg-amber-50 text-amber-700 ring-amber-200";

    case "Dispatched":
      return "bg-blue-50 text-blue-700 ring-blue-200";

    case "Ongoing":
      return "bg-indigo-50 text-indigo-700 ring-indigo-200";

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

    case "Dispatched":
      return "bg-blue-500";

    case "Ongoing":
      return "bg-indigo-500";

    case "Resolved":
      return "bg-emerald-500";
  }
}

function StatusBadge({ status }: { status: Status }) {
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

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: "home" | "task" | "notification" | "users" | "search" | "arrow";
  className?: string;
}) {
  if (name === "home") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={className}
      >
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9" />
        <path d="M9 20v-6h6v6" />
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
        className={className}
      >
        <path d="M9 11h8" />
        <path d="M9 15h8" />
        <path d="M9 7h8" />
        <path d="M5 7h.01" />
        <path d="M5 11h.01" />
        <path d="M5 15h.01" />
        <rect x="3" y="3" width="18" height="18" rx="3" />
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
        className={className}
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
   MAIN PAGE
----------------------------- */

export default function Home() {
  const [page, setPage] = useState<Page>("home");

  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [search, setSearch] = useState("");

  const [taskFilter, setTaskFilter] = useState("All");

  const [newStatus, setNewStatus] = useState<Status>("Active");

  const [remarks, setRemarks] = useState("");

  const [message, setMessage] = useState("");

  /* -----------------------------
     COUNTS
  ----------------------------- */

  const myTasks = useMemo(
    () => tasks.filter((task) => task.status !== "Resolved"),
    [tasks]
  );

  const activeTasks = useMemo(
    () => tasks.filter((task) => task.status === "Active"),
    [tasks]
  );

  const monitoringTasks = useMemo(
    () => tasks.filter((task) => task.status === "Monitoring"),
    [tasks]
  );

  const resolvedTasks = useMemo(
    () => tasks.filter((task) => task.status === "Resolved"),
    [tasks]
  );

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read
  ).length;

  /* -----------------------------
     FILTER TASKS
  ----------------------------- */

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.id.toLowerCase().includes(search.toLowerCase()) ||
        task.location.toLowerCase().includes(search.toLowerCase()) ||
        task.type.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        taskFilter === "All" || task.status === taskFilter;

      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, taskFilter]);

  /* -----------------------------
     OPEN TASK
  ----------------------------- */

  function openTask(task: Task) {
    setSelectedTask(task);
    setNewStatus(task.status);
    setRemarks(task.remarks || "");
    setMessage("");
  }

  /* -----------------------------
     UPDATE TASK
  ----------------------------- */

  function updateTask() {
    if (!selectedTask) return;

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === selectedTask.id
          ? {
              ...task,
              status: newStatus,
              remarks,
            }
          : task
      )
    );

    setSelectedTask((current) =>
      current
        ? {
            ...current,
            status: newStatus,
            remarks,
          }
        : null
    );

    setNotifications((current) => [
      {
        id: `N-${Date.now()}`,
        title: `Status updated`,
        description: `${selectedTask.id} is now ${newStatus}.`,
        status: newStatus,
        incidentId: selectedTask.id,
        time: "Just now",
        read: false,
      },
      ...current,
    ]);

    setMessage(`${selectedTask.id} successfully updated.`);
  }

  /* -----------------------------
     STATUS OPTIONS
  ----------------------------- */

  function getStatusOptions(status: Status): Status[] {
    switch (status) {
      case "Active":
        return ["Active", "Dispatched"];

      case "Dispatched":
        return ["Dispatched", "Ongoing"];

      case "Ongoing":
        return ["Ongoing", "Resolved"];

      case "Monitoring":
        return ["Monitoring", "Ongoing"];

      case "Resolved":
        return ["Resolved"];

      default:
        return [status];
    }
  }

  /* -----------------------------
     MARK NOTIFICATIONS READ
  ----------------------------- */

  function markNotificationsRead() {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  }

  /* -----------------------------
     DASHBOARD CARD
  ----------------------------- */

  function DashboardCard({
    title,
    count,
    description,
    background,
    onClick,
  }: {
    title: string;
    count: number;
    description: string;
    background: string;
    onClick: () => void;
  }) {
    return (
      <button
        onClick={onClick}
        className="group relative min-h-[180px] overflow-hidden rounded-2xl text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
        style={{
          backgroundImage: `url("${background}")`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/45 transition group-hover:bg-slate-950/35" />

        <div className="relative flex h-full flex-col justify-between p-5 text-white">
          <div>
            <p className="text-sm font-medium text-white/80">{title}</p>

            <p className="mt-2 text-4xl font-bold tracking-tight">{count}</p>

            <p className="mt-1 text-sm text-white/80">{description}</p>
          </div>

          <div className="flex items-center gap-1 text-sm font-semibold">
            View tasks
            <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </div>
      </button>
    );
  }

  /* -----------------------------
     HOME PAGE
  ----------------------------- */

  function renderHome() {
    return (
      <div className="space-y-7">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Field Worker Portal
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor and manage your assigned incidents.
            </p>
          </div>

          <button
            onClick={() => setPage("notifications")}
            className="relative flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
          >
            <Icon name="notification" className="h-5 w-5" />

            Notifications

            {unreadNotifications > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                {unreadNotifications}
              </span>
            )}
          </button>
        </div>

        {/* Dashboard Cards */}
        <section className="grid grid-cols-2 grid-rows-2 gap-5">
          <DashboardCard
            title="My Tasks"
            count={myTasks.length}
            description="All unresolved assignments"
            background="/Images/mytaskbg.jpg"
            onClick={() => {
              setTaskFilter("All");
              setPage("tasks");
            }}
          />

          <DashboardCard
            title="Active"
            count={activeTasks.length}
            description="Incidents requiring action"
            background="/Images/activebg.png"
            onClick={() => {
              setTaskFilter("Active");
              setPage("tasks");
            }}
          />

          <DashboardCard
            title="Monitoring"
            count={monitoringTasks.length}
            description="Incidents being monitored"
            background="/Images/monitoringbg.png"
            onClick={() => {
              setTaskFilter("Monitoring");
              setPage("tasks");
            }}
          />

          <DashboardCard
            title="Resolved"
            count={resolvedTasks.length}
            description="Completed incidents"
            background="/Images/resolvedbg.png"
            onClick={() => {
              setTaskFilter("Resolved");
              setPage("tasks");
            }}
          />
        </section>

        {/* Recent Tasks */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-900">Recent Tasks</h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest assigned incidents
              </p>
            </div>

            <button
              onClick={() => setPage("tasks")}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {myTasks.slice(0, 4).map((task) => (
              <button
                key={task.id}
                onClick={() => openTask(task)}
                className="flex w-full min-w-0 flex-col gap-3 p-4 text-left transition hover:bg-slate-50 sm:p-5 md:flex-row md:items-center md:justify-between"
              >
                {/* Task information */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700 sm:h-11 sm:w-11">
                    {task.id.replace("INC-", "")}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">
                      {task.type}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
                      {task.id} · {task.location}
                    </p>
                  </div>
                </div>

                {/* Task status information */}
                <div className="flex min-w-0 items-center justify-between gap-3 pl-[52px] sm:pl-[55px] md:shrink-0 md:justify-end md:pl-0">
                  
                  <div className="shrink-0 text-left md:text-right">
                    <p className="text-[10px] text-slate-400 sm:text-xs">
                      ETR
                    </p>

                    <p className="text-xs font-semibold text-slate-700 sm:text-sm">
                      {task.etr}
                    </p>
                  </div>

                  <StatusBadge status={task.status} />

                  <Icon
                    name="arrow"
                    className="hidden h-5 w-5 shrink-0 text-slate-400 md:block"
                  />
                </div>
              </button>
            ))}

            {myTasks.length === 0 && (
              <div className="p-10 text-center text-sm text-slate-500">
                No unresolved tasks.
              </div>
            )}
          </div>
        </section>

        {/* Team Task Table */}
        <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Header */}
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <h2 className="font-bold text-slate-900">
              Team Task Overview
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Current incident status assigned to Team Alpha
            </p>
          </div>


          {/* ================= MOBILE VIEW ================= */}
          <div className="divide-y divide-slate-100 md:hidden">

            {tasks.map((task) => (
              <div
                key={task.id}
                className="space-y-3 p-4"
              >

                {/* Incident + Status */}
                <div className="flex min-w-0 items-center justify-between gap-3">

                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {task.id}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {task.location}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <StatusBadge status={task.status} />
                  </div>

                </div>


                {/* Details */}
                <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">

                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">
                      ETR
                    </p>

                    <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                      {task.etr}
                    </p>
                  </div>


                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">
                      Team
                    </p>

                    <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                      {task.team}
                    </p>
                  </div>

                </div>

              </div>
            ))}

          </div>


          {/* ================= DESKTOP VIEW ================= */}
          <div className="hidden overflow-x-auto md:block">

            <table className="w-full text-left">

              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

                <tr>

                  <th className="px-5 py-4 font-semibold">
                    Incident
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Location
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    ETR
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Team
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {tasks.map((task) => (

                  <tr
                    key={task.id}
                    className="transition hover:bg-slate-50"
                  >

                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {task.id}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {task.location}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={task.status} />
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {task.etr}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {task.team}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>
      </div>
    );
  }

  /* -----------------------------
     TASK PAGE
  ----------------------------- */

  function renderTasks() {
    const filters = [
      "All",
      "Active",
      "Monitoring",
      "Dispatched",
      "Ongoing",
      "Resolved",
    ];

    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Field Worker Portal
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Tasks
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage your assigned incidents.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Icon
            name="search"
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search incident ID, location, or incident type..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Filters */}
        <div className="flex w-full min-w-0 flex-wrap gap-2">
            {filters.map((filter) => {
              const active = taskFilter === filter;

              return (
                <button
                  key={filter}
                  onClick={() => setTaskFilter(filter)}
                  className={`shrink-0 rounded-xl px-3 py-2 text-xs font-semibold transition sm:px-4 sm:py-2.5 sm:text-sm ${
                    active
                      ? "bg-[#0f2a5c] text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
                  }`}
                >
                  {filter}

                  <span
                    className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] sm:ml-2 sm:text-[11px] ${
                      active
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {filter === "All"
                      ? tasks.length
                      : tasks.filter((task) => task.status === filter).length}
                  </span>
                </button>
              );
            })}
          </div>

        {/* Task Cards */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => openTask(task)}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    {task.id}
                  </p>

                  <h2 className="mt-2 font-bold text-slate-900">
                    {task.type}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {task.location}
                  </p>
                </div>

                <StatusBadge status={task.status} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">Estimated Time</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {task.etr}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">Team</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {task.team}
                  </p>
                </div>
              </div>

              {task.remarks && (
                <div className="mt-3 rounded-xl bg-blue-50 p-3">
                  <p className="text-xs font-semibold text-blue-700">
                    Remarks
                  </p>

                  <p className="mt-1 text-sm text-blue-900">
                    {task.remarks}
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-end gap-1 text-sm font-semibold text-blue-600">
                View details
                <Icon
                  name="arrow"
                  className="h-4 w-4 transition group-hover:translate-x-1"
                />
              </div>
            </button>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="font-semibold text-slate-700">
              No tasks found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try another search term or filter.
            </p>
          </div>
        )}
      </div>
    );
  }

  /* -----------------------------
     TASK DETAILS
  ----------------------------- */

  function renderTaskDetails() {
    if (!selectedTask) return null;

    const statusSteps =
      selectedTask.status === "Monitoring"
        ? ["Assigned", "Dispatched", "Ongoing", "Resolved"]
        : ["Assigned", "Dispatched", "Ongoing", "Resolved"];

    const trackerStatus =
      selectedTask.status === "Active" ||
      selectedTask.status === "Monitoring"
        ? "Assigned"
        : selectedTask.status;

    const currentStep = statusSteps.indexOf(trackerStatus);

    const currentIndex =
      statusSteps.indexOf(selectedTask.status) >= 0
        ? statusSteps.indexOf(selectedTask.status)
        : selectedTask.status === "Monitoring"
        ? 0
        : 0;

    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <button
          onClick={() => setSelectedTask(null)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <span className="text-lg">←</span>
          Back to Tasks
        </button>

        {/* Header */}
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

            <StatusBadge status={selectedTask.status} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Estimated Time</p>
              <p className="mt-1 font-semibold text-slate-800">
                {selectedTask.etr}
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
          </div>
        </section>

        {/* Status Tracker */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">Status Tracker</h2>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute left-0 right-0 top-4 hidden h-0.5 bg-slate-200 sm:block" />

              <div className="relative grid grid-cols-4 gap-2">
                {statusSteps.map((step, index) => {
                  const completed = index <= currentIndex;

                  return (
                    <div
                      key={step}
                      className="flex flex-col items-center text-center"
                    >
                      <div
                        className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white text-xs font-bold shadow-sm ${
                          completed
                            ? "bg-[#0f2a5c] text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <p
                        className={`mt-2 text-xs font-semibold ${
                          completed
                            ? "text-[#0f2a5c]"
                            : "text-slate-400"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Update */}
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
                Status
              </label>

              <select
                value={newStatus}
                onChange={(event) =>
                  setNewStatus(event.target.value as Status)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              >
                {getStatusOptions(selectedTask.status).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

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

            <button
              onClick={updateTask}
              className="w-full rounded-xl bg-[#0f2a5c] px-5 py-3 font-semibold text-white transition hover:bg-[#163b7c] active:scale-[0.99]"
            >
              Save Update
            </button>

            {message && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                {message}
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  /* -----------------------------
     NOTIFICATIONS
  ----------------------------- */

  function renderNotifications() {
    return (
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Field Worker Portal
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Notifications
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Stay updated with your assigned incidents.
            </p>
          </div>

          <button
            onClick={markNotificationsRead}
            className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
          >
            Mark all as read
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => {
                const task = tasks.find(
                  (item) => item.id === notification.incidentId
                );

                if (task) {
                  openTask(task);
                }

                setNotifications((current) =>
                  current.map((item) =>
                    item.id === notification.id
                      ? { ...item, read: true }
                      : item
                  )
                );
              }}
              className={`w-full rounded-2xl border p-5 text-left transition hover:border-blue-200 hover:shadow-sm ${
                notification.read
                  ? "border-slate-200 bg-white"
                  : "border-blue-100 bg-blue-50/50"
              }`}
            >
              <div className="flex gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    notification.read
                      ? "bg-slate-100 text-slate-500"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <Icon name="notification" className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {notification.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {notification.description}
                      </p>
                    </div>

                    {!notification.read && (
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <StatusBadge status={notification.status} />

                    <span className="text-xs text-slate-400">
                      {notification.incidentId}
                    </span>

                    <span className="text-xs text-slate-400">
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* -----------------------------
     TEAM
  ----------------------------- */

  function renderTeam() {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Field Worker Portal
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Team Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View your assigned Team Alpha members.
          </p>
        </div>

        {/* Team Header */}
        <section className="overflow-hidden rounded-2xl bg-[#0f2a5c] p-6 text-white shadow-sm">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-blue-200">
                Current Team
              </p>

              <h2 className="mt-1 text-2xl font-bold">Team Alpha</h2>

              <p className="mt-1 text-sm text-blue-100">
                Field Operations Team
              </p>
            </div>

            <div className="rounded-xl bg-white/10 px-5 py-3">
              <p className="text-xs text-blue-200">Members</p>

              <p className="mt-1 text-2xl font-bold">
                {teamMembers.length}
              </p>
            </div>
          </div>
        </section>

        
      </div>
    );
  }

  /* -----------------------------
     PAGE CONTENT
  ----------------------------- */

  let content;

  if (selectedTask) {
    content = renderTaskDetails();
  } else if (page === "home") {
    content = renderHome();
  } else if (page === "tasks") {
    content = renderTasks();
  } else if (page === "notifications") {
    content = renderNotifications();
  } else {
    content = renderTeam();
  }

  /* -----------------------------
     MAIN LAYOUT
  ----------------------------- */

  return (
    <div className="min-h-screen bg-slate-50 pb-24 text-slate-900">
      {/* TOP BAR */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">

          {/* Logo / Brand */}
          <button
            onClick={() => {
              setSelectedTask(null);
              setPage("home");
            }}
            className="flex min-w-0 items-center gap-2 sm:gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0f2a5c] text-base font-black text-white sm:h-10 sm:w-10 sm:text-lg">
              💧
            </div>

            <div className="min-w-0 text-left">
              <p className="whitespace-nowrap text-sm font-bold text-[#0f2a5c] sm:text-base">
                DistrictLens
              </p>

              <p className="text-[11px] text-slate-400">
                Field Worker Portal
              </p>
            </div>
          </button>

          {/* Right side */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">

            <button
              onClick={() => setPage("notifications")}
              className="relative rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#0f2a5c] sm:p-2.5"
            >
              <Icon name="notification" className="h-5 w-5" />

              {unreadNotifications > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
              )}
            </button>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 sm:h-10 sm:w-10 sm:text-sm">
              TA
            </div>

          </div>

        </div>
      </header>

      {/* CONTENT */}
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {content}
      </main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-safe backdrop-blur">
        <div className="mx-auto grid max-w-2xl grid-cols-4">
          <button
            onClick={() => {
              setSelectedTask(null);
              setPage("home");
            }}
            className={`flex flex-col items-center gap-1 py-3 text-xs font-semibold transition ${
              page === "home" && !selectedTask
                ? "text-[#0f2a5c]"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Icon name="home" className="h-5 w-5" />
            Home
          </button>

          <button
            onClick={() => {
              setSelectedTask(null);
              setPage("tasks");
            }}
            className={`flex flex-col items-center gap-1 py-3 text-xs font-semibold transition ${
              page === "tasks" && !selectedTask
                ? "text-[#0f2a5c]"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Icon name="task" className="h-5 w-5" />
            Tasks
          </button>

          <button
            onClick={() => {
              setSelectedTask(null);
              setPage("notifications");
              markNotificationsRead();
            }}
            className={`relative flex flex-col items-center gap-1 py-3 text-xs font-semibold transition ${
              page === "notifications"
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

            Notifications
          </button>

          <button
            onClick={() => {
              setSelectedTask(null);
              setPage("team");
            }}
            className={`flex flex-col items-center gap-1 py-3 text-xs font-semibold transition ${
              page === "team"
                ? "text-[#0f2a5c]"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Icon name="users" className="h-5 w-5" />
            Team
          </button>
        </div>
      </nav>
    </div>
  );
}