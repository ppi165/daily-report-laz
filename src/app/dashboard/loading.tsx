import AppShell from "@/src/common/components/app-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <AppShell>
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 sm:gap-8">
        {/* Top Grid: Greeting Banner + Today Status Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 flex flex-col gap-4">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-9 w-64 rounded-md" />
            <Skeleton className="h-4 w-full max-w-md rounded-md" />
            <div className="mt-auto pt-4 border-t border-surface-container flex items-center justify-between">
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
          </div>

          <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
            <Skeleton className="h-7 w-48 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-11 w-full rounded-xl mt-auto" />
          </div>
        </div>

        {/* 3 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 flex flex-col gap-2.5"
            >
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <Skeleton className="h-9 w-32 rounded-md" />
              <Skeleton className="h-3.5 w-40 rounded-md" />
            </div>
          ))}
        </div>

        {/* Bottom Grid: Recent Activity + Team Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-1">
              <Skeleton className="h-6 w-44 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
            <div className="p-4 rounded-2xl bg-surface-container-low/70 flex flex-col gap-2.5">
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-5 w-52 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
            </div>
          </div>

          <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 flex flex-col gap-4">
            <Skeleton className="h-6 w-36 rounded-md" />
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3 items-start">
                  <Skeleton className="size-10 rounded-full shrink-0" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-28 rounded-md" />
                    <Skeleton className="h-3.5 w-full rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
