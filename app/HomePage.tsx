// HomePage.tsx

import { Task, Page, HistoryLog, Icon, StatusBadge } from "./database";

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

export function HomePage({
  tasks,
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
  tasks: Task[];
  myTasks: Task[];
  activeTasks: Task[];
  monitoringTasks: Task[];
  resolvedTasks: Task[];
  unreadHistoryCount: number;
  setPage: (page: Page) => void;
  setHistoryLogs: React.Dispatch<React.SetStateAction<HistoryLog[]>>;
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
                <StatusBadge status={task.AssignedStatus} />
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
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <h2 className="font-bold text-slate-900">Team Task Overview</h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Current incident status assigned to Team Alpha
          </p>
        </div>

        {/* MOBILE VIEW */}
        <div className="divide-y divide-slate-100 md:hidden">
          {tasks.map((task) => (
            <div key={task.id} className="space-y-3 p-4">
              <div className="flex min-w-0 items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{task.id}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {task.location}
                  </p>
                </div>
                <div className="shrink-0">
                  <StatusBadge status={task.status} />
                </div>
              </div>

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

        {/* DESKTOP VIEW */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Incident</th>
                <th className="px-5 py-4 font-semibold">Location</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">ETR</th>
                <th className="px-5 py-4 font-semibold">Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <tr key={task.id} className="transition hover:bg-slate-50">
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
