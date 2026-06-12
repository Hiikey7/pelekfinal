import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCardSkeleton() {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-card">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-16 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-card">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function BlogGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function PropertyDetailSkeleton() {
  return (
    <div className="pt-20 pb-24 md:pb-12">
      <div className="w-[90%] mx-auto">
        <Skeleton className="h-5 w-36 mb-6" />
        <Skeleton className="aspect-[16/9] md:aspect-[21/9] rounded-2xl mb-4" />
        <div className="flex gap-3 pb-4 mb-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="w-24 h-20 md:w-32 md:h-24 rounded-xl flex-shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3 w-full">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
            <Skeleton className="h-7 w-24 rounded-full" />
            <div className="flex gap-6">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="w-[90%] mx-auto">
        <div className="mb-8 flex justify-center">
          <div className="rounded-xl bg-white px-4 py-2 shadow-card">
            <img
              src="/logo-nav.png"
              alt="Pelek Properties"
              className="h-20 w-auto bg-white"
              width={160}
              height={80}
              decoding="async"
            />
          </div>
        </div>
        <Skeleton className="h-9 w-56" />
        <Skeleton className="mt-3 h-5 w-80 max-w-full" />
        <div className="mt-8">
          <PropertyGridSkeleton count={3} />
        </div>
      </div>
    </div>
  );
}
