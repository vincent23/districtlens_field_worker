"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import BarangayMap, { type ServiceStatus } from "../components/barangay-map";
import { useFieldWorker } from "../components/fieldworker";
import type { Report } from "../components/fieldworker";

//#region MAP REPORTS (built from the shared incidents)

type MapReport = {
  barangay: string;
  status: ServiceStatus;
  title: string;
  description: string;
  time: string;
  /** 1 Reported · 2 Assigned · 3 Responding · 4 Resolved */
  progress: 1 | 2 | 3 | 4;
};

// If a barangay has several incidents, the most urgent one is shown.
const STATUS_PRIORITY: Record<ServiceStatus, number> = {
  Active: 3,
  Monitoring: 2,
  Normal: 1,
};

const PROGRESS_STEPS = ["Reported", "Assigned", "Responding", "Resolved"];

function toMapReport(task: Report): MapReport {
  // "Brgy. San Roque" -> "San Roque" (must match brgy_name in the GeoJSON)
  const barangay = task.location.replace(/^brgy\.?\s*/i, "").trim();

  const status: ServiceStatus =
    task.AssignedStatus === "Resolved"
      ? "Normal"
      : task.status === "Monitoring"
      ? "Monitoring"
      : "Active";

  const fallbackDescription =
    status === "Normal"
      ? "Water service has been restored and the area is currently operating normally."
      : status === "Monitoring"
      ? "The current service condition in the area is being monitored."
      : "Field personnel are currently responding to the incident.";

  return {
    barangay,
    status,
    title: status === "Normal" ? "Service Restored" : task.type,
    description: task.description || fallbackDescription,
    time: `Today · ${task.time}`,
    progress:
      task.AssignedStatus === "Resolved"
        ? 4
        : task.AssignedStatus === "Ongoing"
        ? 3
        : 2,
  };
}

//#endregion

export default function MapPage() {
  const { tasks } = useFieldWorker();

  const reports = useMemo(() => {
    const byBarangay = new Map<string, MapReport>();

    for (const task of tasks) {
      const report = toMapReport(task);
      const current = byBarangay.get(report.barangay);

      if (
        !current ||
        STATUS_PRIORITY[report.status] > STATUS_PRIORITY[current.status]
      ) {
        byBarangay.set(report.barangay, report);
      }
    }

    return Array.from(byBarangay.values());
  }, [tasks]);

  const statusByBarangay = useMemo(
    () =>
      Object.fromEntries(reports.map((r) => [r.barangay, r.status])) as Record<
        string,
        ServiceStatus
      >,
    [reports]
  );

  const [selectedBarangay, setSelectedBarangay] =
    useState<string | null>(null);

  const selectedReport = reports.find(
    (report) => report.barangay === selectedBarangay
  );

  const getStatusStyles = (status?: string) => {
    switch (status) {
      case "Active":
        return {
          dot: "bg-red-500",
          bg: "bg-red-50",
          text: "text-red-600",
        };

      case "Monitoring":
        return {
          dot: "bg-yellow-400",
          bg: "bg-yellow-50",
          text: "text-yellow-700",
        };

      case "Normal":
      default:
        return {
          dot: "bg-green-500",
          bg: "bg-green-50",
          text: "text-green-700",
        };

      
       
    }
  };

  const statusStyles = getStatusStyles(
    selectedReport?.status
  );

  return (
    <div>

      {/* =====================================================
          PAGE INTRO
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 pb-7 pt-10 sm:px-8">

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Field Worker Portal
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0f2a5c] sm:text-3xl">
              Tanza Water Service Map
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              View current water service conditions and
              reported incidents across Tanza barangays.
            </p>

          </div>

          {/* STATUS LEGEND */}

          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3">

            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Status
            </span>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              Active
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              Monitoring
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              Normal
            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          HOW TO USE
          MOVED ABOVE MAP
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 pb-5 sm:px-8">

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-semibold text-slate-800">
                How to use the map
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                Select a barangay on the map to view its
                latest service reports and updates.
              </p>

            </div>

            <div className="flex items-center gap-3 text-[10px] text-slate-500">

              <div className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-[8px] font-bold text-white">
                  1
                </span>
                Select
              </div>

              <span className="text-slate-300">
                →
              </span>

              <div className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-[8px] font-bold text-white">
                  2
                </span>
                View
              </div>

              <span className="text-slate-300">
                →
              </span>

              <div className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-[8px] font-bold text-white">
                  3
                </span>
                Check
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          MAP + RECENT REPORTS
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">

          {/* =================================================
              MAP CONTAINER
          ================================================== */}

          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">

            {/* MAP HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

              <div>

                <h2 className="text-sm font-bold text-slate-900">
                  Barangay Service Map
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Click a barangay to view its latest report
                </p>

              </div>

              <span className="rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-medium text-slate-500">
                Tanza, Cavite
              </span>

            </div>

            {/* MAP */}

            <div className="relative isolate h-[600px] overflow-hidden bg-slate-100">

              <BarangayMap
                onBarangayClick={setSelectedBarangay}
                statusByBarangay={statusByBarangay}
              />

              {/* =================================================
                  BARANGAY POPUP / OVERLAY
              ================================================== */}

              {selectedBarangay && (

                <div className="absolute inset-0 z-[1000] pointer-events-none">

                  {/* BACKDROP */}

                  <div
                    className="absolute inset-0 bg-slate-900/10 pointer-events-auto"
                    onClick={() => setSelectedBarangay(null)}
                  />

                  {/* POPUP CARD */}

                  <div className="absolute left-1/2 top-6 w-[calc(100%-32px)] max-w-[470px] -translate-x-1/2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl pointer-events-auto">

                    {/* POPUP HEADER */}

                    <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">

                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                          Barangay Report
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-slate-900">
                          {selectedBarangay}
                        </h2>

                      </div>

                      <button
                        onClick={() =>
                          setSelectedBarangay(null)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        ✕
                      </button>

                    </div>

                    {selectedReport ? (

                      <>

                        {/* STATUS */}

                        <div className="border-b border-slate-100 px-5 py-4">

                          <div className="flex items-center justify-between">

                            <span className="text-xs font-medium text-slate-500">
                              Current Status
                            </span>

                            <span
                              className={`flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles.bg} ${statusStyles.text}`}
                            >

                              <span
                                className={`h-2 w-2 rounded-full ${statusStyles.dot}`}
                              />

                              {selectedReport.status}

                            </span>

                          </div>

                        </div>

                        {/* REPORT INFORMATION */}

                        <div className="px-5 py-5">

                          <div className="flex items-start gap-3">

                            <span
                              className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${statusStyles.dot}`}
                            />

                            <div>

                              <h3 className="text-sm font-bold text-slate-900">
                                {selectedReport.title}
                              </h3>

                              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                                {selectedReport.description}
                              </p>

                              <p className="mt-3 text-[10px] text-slate-400">
                                {selectedReport.time}
                              </p>

                            </div>

                          </div>

                        </div>

                        {/* REPORT PROGRESS */}

                        <div className="border-t border-slate-100 px-5 py-5">

                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Report Progress
                          </p>

                          <div className="mt-5 overflow-x-auto pb-1">

                            <div className="flex min-w-[390px] items-start">

                              {PROGRESS_STEPS.map((label, index) => {
                                const step = index + 1;
                                const progress = selectedReport.progress;
                                const done = step < progress || progress === 4;
                                const current = !done && step === progress;
                                const isLast = step === PROGRESS_STEPS.length;

                                const circle = (
                                  <div className="flex flex-col items-center">

                                    <div
                                      className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] ${
                                        done || current
                                          ? "bg-blue-700 font-bold text-white"
                                          : "border border-slate-200 bg-white text-slate-300"
                                      }`}
                                    >
                                      {done ? "✓" : current ? "•" : step}
                                    </div>

                                    <span
                                      className={`mt-2 whitespace-nowrap text-[9px] ${
                                        done
                                          ? "font-semibold text-slate-600"
                                          : current
                                          ? "font-semibold text-blue-700"
                                          : "font-medium text-slate-400"
                                      }`}
                                    >
                                      {label}
                                    </span>

                                  </div>
                                );

                                if (isLast) {
                                  return <div key={label}>{circle}</div>;
                                }

                                return (
                                  <div key={label} className="flex flex-1 items-start">

                                    {circle}

                                    <div
                                      className={`mt-3 h-0.5 flex-1 ${
                                        step < progress
                                          ? "bg-blue-700"
                                          : "bg-slate-200"
                                      }`}
                                    />

                                  </div>
                                );
                              })}

                            </div>

                          </div>

                        </div>

                      </>

                    ) : (

                      /* NO REPORT */

                      <div className="px-5 py-8 text-center">

                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                          ✓
                        </div>

                        <h3 className="mt-3 text-sm font-bold text-slate-900">
                          No Recent Reports
                        </h3>

                        <p className="mt-2 text-[11px] leading-5 text-slate-400">
                          There are currently no reported
                          incidents for this barangay.
                        </p>

                      </div>

                    )}

                  </div>

                </div>

              )}

            </div>

          </div>

          {/* =================================================
              RECENT REPORTS
          ================================================== */}

          <aside className="flex min-h-[600px] flex-col rounded-xl border border-slate-200 bg-white">

            {/* HEADER */}

            <div className="border-b border-slate-100 px-5 py-4">

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                Latest Updates
              </p>

              <h2 className="mt-1 text-sm font-bold text-[#0f2a5c]">
                Recent Reports
              </h2>

              <p className="mt-1 text-[10px] leading-4 text-slate-400">
                Latest service reports across Tanza
              </p>

            </div>

            {/* REPORT LIST */}

            <div className="flex-1">

              {reports.map((report, index) => {

                const styles =
                  getStatusStyles(report.status);

                return (

                  <button
                    key={report.barangay}
                    onClick={() =>
                      setSelectedBarangay(
                        report.barangay
                      )
                    }
                    className={`block w-full text-left px-5 py-4 transition hover:bg-slate-50 ${
                      index !== reports.length - 1
                        ? "border-b border-slate-100"
                        : ""
                    }`}
                  >

                    <div className="flex gap-3">

                      <span
                        className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${styles.dot}`}
                      />

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center justify-between gap-2">

                          <p className="text-xs font-semibold text-[#0f2a5c]">
                            {report.barangay}
                          </p>

                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${styles.bg} ${styles.text}`}
                          >
                            {report.status}
                          </span>

                        </div>

                        <p className="mt-1.5 text-[11px] leading-4 text-slate-500">
                          {report.title}
                        </p>

                        <p className="mt-2 text-[9px] text-slate-400">
                          {report.time}
                        </p>

                      </div>

                    </div>

                  </button>

                );

              })}

            </div>

            {/* FOOTER */}

            <div className="border-t border-slate-100 px-5 py-4">

              <Link
                href="/task"
                className="text-xs font-semibold text-blue-700 transition hover:text-blue-900"
              >
                View All Reports →
              </Link>

            </div>

          </aside>

        </div>

      </section>

    </div>
  );
}
