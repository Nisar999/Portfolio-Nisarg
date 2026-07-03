# Implementation Plan: Portfolio Improvements

## Overview

This plan breaks down the portfolio improvements into actionable implementation tasks. The approach is to fix foundational issues first (hydration), then add accessibility, enhance the chat widget, and finally optimize performance. Each task builds on previous work, ensuring incremental progress and early validation.

**Implementation Language**: TypeScript with React and Next.js

## Tasks

### Phase 1: Fix Hydration Mismatch

- [x] 1.1 Update LoadingContext to fix server-client mismatch
  - Modify initial state to `false` instead of `true`
  - Add `isMounted` state to track hydration completion
  - Add `useEffect` to set `isMounted: true` after hydration
  - Export updated hook interface
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 1.2 Create useMount hook for safe client-only operations
  - Create new file `src/hooks/useMount.ts`
  - Implement hook that returns `true` only after hydration
  - Use in components that have hydration-sensitive logic
  - _Requirements: 1.1, 1.2_

- [ ]* 1.3 Write unit tests for LoadingContext
  - Test context initialization with correct initial state
  - Test useLoading hook error handling outside provider
  - Test isMounted flag transitions
  - Test multiple components sharing context
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 1.4 Verify Preloader component works with new LoadingContext
  - Check that Preloader uses isMounted instead of just isLoading
  - Update animations to start only after hydration
  - Ensure no console warnings appear on page load
  - _Requirements: 1.1, 1.2_

- [x] 1.5 Checkpoint - Ensure hydration works without console errors
  - Load page and verify no hydration mismatch warnings in console
  - Check that Preloader animation works correctly
  - Verify loading state transitions smoothly
  - _Requirements: 1.1, 1.2, 1.3_

---

### Phase 2: Improve Accessibility

- [x] 2.1 Add alt text to all images in Hero component
  - Update `src/components/Hero.tsx` Image components
  - Add meaningful alt text for nisarg.png (person image)
  - Add alt text for header.png (background context)
  - Verify alt text follows WCAG guidelines (8+ words for important images)
  - _Requirements: 2.1, 2.2_

- [x] 2.2 Add alt text to all images in remaining components
  - Update `src/components/Experience.tsx` - company logos
  - Update `src/components/CommunityEngagement.tsx` - event photos
  - Update any other components with images
  - Create missing alt text descriptions
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 2.3 Add semantic HTML structure to layout and main sections
  - Update `src/app/layout.tsx` to use semantic elements
  - Wrap each component section in `<section>` with aria-label
  - Ensure `<main>` wraps primary content
  - Add `<nav>` wrapper to Navbar component
  - _Requirements: 3.1_

- [x] 2.4 Add ARIA labels to interactive elements
  - Add aria-label to ChatWidget toggle button
  - Add aria-label to all buttons in Hero, Contact sections
  - Add aria-expanded to ChatWidget toggle (reflects isOpen state)
  - Add aria-current to active nav links
  - _Requirements: 3.2, 3.3, 3.5_

- [x] 2.5 Add aria-live region to ChatWidget for screen readers
  - Create aria-live region that announces new messages
  - Mark region as role="status" for non-assertive announcements
  - Ensure typing indicator is announced
  - Announce error messages to screen readers
  - _Requirements: 3.1, 3.5, 3.6_

- [ ]* 2.6 Write accessibility tests
  - Use axe-core to audit components for accessibility
  - Test semantic HTML structure with accessibility tree
  - Verify all images have meaningful alt text
  - Verify ARIA attributes are correctly applied
  - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

- [x] 2.7 Checkpoint - Verify accessibility improvements
  - Run accessibility audit and ensure all critical issues resolved
  - Test with screen reader (NVDA or simulation)
  - Test keyboard navigation through all interactive elements
  - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3, 3.5_

---

### Phase 3: Enhance Chat Widget

- [x] 3.1 Create custom hook for chat message persistence
  - Create new file `src/hooks/useChatPersistence.ts`
  - Implement localStorage save/load logic
  - Handle localStorage errors gracefully
  - Return { messages, saveMessages } interface
  - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [x] 3.2 Update ChatWidget to use message persistence
  - Import useChatPersistence hook
  - Replace messages state with hook
  - Load persisted messages on component mount
  - Save messages after every send/receive
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 3.3 Implement typing indicators in ChatWidget
  - The existing loading state already shows typing indicator
  - Verify typing indicator displays while API processes
  - Add accessibility announcements for typing indicator
  - Test typing indicator appears within 200ms of API call
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 3.4 Implement error recovery in ChatWidget
  - Improve error message to be human-readable and actionable
  - Detect network errors (type detection from error object)
  - Add retry logic (enable send button, clear error after 10s)
  - Implement 30-second timeout detection
  - Show connection check suggestion on repeated failures
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 3.5 Add message status tracking
  - Update ChatMessage interface to include status field
  - Show "pending" status while sending
  - Update to "sent" on success or "error" on failure
  - Display visual indicator for message status
  - _Requirements: 4.1, 6.1_

- [ ]* 3.6 Write property tests for message persistence
  - **Property 1: Chat Message Persistence Round-Trip**
  - **Validates: Requirements 4.1, 4.2**
  - Generate random messages, save, load, verify equivalence
  - Min 100 iterations
  - _Requirements: 4.1, 4.2_

- [ ]* 3.7 Write property tests for message ordering
  - **Property 5: Message Ordering Preservation**
  - **Validates: Requirement 4.1, 4.4**
  - Generate message sequences, save, load, verify order
  - Min 100 iterations
  - _Requirements: 4.1, 4.4_

- [ ]* 3.8 Write integration tests for ChatWidget
  - Test send message → API response flow
  - Test message persistence across reload
  - Test error handling and retry
  - Test typing indicator display
  - Test localStorage full scenario
  - _Requirements: 4.1, 4.2, 5.1, 6.1_

- [x] 3.9 Checkpoint - Verify chat widget enhancements
  - Send messages and verify they persist after reload
  - Verify typing indicator appears during API call
  - Test error scenarios (disconnect network, API fail)
  - Verify error messages are clear
  - Check that messages don't clear unexpectedly
  - _Requirements: 4.1, 4.2, 5.1, 5.3, 6.1, 6.2_

---

### Phase 4: Performance Optimization

- [x] 4.1 Create motion preference hook and utilities
  - Create new file `src/hooks/useMotionPreference.ts`
  - Implement media query listener for prefers-reduced-motion
  - Export hook with reactive state updates
  - Create export in `src/hooks/index.ts`
  - _Requirements: 8.1, 8.3_

- [x] 4.2 Update Framer Motion components to respect motion preferences
  - Update Hero.tsx animations
    - Check prefersReducedMotion before applying animations
    - If true, use instant state changes instead of animated transitions
  - Update ChatWidget.tsx animations
    - Apply same pattern to motion.div components
  - Update SkillsConstellation.tsx if it uses animations
  - Add will-change hints for animated elements
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 4.3 Create OptimizedImage component wrapper
  - Create new file `src/components/OptimizedImage.tsx`
  - Enforce required alt prop at TypeScript level
  - Implement lazy loading with loading prop
  - Add sizes attribute for responsive images
  - Set priority for above-the-fold images
  - _Requirements: 7.1, 7.3, 7.4_

- [x] 4.4 Replace Image imports with OptimizedImage in key components
  - Update Hero.tsx to use OptimizedImage
  - Update Experience.tsx to use OptimizedImage
  - Update CommunityEngagement.tsx to use OptimizedImage
  - Set priority={true} for hero images
  - Set priority={false} (default) for below-fold images
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 4.5 Add image optimization configuration to next.config.ts
  - Configure Next.js Image for WebP with JPEG fallback
  - Set image size constraints (max 200KB thumbnails, 500KB hero)
  - Configure image caching headers
  - Enable blur placeholder for images
  - _Requirements: 7.1, 7.4, 7.5_

- [ ] 4.6 Create LazySection component for below-fold sections
  - Create new file `src/components/LazySection.tsx`
  - Implement Intersection Observer for scroll detection
  - Accept children and optional fallback/placeholder
  - Render only when section becomes visible
  - _Requirements: 9.2, 9.3, 9.4_

- [ ] 4.7 Update component imports to use code splitting for heavy components
  - Use Next.js dynamic imports for components not critical on load
  - Apply dynamic import to Certifications, Publications, Projects
  - Add loading fallback UI
  - _Requirements: 9.1, 9.2, 9.3_

- [ ]* 4.8 Write property tests for motion preferences
  - **Property 3: Motion Preference Idempotence**
  - **Validates: Requirements 8.1, 8.3**
  - Query motion preference multiple times, verify consistency
  - Min 100 iterations
  - _Requirements: 8.1, 8.3_

- [ ]* 4.9 Write property tests for image alt text enforcement
  - **Property 4: Image Alt Text Presence**
  - **Validates: Requirements 2.1, 2.2**
  - Generate random images, verify alt text is present and meaningful
  - Min 100 iterations
  - _Requirements: 2.1, 2.2_

- [ ]* 4.10 Write performance integration tests
  - Measure image loading times (must be <2s for hero, <500ms for thumbnails)
  - Verify lazy loading defers non-visible image downloads
  - Verify animations disabled when prefers-reduced-motion is set
  - Measure Time to Interactive (TTI) improvement
  - Measure Core Web Vitals (LCP, CLS, FID)
  - _Requirements: 7.1, 8.5, 9.1, 9.3_

- [x] 4.11 Checkpoint - Verify performance improvements
  - Run Lighthouse audit and verify performance score
  - Test on slow 3G network and verify acceptable load time
  - Verify animations work and respect motion preferences
  - Verify lazy loading works (images below fold don't download immediately)
  - Check that all images have meaningful alt text
  - _Requirements: 7.1, 7.2, 8.1, 9.1, 9.2_

---

### Phase 5: Integration and Final Testing

- [ ] 5.1 Run full test suite
  - Run all unit tests
  - Run all property tests
  - Run all integration tests
  - Verify no test failures or warnings
  - _Requirements: 1.1, 2.1, 4.1, 7.1, 8.1_

- [ ] 5.2 Run Lighthouse audit and accessibility checks
  - Run Lighthouse in Chrome DevTools
  - Target: Performance > 85, Accessibility > 95, Best Practices > 90
  - Run axe accessibility audit
  - Fix any remaining critical issues
  - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3, 7.1, 8.1_

- [ ] 5.3 Test on multiple browsers and devices
  - Test on Chrome, Firefox, Safari desktop
  - Test on mobile (iOS Safari, Chrome Mobile)
  - Verify no visual regressions
  - Verify chat widget works on mobile
  - _Requirements: All_

- [ ] 5.4 Test keyboard and screen reader navigation
  - Test Tab navigation through entire page
  - Test screen reader with NVDA/JAWS simulator
  - Verify all interactive elements are announced
  - Verify focus indicators are visible
  - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.6_

- [ ] 5.5 Final integration verification
  - Verify hydration fixes don't break chat persistence
  - Verify accessibility improvements work with performance optimizations
  - Verify chat widget enhancements work after lazy loading
  - Ensure all components work together cohesively
  - _Requirements: 1.1, 3.1, 4.1, 7.1, 8.1, 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 5.6 Documentation and code cleanup
  - Add JSDoc comments to all new hooks and components
  - Document motion preference usage pattern
  - Document chat persistence lifecycle
  - Update README with accessibility features
  - _Requirements: All_

- [ ] 5.7 Final checkpoint - All improvements complete
  - Verify no console errors or warnings
  - Verify all requirements are implemented
  - Verify Lighthouse scores are acceptable
  - Verify accessibility audit passes
  - Ready for production deployment
  - _Requirements: All_

## Task Dependencies

```
Phase 1: Hydration Fix
  └─ 1.1 → 1.2 → 1.3 → 1.4 → 1.5 (Checkpoint)

Phase 2: Accessibility (Can start after 1.5)
  ├─ 2.1 → 2.2
  ├─ 2.3 → 2.4 → 2.5
  └─ 2.6 → 2.7 (Checkpoint)

Phase 3: Chat Enhancement (Can start after 2.7)
  ├─ 3.1 → 3.2 → 3.3 → 3.4 → 3.5
  ├─ 3.6, 3.7, 3.8 (Optional tests)
  └─ 3.9 (Checkpoint)

Phase 4: Performance (Can start after 2.7, independent of Phase 3)
  ├─ 4.1 → 4.2
  ├─ 4.3 → 4.4 → 4.5
  ├─ 4.6 → 4.7
  ├─ 4.8, 4.9, 4.10 (Optional tests)
  └─ 4.11 (Checkpoint)

Phase 5: Integration (After all phases complete)
  └─ 5.1 → 5.2 → 5.3 → 5.4 → 5.5 → 5.6 → 5.7 (Checkpoint)
```

## Implementation Notes

### Parallel Work Possible

After completing Phase 1 (hydration fix), Phases 2, 3, and 4 can be worked on in parallel as they are mostly independent. However, Phase 5 must come after all other phases.

### Optional Tasks

All tasks marked with `*` are optional testing tasks. The core functionality tasks are mandatory. Optional tasks are valuable but can be deferred if time is limited.

### Checkpoint Tasks

Checkpoints are verification steps that ensure previous tasks are working correctly before proceeding to the next phase. These should be completed before moving forward.

### Testing Strategy

- **Non-optional tests** (without `*`): Must be implemented as part of task completion
- **Optional tests** (with `*`): Provide comprehensive coverage but can be skipped for MVP
- **Manual checkpoints**: Built into each phase to catch integration issues early

## Success Criteria

1. ✅ No hydration mismatch warnings in browser console
2. ✅ Chat messages persist across browser refresh
3. ✅ Accessibility audit passes with 0 critical issues
4. ✅ Typing indicators appear during API calls
5. ✅ Errors are handled gracefully with user-friendly messages
6. ✅ Lighthouse Performance score > 85
7. ✅ All images have meaningful alt text
8. ✅ Animations respect prefers-reduced-motion
9. ✅ Lazy loading defers non-visible resources
10. ✅ All tests pass with 0 failures

