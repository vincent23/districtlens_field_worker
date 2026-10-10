"use client";

import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

//#region TYPES (mga variables na ginagamit sa buong app)

type Status =
  | "Assigned"
  | "Active"
  | "Monitoring"
  | "Ongoing"
  | "Resolved";

type StatusHistory = {
  status: string;
  time: string;
  comment: string;
};

type Page = "home" | "tasks" | "notifications" | "team" | "history";

type Task = {
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

type HistoryLog = {
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

const initialTasks: Task[] = [
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

function Icon({
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

//#endregion

//#region HOME PAGE

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
          <Icon
            name="arrow"
            className="h-4 w-4 transition group-hover:translate-x-1"
          />
        </div>
      </div>
    </button>
  );
}

function HomePage({
  myTasks,
  activeTasks,
  monitoringTasks,
  resolvedTasks,
  unreadHistoryCount,
  setPage,
  setHistoryLogs,
  setTaskFilter,
  openTask,
}: {
  myTasks: Task[];
  activeTasks: Task[];
  monitoringTasks: Task[];
  resolvedTasks: Task[];
  unreadHistoryCount: number;
  setPage: (page: Page) => void;
  setHistoryLogs: Dispatch<SetStateAction<HistoryLog[]>>;
  setTaskFilter: (filter: string) => void;
  openTask: (task: Task) => void;
}) {
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
          onClick={() => {
            setPage("history");
            setHistoryLogs((current) =>
              current.map((log) => ({ ...log, read: true }))
            );
          }}
          className="relative flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
        >
          <Icon name="history" className="h-5 w-5" />
          History Log
          {unreadHistoryCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
              {unreadHistoryCount}
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

              <div className="flex min-w-0 items-center justify-between gap-3 pl-[52px] sm:pl-[55px] md:shrink-0 md:justify-end md:pl-0">
                <div className="shrink-0 text-left md:text-right">
                  <p className="text-[10px] text-slate-400 sm:text-xs">
                    Uploaded
                  </p>
                  <p className="text-xs font-semibold text-slate-700 sm:text-sm">
                    {task.time}
                  </p>
                </div>
                <div className="shrink-0 text-left md:text-right">
                  <p className="text-[10px] text-slate-400 sm:text-xs">ETR</p>
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
    </div>
  );
}

//#endregion

//#region TASKS PAGE

function TasksPage({
  tasks,
  filteredTasks,
  search,
  setSearch,
  taskFilter,
  setTaskFilter,
  openTask,
}: {
  tasks: Task[];
  filteredTasks: Task[];
  search: string;
  setSearch: (value: string) => void;
  taskFilter: string;
  setTaskFilter: (value: string) => void;
  openTask: (task: Task) => void;
}) {
  const filters = ["All", "Active", "Monitoring", "Ongoing", "Resolved"];

  const filterCount = (filter: string) => {
    if (filter === "All") {
      return tasks.filter((task) => task.AssignedStatus !== "Resolved")
        .length;
    }
    if (filter === "Resolved") {
      return tasks.filter((task) => task.AssignedStatus === "Resolved")
        .length;
    }
    if (filter === "Assigned" || filter === "Ongoing") {
      return tasks.filter((task) => task.AssignedStatus === filter).length;
    }
    if (filter === "Active" || filter === "Monitoring") {
      return tasks.filter(
        (task) =>
          task.status === (filter as Status) &&
          task.AssignedStatus !== "Resolved"
      ).length;
    }
    return 0;
  };

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
                {filterCount(filter)}
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
                <h2 className="mt-2 font-bold text-slate-900">{task.type}</h2>
                <p className="mt-1 text-sm text-slate-500">{task.location}</p>
              </div>
              <div className="flex items-end gap-1">
                <StatusBadge status={task.AssignedStatus} />
                <StatusBadge status={task.status} />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Estimated Time</p>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {task.AssignedStatus === "Resolved"
                    ? "Completed"
                    : task.etr}
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
                <p className="text-xs font-semibold text-blue-700">Remarks</p>
                <p className="mt-1 text-sm text-blue-900">{task.remarks}</p>
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
          <p className="font-semibold text-slate-700">No tasks found</p>
          <p className="mt-1 text-sm text-slate-500">
            Try another search term or filter.
          </p>
        </div>
      )}
    </div>
  );
}

//#endregion

//#region NOTIFICATIONS PAGE

function NotificationsPage({
  tasks,
  notifications,
  setNotifications,
  notifMessage,
  markNotificationsRead,
  deleteReadNotifications,
  openTask,
}: {
  tasks: Task[];
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
  notifMessage: string;
  markNotificationsRead: () => void;
  deleteReadNotifications: () => void;
  openTask: (task: Task) => void;
}) {
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

        <div className="flex flex-wrap gap-2">
          <button
            onClick={markNotificationsRead}
            className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
          >
            Mark all as read
          </button>
          <button
            onClick={deleteReadNotifications}
            className="w-fit rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50"
          >
            Delete read
          </button>
        </div>
      </div>

      {notifMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
          {notifMessage}
        </div>
      )}

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <Icon
              name="notification"
              className="mx-auto h-10 w-10 text-slate-300"
            />
            <p className="mt-3 text-sm font-semibold text-slate-600">
              No notifications
            </p>
            <p className="mt-1 text-sm text-slate-400">
              You don't have any notifications yet.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
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
          ))
        )}
      </div>
    </div>
  );
}

//#endregion

//#region TEAM PAGE

function TeamPage({ setPage }: { setPage: (page: Page) => void }) {
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

      <section className="overflow-hidden rounded-2xl bg-[#0f2a5c] p-6 text-white shadow-sm">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-blue-200">Current Team</p>
            <h2 className="mt-1 text-2xl font-bold">Team Alpha</h2>
            <p className="mt-1 text-sm text-blue-100">Field Operations Team</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-1">
        <button className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600">
          <Icon name="task" className="h-5 w-5" />
          Change Password
        </button>

        <button
          onClick={() => setPage("history")}
          className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
        >
          <Icon name="history" className="h-5 w-5" />
          History Log
        </button>

        <button className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600">
          <span>↪</span>
          <span>Logout</span>
        </button>
      </section>
    </div>
  );
}

//#endregion

//#region HISTORY PAGE

function HistoryPage({
  tasks,
  filteredHistoryLogs,
  historySearch,
  setHistorySearch,
  formatTimeAgo,
  openTask,
}: {
  tasks: Task[];
  filteredHistoryLogs: HistoryLog[];
  historySearch: string;
  setHistorySearch: (value: string) => void;
  formatTimeAgo: (time: string) => string;
  openTask: (task: Task) => void;
}) {
  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">History Log</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track changes and actions made to incidents.
        </p>
      </div>

      <div className="relative">
        <Icon
          name="search"
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={historySearch}
          onChange={(e) => setHistorySearch(e.target.value)}
          placeholder="Search history..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {filteredHistoryLogs.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredHistoryLogs.map((log) => (
              <button
                key={log.id}
                onClick={() => {
                  const task = tasks.find((t) => t.id === log.incidentId);
                  if (task) {
                    openTask(task);
                  }
                }}
                className="w-full p-4 text-left transition hover:bg-slate-50 sm:p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {log.action}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Incident: {log.incidentId}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Remarks: {log.remarks}
                    </p>
                    <div className="mt-2">
                      <StatusBadge status={log.AssignedStatus} />
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs text-slate-400">
                      {formatTimeAgo(log.time)}
                    </span>
                    <Icon name="arrow" className="h-5 w-5 text-slate-400" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="font-semibold text-slate-700">No history found</p>
            <p className="mt-1 text-sm text-slate-400">
              Try searching for another incident or status.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

//#endregion

//#region MAIN APP

export default function FieldWorker() {
  //#region STATE
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
  const [notifMessage, setNotifMessage] = useState("");
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([]);
  const [historySearch, setHistorySearch] = useState("");

  //#endregion

  //#region COUNTS
  const myTasks = useMemo(
    () => tasks.filter((task) => task.AssignedStatus !== "Resolved"),
    [tasks]
  );

  const activeTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.status === "Active" && task.AssignedStatus !== "Resolved"
      ),
    [tasks]
  );

  const monitoringTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.status === "Monitoring" && task.AssignedStatus !== "Resolved"
      ),
    [tasks]
  );

  const resolvedTasks = useMemo(
    () => tasks.filter((task) => task.AssignedStatus === "Resolved"),
    [tasks]
  );

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read
  ).length;

  const unreadHistoryCount = historyLogs.filter((log) => !log.read).length;

  //#endregion

  //#region FILTER TASKS
  const filteredTasks = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    // SEARCH ALL TASKS
    // Ignore the selected filter when searching
    if (searchTerm) {
      return tasks.filter((task) => {
        return (
          task.id.toLowerCase().includes(searchTerm) ||
          task.location.toLowerCase().includes(searchTerm) ||
          task.type.toLowerCase().includes(searchTerm)
        );
      });
    }

    // NO SEARCH → USE FILTER
    return tasks.filter((task) => {
      if (taskFilter === "All") {
        // Show unresolved tasks
        return task.AssignedStatus !== "Resolved";
      }

      if (taskFilter === "Resolved") {
        // Show resolved field-worker assignments
        return task.AssignedStatus === "Resolved";
      }

      if (taskFilter === "Assigned" || taskFilter === "Ongoing") {
        // Use AssignedStatus
        return task.AssignedStatus === taskFilter;
      }

      if (taskFilter === "Active" || taskFilter === "Monitoring") {
        // The original status stays the same,
        // but it is hidden once resolved
        // and shown under the Resolved filter instead.
        return (
          task.status === taskFilter && task.AssignedStatus !== "Resolved"
        );
      }

      return false;
    });
  }, [tasks, search, taskFilter]);

  //#endregion

  //#region FILTER HISTORY LOGS
  const filteredHistoryLogs = historyLogs.filter((log) => {
    const term = historySearch.toLowerCase();

    return (
      log.incidentId.toLowerCase().includes(term) ||
      log.action.toLowerCase().includes(term) ||
      log.AssignedStatus.toLowerCase().includes(term)
    );
  });

  //#endregion

  //#region CALCULATE CURRENT TIME
  const formatTimeAgo = (time: string) => {
    const seconds = Math.floor((Date.now() - new Date(time).getTime()) / 1000);

    if (seconds < 5) return "Just now";
    if (seconds < 60) return `${seconds} seconds ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60)
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;

    const days = Math.floor(hours / 24);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  };

  //#endregion

  //#region OPEN TASK (nagse-set ng selected task at nagre-reset ng status, remarks, at message)
  function openTask(task: Task) {
    setSelectedTask(task);
    setNewStatus(task.AssignedStatus);
    setRemarks(task.remarks || "");
    setMessage("");
  }

  //#endregion

  //#region UPDATE STATUS (nag-uupdate ng status at nag-a-add sa history log)
  const updateStatus = (id: string, updates: Partial<Task>) => {
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

  //#region STATUS OPTIONS (nagbibigay ng next status depende sa current status)
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

  //#region NOTIFICATIONS (nagmamark ng read at nagde-delete ng read notifications)
  function markNotificationsRead() {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true }))
    );
  }

  function deleteReadNotifications() {
    setNotifications((current) =>
      current.filter((notification) => !notification.read)
    );

    setNotifMessage("Read notifications deleted successfully.");
    setTimeout(() => setNotifMessage(""), 5000);
  }
  

  //#endregion

  //#region TASK DETAILS (nagpapakita ng task details kapag may selected task)
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
          Back to Tasks
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
              onClick={() =>
                updateStatus(selectedTask.id, {
                  AssignedStatus: nextStatus,
                })
              }
              className="w-full cursor-pointer rounded-xl bg-[#0f2a5c] px-5 py-3 font-semibold text-white transition hover:bg-[#163b7c] active:scale-[0.99]"
            >
              Mark as {nextStatus}
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

  //#region PAGE CONTENT SWITCH
  let content;

  if (selectedTask) {
    content = renderTaskDetails();
  } else if (page === "home") {
    content = (
      <HomePage
        myTasks={myTasks}
        activeTasks={activeTasks}
        monitoringTasks={monitoringTasks}
        resolvedTasks={resolvedTasks}
        unreadHistoryCount={unreadHistoryCount}
        setPage={setPage}
        setHistoryLogs={setHistoryLogs}
        setTaskFilter={setTaskFilter}
        openTask={openTask}
      />
    );
  } else if (page === "tasks") {
    content = (
      <TasksPage
        tasks={tasks}
        filteredTasks={filteredTasks}
        search={search}
        setSearch={setSearch}
        taskFilter={taskFilter}
        setTaskFilter={setTaskFilter}
        openTask={openTask}
      />
    );
  } else if (page === "notifications") {
    content = (
      <NotificationsPage
        tasks={tasks}
        notifications={notifications}
        setNotifications={setNotifications}
        notifMessage={notifMessage}
        markNotificationsRead={markNotificationsRead}
        deleteReadNotifications={deleteReadNotifications}
        openTask={openTask}
      />
    );
  } else if (page === "history") {
    content = (
      <HistoryPage
        tasks={tasks}
        filteredHistoryLogs={filteredHistoryLogs}
        historySearch={historySearch}
        setHistorySearch={setHistorySearch}
        formatTimeAgo={formatTimeAgo}
        openTask={openTask}
      />
    );
  } else {
    content = <TeamPage setPage={setPage} />;
  }

  //#endregion

  //#region MAIN LAYOUT
  return (
    <div className="min-h-screen bg-slate-50 pb-24 text-slate-900">
      {/* TOP BAR */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
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
              <p className="text-[11px] text-slate-400">Field Worker Portal</p>
            </div>
          </button>

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
        <div className="mx-auto grid max-w-2xl grid-cols-5">
          <button
            onClick={() => {
              setSelectedTask(null);
              setPage("home");
            }}
            className={`flex flex-col items-center gap-1 py-3 text-xs font-semibold cursor-pointer transition ${
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
            className={`flex flex-col items-center gap-1 py-3 text-xs font-semibold cursor-pointer transition ${
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
            }}
            className="flex flex-col items-center gap-1 py-3 text-xs font-semibold cursor-pointer transition"
              
          >
            <span className="flex h-8 w-11 items-center justify-center rounded-2xl bg-[#2577FF] shadow-md transition hover:bg-[#1765E8] active:scale-95">
              <Icon name="map" className="h-6 w-6 text-white" />
            </span>
          </button>


          <button
            onClick={() => {
              setSelectedTask(null);
              setPage("notifications");
            }}
            className={`relative flex flex-col items-center gap-1 py-3 text-xs font-semibold cursor-pointer transition ${
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
            className={`flex flex-col items-center gap-1 py-3 text-xs font-semibold cursor-pointer transition ${
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
  //#endregion
}

//#endregion