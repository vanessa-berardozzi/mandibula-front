import { Suspense } from 'react';
import { SearchContent } from './SearchContent';

function SearchSkeleton() {
  return (
    <main className="min-h-screen pb-12 pt-24">
      <div className="px-4 md:px-8 mb-8">
        <div className="h-10 w-40 bg-black/40 rounded-lg animate-pulse mb-6" />
        <div className="h-12 max-w-2xl bg-black/40 rounded-lg animate-pulse" />
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}
