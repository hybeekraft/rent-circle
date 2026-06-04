import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse bg-ink-200 rounded-2xl', className)} />
  )
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-ink-100">
      <Skeleton className="h-48 rounded-none" />
      <div className="p-4 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function ProfileCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-ink-100">
      <Skeleton className="h-72 rounded-none" />
      <div className="p-4 flex flex-col gap-2">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}

export function MessageSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
          <Skeleton className={`h-10 rounded-2xl ${i % 2 === 0 ? 'w-3/4' : 'w-1/2'}`} />
        </div>
      ))}
    </div>
  )
}
