# Implementation Plan: Landing Page Spaceship Animation

## Overview

This plan breaks down the landing page animation feature into actionable implementation tasks. The approach generates an animation video using Python, then integrates it into the hero section with proper accessibility and performance considerations.

**Implementation Language**: Python (for video generation) + TypeScript with React (for integration)

## Tasks

### Phase 1: Generate Animation Video

- [ ] 1.1 Install Python dependencies for video generation
  - Install: `opencv-python`, `Pillow`, `numpy`
  - Verify installation with: `python scripts/generate_animation.py`
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2_

- [ ] 1.2 Run animation generation script
  - Execute: `python scripts/generate_animation.py`
  - Generates: `public/animations/spaceship-intro.mp4`
  - Verifies file size (<5MB), duration (2 seconds), resolution (1920x1080)
  - _Requirements: 1.1, 4.1, 4.2, 4.3, 4.4_

- [ ] 1.3 Optimize video for web delivery
  - Compress MP4 using FFmpeg if needed
  - Target: <3MB file size
  - Verify: Video plays smoothly in browser
  - _Requirements: 4.4, 6.1, 6.2_

- [ ] 1.4 Checkpoint - Video ready for integration
  - Verify file exists at: `public/animations/spaceship-intro.mp4`
  - Duration exactly 2 seconds
  - Resolution 1920x1080 (or device-appropriate)
  - File size acceptable (<3MB)
  - _Requirements: 4.1, 4.2_

---

### Phase 2: Create LandingAnimation Component

- [ ] 2.1 Create LandingAnimation component
  - Create file: `src/components/LandingAnimation.tsx`
  - Props: `onComplete?: () => void`, `skipAnimation?: boolean`
  - Render full-screen video player
  - Handle video end event with onComplete callback
  - Check `prefers-reduced-motion` and skip if true
  - _Requirements: 1.1, 1.5, 3.1, 5.4, 6.3_

- [ ] 2.2 Add motion preference support
  - Import `useMotionPreference` hook
  - If motion preference enabled: return null (skip animation)
  - If skip prop is true: return null
  - Otherwise: render video player
  - _Requirements: 5.4, 6.3_

- [ ] 2.3 Add accessibility features
  - Video is muted (no audio interruption)
  - Use `aria-hidden="true"` for video element (decorative)
  - Add keyboard support (ESC to skip? optional)
  - Focus management after animation completes
  - _Requirements: 3.3, 6.5_

- [ ] 2.4 Style LandingAnimation component
  - Full-screen overlay positioning (fixed, inset-0, z-index 9998)
  - Black background during load
  - Video scales to fill screen (object-cover)
  - Smooth fade-out transition on exit
  - _Requirements: 3.1, 3.2_

---

### Phase 3: Integrate with Hero Section

- [ ] 3.1 Create integration layer in Hero component
  - Track animation completion state: `showAnimation`
  - Initially true on page load
  - Set to false when LandingAnimation completes
  - _Requirements: 3.3, 3.5_

- [ ] 3.2 Add conditional rendering in Hero
  - Render `<LandingAnimation onComplete={() => setShowAnimation(false)} />`
  - Render hero content only when `!showAnimation`
  - Hero content wrapped in `<motion.section>` with fade-in animation
  - _Requirements: 1.7, 3.3_

- [ ] 3.3 Update Preloader component (deprecate)
  - Preloader is no longer needed (replaced by LandingAnimation)
  - Keep Preloader in layout but ensure it doesn't conflict
  - Or: remove Preloader import from layout if animation covers the intro
  - _Requirements: 3.1, 3.2_

- [ ] 3.4 Test integration on localhost:3000
  - Page loads and animation plays automatically
  - After 2 seconds, hero content fades in
  - Spaceship remains visible in header background
  - No console errors
  - _Requirements: 1.1, 1.4, 3.3_

---

### Phase 4: Cross-Browser and Device Testing

- [ ] 4.1 Test on desktop browsers
  - Chrome (video plays, animation smooth, 60fps)
  - Firefox (video plays, animation smooth)
  - Safari (video plays, animation smooth)
  - Edge (video plays, animation smooth)
  - _Requirements: 5.1, 5.2_

- [ ] 4.2 Test on mobile/tablet
  - iOS Safari (video scales correctly)
  - Android Chrome (video scales correctly)
  - Video does not block page scrolling after completion
  - Touch interactions work correctly
  - _Requirements: 5.3_

- [ ] 4.3 Test with reduced motion preference
  - Set system preference: prefers-reduced-motion
  - Animation should NOT play
  - Hero content should appear immediately
  - Page still fully functional
  - _Requirements: 5.4, 6.3_

- [ ] 4.4 Test fallback scenarios
  - Disable JavaScript: static image visible (or skip animation)
  - Slow network: animation still plays but may take longer
  - Video codec not supported: graceful fallback
  - _Requirements: 5.5, 6.1_

---

### Phase 5: Performance and Optimization

- [ ] 5.1 Verify video preloading
  - Video element has `preload="auto"` attribute
  - Check Network tab: video starts loading before animation plays
  - Video is fully buffered before first frame
  - _Requirements: 6.1, 6.2_

- [ ] 5.2 Check performance metrics
  - Lighthouse Performance score impact (should be minimal)
  - First Contentful Paint (FCP) timing
  - Time to Interactive (TTI) - animation should not block
  - Page should be interactive immediately after animation
  - _Requirements: 6.4_

- [ ] 5.3 Optimize video codec and bitrate
  - Use H.264 video codec (MP4v)
  - Audio track: none (muted)
  - Bitrate: balance quality vs file size
  - Target <3MB total file size
  - _Requirements: 4.1, 4.3, 4.4_

- [ ] 5.4 Monitor frame rate during animation
  - Use Chrome DevTools Performance tab
  - Target: 60fps (no frame drops)
  - GPU acceleration enabled (if available)
  - No jank or stuttering
  - _Requirements: 2.5_

---

### Phase 6: Documentation and Finalization

- [ ] 6.1 Document animation generation process
  - Add comments to `scripts/generate_animation.py`
  - Document: how to regenerate animation
  - Document: configuration options (duration, speed, particles)
  - Update README with animation details
  - _Requirements: All_

- [ ] 6.2 Create animation configuration
  - Create `src/lib/animation-config.ts`
  - Export constants: ANIMATION_DURATION, ANIMATION_ENABLED, etc.
  - Allow easy enable/disable of animation
  - Document all configuration options
  - _Requirements: 3.1_

- [ ] 6.3 Add animation as fallback to Preloader
  - If Preloader is still used: ensure no conflict with LandingAnimation
  - Clear documentation on which component is active
  - Remove or deprecate one if redundant
  - _Requirements: 3.1_

- [ ] 6.4 Final integration checkpoint
  - All tasks completed and tested
  - Page loads and animation plays smoothly
  - Hero content appears after animation
  - Mobile/desktop/accessibility all verified
  - Zero console errors
  - Ready for production
  - _Requirements: All_

---

## Task Dependencies

```
Phase 1: Generate Video
  └─ 1.1 → 1.2 → 1.3 → 1.4 (Checkpoint)

Phase 2: Create Component (Can start after 1.2)
  ├─ 2.1 → 2.2 → 2.3 → 2.4

Phase 3: Integration (After 2.4)
  └─ 3.1 → 3.2 → 3.3 → 3.4 (Checkpoint)

Phase 4: Testing (After 3.4)
  ├─ 4.1 → 4.2 → 4.3 → 4.4

Phase 5: Performance (Can run parallel with Phase 4)
  └─ 5.1 → 5.2 → 5.3 → 5.4

Phase 6: Finalization (After Phase 5)
  └─ 6.1 → 6.2 → 6.3 → 6.4 (Final Checkpoint)
```

## Success Criteria

1. ✅ Animation video generated and <3MB
2. ✅ Video plays on page load without user interaction
3. ✅ Animation duration exactly 2 seconds
4. ✅ Smoke trail effect visible and natural
5. ✅ Hero content fades in after animation
6. ✅ Spaceship remains visible in background after
7. ✅ Works on all major browsers (Chrome, Firefox, Safari, Edge)
8. ✅ Works on mobile/tablet with proper scaling
9. ✅ Skips animation when prefers-reduced-motion is set
10. ✅ No console errors or warnings
11. ✅ Performance not impacted (<1s additional load time)
12. ✅ Fully accessible (keyboard, screen reader compatible)

## Implementation Notes

### Python Environment

Install dependencies:
```bash
pip install opencv-python Pillow numpy
```

Run generation:
```bash
python scripts/generate_animation.py
```

### Component Integration

The LandingAnimation component should:
- Load video asynchronously
- Not block page interaction
- Play automatically on mount
- Call onComplete when finished
- Respect prefers-reduced-motion

### Fallback Strategy

If video fails to load:
- Display static spaceship image at final position
- Fade in hero content after short delay
- Don't block the page

### Performance Considerations

- Preload video in `<link rel="preload">` in HTML head
- Use `autoPlay` and `muted` for instant playback
- Consider lazy-loading if animation can be skipped
- Monitor Core Web Vitals impact

