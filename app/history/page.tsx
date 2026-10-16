"use client";

import { Icon, StatusBadge, useFieldWorker } from "../components/fieldworker";

//#region HISTORY PAGE

export default function HistoryPage() {
  const { tasks, historyLogs, historySearch, setHistorySearch, openTask } =
    useFieldWorker();

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
