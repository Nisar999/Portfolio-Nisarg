"use client";

import Image, { ImageProps } from "next/image";

/**
 * Props for OptimizedImage component
 * Enforces alt text as required for accessibility
 */
interface OptimizedImageProps
  extends Omit<ImageProps, "alt" | "priority" | "loading"> {
  /** Alternative text for the image (REQUIRED for accessibility) */
  alt: string;
  /** If true, image loads with priority (use for above-fold images) */
  priority?: boolean;
  /** Lazy loading strategy - defaults to true */
  lazy?: boolean;
}

/**
 * Optimized wrapper around Next.js Image component
 *
 * Features:
 * - Enforces alt text at compile time (TypeScript error if missing)
 * - Responsive sizes for different viewports
 * - Lazy loading by default
 * - Priority loading for above-fold images
 * - Will-change CSS hints for performance
 *
 * @example
 * ```tsx
 * // Above-fold, high priority
 * <OptimizedImage
 *   src="/hero.jpg"
 *   alt="Hero section background"
 *   priority={true}
 *   width={1200}
 *   height={600}
 * />
 *
 * // Below-fold, lazy loaded
 * <OptimizedImage
 *   src="/logo.jpg"
 *   alt="Company logo"
 *   priority={false}
 *   width={200}
 *   height={200}
 * />
 * ```
 */
export default function OptimizedImage({
  alt,
  priority = false,
  lazy = true,
  sizes,
  style,
  ...props
}: OptimizedImageProps) {
  // Default responsive sizes if not provided
  const defaultSizes =
    sizes ||
    "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

  // Merge will-change style for performance optimization
  const mergedStyle = {
    ...style,
    willChange: "opacity, transform",
  };

  return (
    <Image
      alt={alt}
      priority={priority}
      loading={lazy && !priority ? "lazy" : "eager"}
      sizes={defaultSizes}
      style={mergedStyle}
      {...props}
    />
  );
}
