// TasksPage.tsx

import { Task, Status, Icon, StatusBadge } from "./database";

export function TasksPage({
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
                <h2 className="mt-2 font-bold text-slate-900">
                  {task.type}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {task.location}
                </p>
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
