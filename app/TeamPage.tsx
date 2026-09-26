// TeamPage.tsx

import { Page, Icon } from "./database";

export function TeamPage({ setPage }: { setPage: (page: Page) => void }) {
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
            <p className="mt-1 text-sm text-blue-100">
              Field Operations Team
            </p>
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
