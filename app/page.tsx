"use client";

import { useMemo, useState } from "react";
// mga types, data na kinuha sa database.tsx
import { 
  Status,
  Page,
  Task,
  Notification,
  HistoryLog,
  StatusHistory,
  initialTasks,
  initialNotifications,
  statusHistory,
  Icon,
  StatusBadge,
} from "./database";
import { HomePage } from "./HomePage";
import { TasksPage } from "./TasksPage";
import { NotificationsPage } from "./NotificationsPage";
import { TeamPage } from "./TeamPage";
import { HistoryPage } from "./HistoryPage";

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
  const [notifMessage, setNotifMessage] = useState("");
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([]);
  const [historySearch, setHistorySearch] = useState("");

  /* -----------------------------
     COUNTS
  ----------------------------- */
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

  /* -----------------------------
     FILTER TASKS
  ----------------------------- */
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

    if (
      taskFilter === "Assigned" ||
      taskFilter === "Ongoing"
    ) {
      // Use AssignedStatus
      return task.AssignedStatus === taskFilter;
    }

    if (
      taskFilter === "Active" ||
      taskFilter === "Monitoring"
    ) {
      // ang original status ay ganon parin,
      // pero itatago sya pag resolved na.
      // at ilalagay sa resolved filter
      return (
        task.status === taskFilter &&
        task.AssignedStatus !== "Resolved"
      );
    }

    return false;
  });
}, [tasks, search, taskFilter]);

  /* -----------------------------
     FILTER HISTORY LOGS
  ----------------------------- */
  const filteredHistoryLogs = historyLogs.filter((log) => {
    const term = historySearch.toLowerCase();

    return (
      log.incidentId.toLowerCase().includes(term) ||
      log.action.toLowerCase().includes(term) ||
      log.AssignedStatus.toLowerCase().includes(term)
    );
  });

  /* -----------------------------
     CALCULATE CURRENT TIME
  ----------------------------- */
  const formatTimeAgo = (time: string) => {
    const seconds = Math.floor((Date.now() - new Date(time).getTime()) / 1000);

    if (seconds < 5) return "Just now";
    if (seconds < 60) return `${seconds} seconds ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;

    const days = Math.floor(hours / 24);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  };

  /* -----------------------------
     OPEN TASK
  ----------------------------- */
  function openTask(task: Task) {
    setSelectedTask(task);
    setNewStatus(task.AssignedStatus);
    setRemarks(task.remarks || "");
    setMessage("");
  }

  /* -----------------------------
     UPDATE STATUS
  ----------------------------- */
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
  };

  /* -----------------------------
     STATUS OPTIONS
  ----------------------------- */
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

  /* -----------------------------
     NOTIFICATIONS
  ----------------------------- */
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

  /* -----------------------------
     TASK DETAILS lalabas pag may pinindot na task
  ----------------------------- */
  function renderTaskDetails() {
    if (!selectedTask) return null;

    const statusSteps = ["Assigned", "Ongoing", "Resolved"];
    const trackerStatus = selectedTask.AssignedStatus;
    const currentIndex = statusSteps.indexOf(trackerStatus);
    const nextStatus = getNextStatus(selectedTask.AssignedStatus);

    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <button
          onClick={() => setSelectedTask(null)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <span className="text-lg">←</span>
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
            <StatusBadge status={selectedTask.AssignedStatus} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Status</p>
              <p className="mt-1 font-semibold text-slate-800">
                <StatusBadge status={selectedTask.status} />
              </p>
            </div>
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
                  updateStatus(selectedTask.id, { AssignedStatus: nextStatus })
                }
                className="cursor-pointer w-full rounded-xl bg-[#0f2a5c] px-5 py-3 font-semibold text-white transition hover:bg-[#163b7c] active:scale-[0.99]"
              >
                Mark as {nextStatus}
              </button>
            )}

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
     PAGE CONTENT SWITCH
  ----------------------------- */
  let content;

  if (selectedTask) {
    content = renderTaskDetails();
  } else if (page === "home") {
    content = (
      <HomePage
        tasks={tasks}
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

  /* -----------------------------
     MAIN LAYOUT
  ----------------------------- */
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
              <p className="text-[11px] text-slate-400">
                Field Worker Portal
              </p>
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
        <div className="mx-auto grid max-w-2xl grid-cols-4">
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
}
