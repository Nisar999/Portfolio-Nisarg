# Design: Landing Page Spaceship Animation

## Overview

This design document outlines the technical implementation of the landing page intro animation. The spaceship animation will be generated as an MP4 video and integrated into the hero section, playing once on page load before the main content fades in.

## Architecture

### Video Generation Pipeline

1. **Create animation in Python** using libraries like Pillow, OpenCV, or Manim
2. **Render spaceship** as SVG or sprite on each frame
3. **Add smoke trail** effect with particle system simulation
4. **Composite** over the header background image
5. **Export** as MP4 with H.264 codec, optimized for web
6. **Store** in public/animations/ directory

### Integration Architecture

```
Page Load
    ↓
Check prefers-reduced-motion
    ├─ If true: Skip animation, show final state
    └─ If false: Play animation video
    ↓
Display full-screen intro video (2 seconds)
    ↓
Animation completes
    ↓
Video element hidden/removed
    ↓
Hero content (text, buttons, image) fades in
    ↓
Page fully interactive
```

## Component Design

### LandingAnimation Component

```typescript
// src/components/LandingAnimation.tsx
interface LandingAnimationProps {
  onComplete?: () => void;
  skipAnimation?: boolean;
}

export function LandingAnimation({ onComplete, skipAnimation }: LandingAnimationProps) {
  const prefersReducedMotion = useMotionPreference();
  const [isPlaying, setIsPlaying] = useState(true);

  if (skipAnimation || prefersReducedMotion) {
    return null; // Skip animation
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9998] bg-black"
    >
      <video
        src="/animations/spaceship-intro.mp4"
        autoPlay
        onEnded={() => {
          setIsPlaying(false);
          onComplete?.();
        }}
        className="w-full h-full object-cover"
        muted
        playsInline
      />
    </motion.div>
  );
}
```

### Hero Section Integration

```typescript
// Modified Hero.tsx
export default function Hero() {
  const [showAnimation, setShowAnimation] = useState(true);

  return (
    <>
      {showAnimation && (
        <LandingAnimation
          onComplete={() => setShowAnimation(false)}
          skipAnimation={false}
        />
      )}
      
      {!showAnimation && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="..." // Rest of hero section
        >
          {/* Hero content */}
        </motion.section>
      )}
    </>
  );
}
```

## Animation Specifications

### Spaceship Properties

- **Origin**: Top-left corner (off-screen, approximately -100px, -100px)
- **Destination**: Positioned in header background (approximately 100px, 100px from top-left)
- **Duration**: 2 seconds
- **Easing**: ease-in-out (start slow, speed up, slow down at end)
- **Scale**: Full screen (1920x1080 minimum)

### Smoke Trail Effect

- **Particle Count**: 30-50 particles per second
- **Particle Lifetime**: 1-2 seconds (fade out over time)
- **Particle Size**: 20-50px diameter, gaussian blur
- **Color**: Semi-transparent gray/white (#888888 to #CCCCCC, alpha 0.3-0.7)
- **Spawn Pattern**: Along spaceship trajectory, trailing behind
- **Physics**: Gravity and wind simulation for natural drift

### Video Specifications

- **Format**: MP4 (H.264 video codec, AAC audio)
- **Resolution**: 1920x1080 (16:9 aspect ratio)
- **Frame Rate**: 60 FPS (smooth animation)
- **Duration**: 2.0 seconds (exactly)
- **Background**: Transparent or using header.png as backdrop
- **File Size**: Target <3MB (for quick load)
- **Color Space**: sRGB with alpha channel support

## Implementation Approach

### Step 1: Generate Animation Video

Using Python script with OpenCV or FFmpeg:
- Load header.png as background
- Create spaceship sprite/SVG
- Animate spaceship from top-left to resting position
- Apply smoke trail particle effects
- Composite layers
- Export as MP4

### Step 2: Create LandingAnimation Component

- Accept `onComplete` callback
- Check `prefers-reduced-motion` preference
- Render full-screen video player
- Handle video end event
- Clean up after animation completes

### Step 3: Integrate with Hero

- Replace Preloader with LandingAnimation
- Hide hero content during animation
- Fade in content after animation ends
- Ensure accessibility (focus management, skip option)

### Step 4: Optimization

- Preload video in head for faster playback
- Use minimal dimensions that still look crisp
- Compress video for web delivery
- Implement fallback for unsupported browsers

## Correctness Properties

### Property 1: Animation Duration Consistency

*For any* render of the animation, the total playback duration SHALL be exactly 2.0 seconds, regardless of device performance.

**Validates**: Requirement 1.6

### Property 2: Spaceship Final Position Invariance

*After* the animation completes, the spaceship position SHALL remain unchanged (persist as part of background) on subsequent page interactions.

**Validates**: Requirement 1.4

### Property 3: Motion Preference Respect

*When* prefers-reduced-motion is enabled, the animation SHALL not play (skipped entirely or shown as static final frame).

**Validates**: Requirement 5.4, 6.3

## Error Handling

### Video Load Failures

- **Error**: Video file fails to download
- **Handling**: Display static final spaceship image, then show hero content
- **Recovery**: Transparent fallback doesn't block page

### Browser Compatibility

- **Error**: HTML5 video not supported
- **Handling**: Fallback to animated GIF or static image
- **Detection**: Use feature detection, not user agent

### Performance

- **Error**: Animation causes jank/frame drops
- **Handling**: Reduce particle count or disable particles
- **Detection**: Monitor requestAnimationFrame timing

## Testing Strategy

### Unit Tests
- LandingAnimation component renders and unmounts correctly
- onComplete callback fires at end of video
- prefers-reduced-motion check works
- Video element loads and plays

### Integration Tests
- Animation plays on page load
- Hero content appears after animation
- Page remains interactive during animation
- Spaceship visible in background after completion

### Manual Testing Checklist
- [ ] Animation plays on page load (no button click needed)
- [ ] Spaceship visible from start to finish
- [ ] Smoke trail follows spaceship naturally
- [ ] Animation duration is exactly 2 seconds
- [ ] Hero content fades in smoothly after
- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Works on mobile/tablet with proper scaling
- [ ] Skips animation when prefers-reduced-motion is set
- [ ] Video file size is <3MB
- [ ] No console errors or warnings

## File Structure

```
public/
├── header.png                          (background for animation)
└── animations/
    └── spaceship-intro.mp4             (generated animation video)

src/
├── components/
│   ├── LandingAnimation.tsx            (animation component)
│   └── Hero.tsx                        (modified to use animation)
├── hooks/
│   └── useMotionPreference.ts          (already exists)
└── lib/
    └── animation-config.ts             (animation settings)
```

