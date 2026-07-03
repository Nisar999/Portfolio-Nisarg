"use client";

import { useLoading } from "@/context/LoadingContext";

/**
 * Custom hook that returns true only after hydration is complete.
 * 
 * Use this hook when you need to perform client-only operations that depend on
 * browser APIs (like localStorage, window, DOM manipulation). It prevents hydration
 * mismatches by ensuring the code only runs after the client has fully hydrated.
 * 
 * @example
 * ```tsx
 * const isMounted = useMount();
 * 
 * if (!isMounted) {
 *   return null; // Don't render client-only code during SSR
 * }
 * 
 * // Safe to use browser APIs here
 * const value = localStorage.getItem('key');
 * ```
 * 
 * @returns {boolean} True after hydration is complete, false during SSR
 */
export function useMount(): boolean {
    const { isMounted } = useLoading();
    return isMounted;
}
