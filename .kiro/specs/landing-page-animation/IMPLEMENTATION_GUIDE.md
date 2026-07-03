# Landing Page Animation Implementation Guide

## Quick Start

The landing page animation spec is complete and ready for implementation. Follow these steps:

### Step 1: Generate the Animation Video

The animation video can be generated using one of two methods:

#### Option A: Using Python (Recommended for Full Control)

```bash
# Install dependencies
pip install opencv-python Pillow numpy

# Generate animation
python scripts/generate_animation.py
```

**Output**: `public/animations/spaceship-intro.mp4` (2 seconds, 1920x1080, ~3MB)

#### Option B: Using Node.js (If Python unavailable)

```bash
# Generate animation (requires FFmpeg installed)
node scripts/generate-animation.js
```

**Requirements**: FFmpeg must be installed
- Windows: `choco install ffmpeg`
- macOS: `brew install ffmpeg`
- Linux: `sudo apt-get install ffmpeg`

### Step 2: Review the Specification

All documentation is in `.kiro/specs/landing-page-animation/`:

- **requirements.md**: What the animation must do (6 requirements)
- **design.md**: How it's implemented (architecture, components, properties)
- **tasks.md**: 23 implementation tasks organized in 6 phases
- **.config.kiro**: Spec metadata and configuration

### Step 3: Start Implementation

Follow the tasks in order:

1. **Phase 1**: Generate video (1.1-1.4)
2. **Phase 2**: Create LandingAnimation component (2.1-2.4)
3. **Phase 3**: Integrate with Hero section (3.1-3.4)
4. **Phase 4**: Cross-browser testing (4.1-4.4)
5. **Phase 5**: Performance optimization (5.1-5.4)
6. **Phase 6**: Documentation & finalization (6.1-6.4)

---

## Animation Overview

### What It Does

- **Duration**: Exactly 2 seconds
- **Start**: Spaceship off-screen at top-left corner (-150, -150)
- **End**: Spaceship at resting position (150, 150)
- **Effect**: Smooth animation with cubic ease-in-out
- **Smoke Trail**: 15 particles per frame with fade-out effect
- **Playback**: Automatic on page load, once only
- **Integration**: Plays before Hero content appears

### Technical Specs

```
Format:     MP4 (H.264 video codec)
Resolution: 1920x1080 (16:9 aspect ratio)
Frame Rate: 60 FPS
Duration:   2.0 seconds (exactly 120 frames)
File Size:  Target <3MB
Background: Your header.png or gradient
Codec:      H.264 (h264)
Audio:      None (muted)
```

---

## Component Architecture

### New Component: LandingAnimation

**Location**: `src/components/LandingAnimation.tsx`

```typescript
interface LandingAnimationProps {
  onComplete?: () => void;        // Called when animation ends
  skipAnimation?: boolean;         // Force skip animation
}

export function LandingAnimation({ onComplete, skipAnimation }: LandingAnimationProps) {
  const prefersReducedMotion = useMotionPreference();
  
  // Skip if motion preference or skipAnimation prop
  if (skipAnimation || prefersReducedMotion) {
    return null;
  }
  
  // Full-screen video player
  return (
    <motion.div className="fixed inset-0 z-[9998] bg-black">
      <video
        src="/animations/spaceship-intro.mp4"
        autoPlay
        onEnded={() => onComplete?.()}
        className="w-full h-full object-cover"
        muted
        playsInline
        aria-hidden="true"
      />
    </motion.div>
  );
}
```

### Modified: Hero Component

**Location**: `src/components/Hero.tsx`

```typescript
export default function Hero() {
  const [showAnimation, setShowAnimation] = useState(true);

  return (
    <>
      {showAnimation && (
        <LandingAnimation
          onComplete={() => setShowAnimation(false)}
        />
      )}
      
      {!showAnimation && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen..."
        >
          {/* Existing hero content */}
        </motion.section>
      )}
    </>
  );
}
```

---

## File Structure

After implementation, you'll have:

```
public/
├── header.png                      (existing background)
└── animations/
    └── spaceship-intro.mp4         (NEW - generated animation)

src/
├── components/
│   ├── LandingAnimation.tsx        (NEW - animation component)
│   ├── Hero.tsx                    (MODIFIED - integrates animation)
│   └── ...
├── hooks/
│   ├── useMotionPreference.ts      (existing - already created)
│   ├── useMount.ts                 (existing - already created)
│   └── ...
└── lib/
    └── animation-config.ts         (NEW - animation settings)

scripts/
├── generate_animation.py           (NEW - Python generator)
└── generate-animation.js           (NEW - Node.js fallback)

.kiro/specs/landing-page-animation/
├── requirements.md                 (specification)
├── design.md                       (technical design)
├── tasks.md                        (implementation plan)
├── .config.kiro                    (spec config)
└── IMPLEMENTATION_GUIDE.md         (this file)
```

---

## Key Implementation Details

### 1. Motion Preference Support

Automatically skips animation if user has `prefers-reduced-motion` enabled:

```typescript
const prefersReducedMotion = useMotionPreference();

if (prefersReducedMotion) {
  // Skip animation, show final state immediately
  return null;
}
```

### 2. Full-Screen Overlay

Animation plays on top of everything:

```css
position: fixed;
inset: 0;
z-index: 9998;  /* Above page content, below modals */
background-color: black;  /* During video load */
```

### 3. Accessibility

- Video is decorative: `aria-hidden="true"`
- Auto-plays but doesn't capture focus
- Page is interactive immediately after
- Respects motion preferences
- Keyboard navigation unaffected

### 4. Performance

- Video preloads asynchronously
- Doesn't block page interaction
- Muted (no audio downloads)
- Scales automatically to screen size
- 60fps smooth playback

---

## Testing Checklist

### Functionality
- [ ] Animation plays automatically on page load
- [ ] Duration is exactly 2 seconds
- [ ] Spaceship visible from start to finish
- [ ] Smoke trail follows spaceship
- [ ] Hero content appears after animation
- [ ] Spaceship remains visible in background after
- [ ] Hero content fully interactive

### Browsers
- [ ] Chrome (60fps, smooth)
- [ ] Firefox (60fps, smooth)
- [ ] Safari (60fps, smooth)
- [ ] Edge (60fps, smooth)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Accessibility
- [ ] Works with keyboard navigation
- [ ] Works with screen readers
- [ ] Skips animation when prefers-reduced-motion set
- [ ] No console errors or warnings
- [ ] Page accessible immediately after

### Performance
- [ ] Lighthouse score not negatively impacted
- [ ] Time to Interactive (TTI) normal
- [ ] First Contentful Paint (FCP) normal
- [ ] Video file size <3MB
- [ ] 60fps throughout animation
- [ ] No page jank or stuttering

### Mobile/Responsive
- [ ] Animation scales on mobile screens
- [ ] Works on tablet (landscape/portrait)
- [ ] Touch interactions work normally
- [ ] Video plays on iOS (no autoplay issues)
- [ ] Video plays on Android

---

## Troubleshooting

### Video not playing

**Problem**: Animation video doesn't play
**Solutions**:
1. Check video file exists: `public/animations/spaceship-intro.mp4`
2. Check video is valid MP4: Try playing in VLC or browser directly
3. Check browser supports H.264 codec (all modern browsers do)
4. Check Content-Type header is `video/mp4`

### Animation doesn't show

**Problem**: Page loads without animation
**Solutions**:
1. Check `showAnimation` state is true initially
2. Check `prefers-reduced-motion` is false
3. Check video `autoPlay` and `muted` attributes set
4. Check z-index is high enough (9998)
5. Check no CSS conflicts hiding the overlay

### Performance issues

**Problem**: Animation stutters or frame drops
**Solutions**:
1. Ensure GPU acceleration enabled (DevTools → Rendering)
2. Reduce particle count in animation generation
3. Compress video more aggressively
4. Check CPU not maxed out during animation
5. Try disabling other animations during animation

### Mobile autoplay fails

**Problem**: Video doesn't autoplay on mobile
**Solutions**:
1. Ensure `muted` attribute is set (required for autoplay)
2. Ensure `playsInline` attribute is set (iOS Safari)
3. Check browser autoplay policy (some mobile browsers block it)
4. Provide manual play button as fallback

---

## Customization

### Modify Animation Duration

Edit `generate_animation.py` or `generate-animation.js`:

```python
DURATION_SECONDS = 2.0  # Change to desired duration
```

### Modify Spaceship Position

Edit `generate_animation.py`:

```python
SPACESHIP_START_X = -150  # Starting position
SPACESHIP_START_Y = -150
SPACESHIP_END_X = 150    # Ending position
SPACESHIP_END_Y = 150
```

### Modify Particle Effect

Edit `generate_animation.py`:

```python
PARTICLES_PER_FRAME = 15          # More = more smoke
PARTICLE_MAX_LIFETIME = 60        # Higher = longer trails
PARTICLE_SIZE_RANGE = (15, 40)    # Particle sizes
PARTICLE_OPACITY_RANGE = (0.2, 0.6)  # Transparency
```

### Disable Animation

Set `skipAnimation={true}` in LandingAnimation:

```typescript
<LandingAnimation
  onComplete={() => setShowAnimation(false)}
  skipAnimation={true}  // Disable animation
/>
```

Or disable in `animation-config.ts`:

```typescript
export const ANIMATION_ENABLED = false;
```

---

## Phase 5 Completion Summary

This landing page animation is part of Phase 5 (Integration & Finalization) of the portfolio improvements.

### What's Included

- ✅ Complete specification (requirements, design, tasks)
- ✅ Animation generation scripts (Python + Node.js)
- ✅ Component architecture documented
- ✅ Integration pattern shown
- ✅ Testing checklist provided
- ✅ Troubleshooting guide included
- ✅ Customization options documented

### What's Next

1. Generate the animation video
2. Create the LandingAnimation component
3. Integrate with Hero section
4. Test across browsers and devices
5. Optimize and finalize

---

## Support

For questions or issues:

1. Check requirements.md for feature specifications
2. Check design.md for technical details
3. Check tasks.md for implementation steps
4. Review this guide for troubleshooting

All documentation is self-contained in `.kiro/specs/landing-page-animation/`

Happy implementing! 🚀
