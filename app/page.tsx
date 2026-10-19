"use client";

// HOME PAGE

import { useMemo } from "react";
import Link from "next/link";
import { Icon, StatusBadge, useFieldWorker } from "./components/fieldworker";
import { ServiceStatus } from "./components/barangay-map";

const STATUS_PRIORITY: Partial<Record<ServiceStatus, number>> = {
  Active: 2,
  Monitoring: 1,
};

//#region DASHBOARD CARD

function DashboardCard({
  title,
  count,
  description,
  background,
  href,
  onClick,
}: {
  title: string;
  count: number;
  description: string;
  background: string;
  href: string;
  onClick?: () => void;
}) {
  const styles: Record<string, { color: string; light: string }> = {
    "My Tasks": {
      color: "#174477",
      light: "#edf4ff",
    },
    Active: {
      color: "#dc0000",
      light: "#fff1f1",
    },
    Monitoring: {
      color: "#ff9900",
      light: "#fff8e8",
    },
    Resolved: {
      color: "#009b70",
      light: "#eafbf4",
    },
  };

  const style = styles[title] ?? styles["My Tasks"];

  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative block min-h-[180px] w-full overflow-hidden border border-slate-300 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Background image: visible on hover */}
      {background && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 transition-opacity duration-300 group-hover:opacity-20"
          style={{ backgroundImage: `url("${background}")` }}
        />
      )}

      {/* Colored top border */}
      <div
        className="absolute top-0 bottom-0 right-0 left-0 z-10 h-[3px]"
        style={{ backgroundColor: style.color }}
      />

      {/* Card content */}
      <div className="relative z-10">
        {/* Title and dot box */}
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-slate-700">
            {title}
          </p>

          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: style.light }}
          >
            <div
              className="h-3.5 w-3.5 rounded-sm"
              style={{ backgroundColor: style.color }}
            />
          </div>
        </div>

        {/* Count */}
        <p
          className="mt-[-5px] text-[34px] leading-tight font-bold tracking-tight"
          style={{ color: style.color }}
        >
          {count}
        </p>

        {/* Description */}
        <p className="mt-4 text-xs text-slate-500">
          {description}
        </p>

        {/* View tasks */}
        <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-slate-700">
          View tasks

          <Icon
            name="arrow"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}

//#endregion

//#region HOME PAGE

export default function HomePage() {
  const { tasks, historyLogs, setHistoryLogs, setTaskFilter, openTask } =
    useFieldWorker();

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

  const unreadHistoryCount = historyLogs.filter((log) => !log.read).length;

  //#endregion

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end bg-linear-to-r from-[#241C70] via-[#342992] to-[#5366C8] px-6 py-6 sm:px-8">
        <div>
          <p className="text-sm font-medium text-blue-100">
            Field Worker Portal
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-blue-100">
            Monitor and manage your assigned incidents.
          </p>
          <p className="mt-1 text-sm text-blue-100">
            Tanza, Cavite | {new Date().toLocaleDateString("en-PH", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </div>

        {/* <Link
          href="/history"
          onClick={() =>
            setHistoryLogs((current) =>
              current.map((log) => ({ ...log, read: true }))
            )
          }
          className="relative flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-500 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
        >
          <Icon name="history" className="h-5 w-5" />
          History Log
          {unreadHistoryCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
              {unreadHistoryCount}
            </span>
          )}
        </Link> */}
      </div>

      {/* Dashboard Cards */}
      <section className="grid grid-cols-2 grid-rows-2 gap-5">
        <DashboardCard
          href="/task"
          title="Active"
          count={activeTasks.length}
          description="Incidents requiring action"
          background=""
          onClick={() => {
            setTaskFilter("Active");
          }}
        />
        <DashboardCard
          href="/task"
          title="Monitoring"
          count={monitoringTasks.length}
          description="Incidents being monitored"
          background="/"
          onClick={() => {
            setTaskFilter("Monitoring");
          }}
        />
        <DashboardCard
          href="/task"
          title="Resolved"
          count={resolvedTasks.length}
          description="Completed incidents"
          background="/"
          onClick={() => {
            setTaskFilter("Resolved");
          }}
        />
        <DashboardCard
          href="/task"
          title="Total Tasks"
          count={myTasks.length}
          description="All unresolved assignments"
          background="hover:bg-slate-50"
          onClick={() => {
            setTaskFilter("All");
          }}
        />
      </section>

      {/* Recent Tasks */}
      <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-[#0f2a5c]">Recent Tasks</h2>
            <p className="mt-1 text-sm text-[#0f2a5c]">
              Your latest assigned incidents
            </p>
          </div>
          <Link
            href="/task"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {[...myTasks]
          .sort((a, b) => {
            const priorityA =
              STATUS_PRIORITY[a.status as ServiceStatus] ?? 0;
            const priorityB =
              STATUS_PRIORITY[b.status as ServiceStatus] ?? 0;

            return priorityB - priorityA;
          })
          .slice(0, 4)
          .map((task) => (
            <button
              key={task.id}
              onClick={() => openTask(task)}
              className="flex w-full min-w-0 flex-col gap-3 p-4 text-left transition hover:bg-slate-50 sm:p-5 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-blue-50 text-sm font-bold text-blue-700 sm:h-11 sm:w-11">
                  {task.id.replace("INC-", "")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[#0f2a5c]">
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
                  <p className="text-xs font-semibold text-[#0f2a5c] sm:text-sm">
                    {task.time}
                  </p>
                </div>
                <div className="shrink-0 text-left md:text-right">
                  <p className="text-[10px] text-slate-400 sm:text-xs">ETR</p>
                  <p className="text-xs font-semibold text-[#0f2a5c] sm:text-sm">
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
