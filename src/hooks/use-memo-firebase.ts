'use client';

import { useMemo, type DependencyList } from 'react';

type MemoFirebase<T> = T & { __memo?: boolean };

export function useMemoFirebase<T>(
  factory: () => T,
  deps: DependencyList
): T | MemoFirebase<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoized = useMemo(factory, deps);

  if (typeof memoized !== 'object' || memoized === null) {
    return memoized;
  }

  // Add a non-enumerable property to mark the object as memoized.
  // This helps our hooks (useCollection, useDoc) to verify that the
  // reference they receive is stable, preventing infinite render loops.
  Object.defineProperty(memoized, '__memo', {
    value: true,
    writable: false,
    enumerable: false,
    configurable: false,
  });
  
  return memoized as MemoFirebase<T>;
}
