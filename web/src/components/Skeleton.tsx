'use client';

// Main Listing Card Skeleton
export function ListingCardSkeleton() {
  return (
    <div className="bg-[#2a2a2a] rounded-2xl overflow-hidden border border-white/5 animate-pulse">
      {/* Image */}
      <div className="relative h-40 bg-[#353535]" />
      
      {/* Content */}
      <div className="p-3 space-y-3">
        {/* Price */}
        <div className="h-6 w-24 bg-[#353535] rounded-lg" />
        
        {/* Title */}
        <div className="h-4 w-full bg-[#353535] rounded-lg" />
        
        {/* Location */}
        <div className="h-3 w-3/4 bg-[#353535] rounded-lg" />
        
        {/* Features */}
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-[#353535] rounded-lg" />
          <div className="h-6 w-16 bg-[#353535] rounded-lg" />
          <div className="h-6 w-16 bg-[#353535] rounded-lg" />
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#353535] rounded-full" />
            <div className="h-3 w-20 bg-[#353535] rounded-lg" />
          </div>
          <div className="h-3 w-8 bg-[#353535] rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Grid of skeletons for listings page
export function ListingsGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Hero section skeleton
export function HeroSkeleton() {
  return (
    <div className="relative h-[600px] bg-[#2a2a2a] animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-2xl">
          <div className="h-16 w-64 bg-[#353535] rounded-2xl mx-auto" />
          <div className="h-6 w-96 bg-[#353535] rounded-xl mx-auto" />
          <div className="h-16 w-full bg-[#353535] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

// Map skeleton
export function MapSkeleton() {
  return (
    <div className="w-full h-[600px] bg-[#2a2a2a] animate-pulse flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-[#353535] rounded-full mx-auto" />
        <div className="h-4 w-48 bg-[#353535] rounded-lg mx-auto" />
      </div>
    </div>
  );
}

// Stats skeleton
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-[#2a2a2a] rounded-2xl p-6 animate-pulse">
          <div className="h-8 w-8 bg-[#353535] rounded-lg mb-4" />
          <div className="h-8 w-24 bg-[#353535] rounded-lg mb-2" />
          <div className="h-4 w-32 bg-[#353535] rounded-lg" />
        </div>
      ))}
    </div>
  );
}

// Chat skeleton
export function ChatSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="w-12 h-12 bg-[#353535] rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-[#353535] rounded-lg" />
            <div className="h-3 w-48 bg-[#353535] rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Profile skeleton
export function ProfileSkeleton() {
  return (
    <div className="bg-[#2a2a2a] rounded-2xl p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-[#353535] rounded-full" />
        <div className="space-y-2">
          <div className="h-6 w-40 bg-[#353535] rounded-lg" />
          <div className="h-4 w-32 bg-[#353535] rounded-lg" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-12 w-full bg-[#353535] rounded-xl" />
        <div className="h-12 w-full bg-[#353535] rounded-xl" />
        <div className="h-12 w-full bg-[#353535] rounded-xl" />
      </div>
    </div>
  );
}

// Table skeleton for admin
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-[#2a2a2a] rounded-xl animate-pulse">
          <div className="w-10 h-10 bg-[#353535] rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 bg-[#353535] rounded-lg" />
            <div className="h-3 w-32 bg-[#353535] rounded-lg" />
          </div>
          <div className="h-8 w-24 bg-[#353535] rounded-lg" />
        </div>
      ))}
    </div>
  );
}

// Full page loading state
export function PageLoader({ message = 'Загрузка...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-[#353535] flex items-center justify-center">
      <div className="text-center space-y-4">
        {/* Animated Logo */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">Р</span>
          </div>
        </div>
        
        {/* Loading Bar */}
        <div className="w-48 h-1 bg-[#2a2a2a] rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '50%' }} />
        </div>
        
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
}
