"use client";

import { useState } from "react";
import { Icon, StatusBadge, useFieldWorker } from "../components/fieldworker";

//#region NOTIFICATIONS PAGE

export default function NotificationsPage() {
  const {
    tasks,
    notifications,
    setNotifications,
    notifMessage,
    setNotifMessage,
    openTask,
  } = useFieldWorker();

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

 const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);

    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  //#endregion

  return (
    
    <div className="space-y-6">
      {/* Top Loading Spinner */}
        {isRefreshing && (
          <div className="fixed left-1/2 top-4 z-[9999] -translate-x-1/2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0f2a5c] bg-white shadow-md" />
          </div>
        )}
      <div className="flex flex-col justify-between gap-3 bg-linear-to-r from-[#241C70] via-[#342992] to-[#5366C8] px-6 py-6 sm:px-8 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-blue-100">
            Field Worker Portal
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-blue-100">
            Stay updated with your assigned incidents.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleRefresh}
            className="flex w-fit items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
          >
            Refresh
          </button>
    
          <button
            onClick={deleteReadNotifications}
            className="w-fit rounded-xl border border-red-200 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-white/20"
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
