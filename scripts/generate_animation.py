#!/usr/bin/env python3
"""
Generate landing page spaceship intro animation video.
Creates an MP4 with a spaceship flying from top-left to its resting position
with a smoke trail effect.
"""

import os
import cv2
import numpy as np
from pathlib import Path
from PIL import Image, ImageDraw
import random

# Configuration
DURATION_SECONDS = 2.0
FPS = 60
TOTAL_FRAMES = int(DURATION_SECONDS * FPS)  # 120 frames
VIDEO_WIDTH = 1920
VIDEO_HEIGHT = 1080

# Spaceship properties
SPACESHIP_START_X = -150  # Off-screen top-left
SPACESHIP_START_Y = -150
SPACESHIP_END_X = 150    # Resting position
SPACESHIP_END_Y = 150
SPACESHIP_SIZE = 120     # pixels

# Smoke properties
PARTICLES_PER_FRAME = 15
PARTICLE_MAX_LIFETIME = 60  # frames
PARTICLE_SIZE_RANGE = (15, 40)
PARTICLE_OPACITY_RANGE = (0.2, 0.6)

def ease_in_out_cubic(t):
    """Easing function: cubic ease-in-out"""
    t = max(0, min(1, t))
    if t < 0.5:
        return 4 * t * t * t
    else:
        return 1 - pow(-2 * t + 2, 3) / 2

def interpolate_position(progress):
    """Calculate spaceship position at given progress (0.0 to 1.0)"""
    eased = ease_in_out_cubic(progress)
    x = SPACESHIP_START_X + (SPACESHIP_END_X - SPACESHIP_START_X) * eased
    y = SPACESHIP_START_Y + (SPACESHIP_END_Y - SPACESHIP_START_Y) * eased
    return (int(x), int(y))

def create_spaceship_sprite():
    """Create a simple spaceship sprite (SVG-style)"""
    sprite = Image.new('RGBA', (SPACESHIP_SIZE, SPACESHIP_SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(sprite)
    
    # Draw a simple spaceship (triangle-like shape)
    points = [
        (SPACESHIP_SIZE // 2, 10),           # Top (nose)
        (SPACESHIP_SIZE - 15, SPACESHIP_SIZE - 15),  # Bottom-right
        (SPACESHIP_SIZE // 2, SPACESHIP_SIZE - 25),  # Bottom-center
        (15, SPACESHIP_SIZE - 15),           # Bottom-left
    ]
    
    # Draw main body (light blue)
    draw.polygon(points, fill=(76, 195, 255, 255), outline=(50, 150, 220, 255))
    
    # Draw window/cockpit (darker blue)
    window_center = (SPACESHIP_SIZE // 2, SPACESHIP_SIZE // 3)
    window_size = 15
    draw.ellipse(
        [
            (window_center[0] - window_size, window_center[1] - window_size),
            (window_center[0] + window_size, window_center[1] + window_size),
        ],
        fill=(30, 100, 180, 255),
        outline=(50, 150, 220, 255)
    )
    
    return sprite

def create_smoke_particle(pos_x, pos_y):
    """Create a smoke particle"""
    lifetime = random.randint(20, PARTICLE_MAX_LIFETIME)
    size = random.randint(*PARTICLE_SIZE_RANGE)
    opacity = random.uniform(*PARTICLE_OPACITY_RANGE)
    drift_x = random.uniform(-2, 2)
    drift_y = random.uniform(0.5, 3)  # Bias downward
    
    return {
        'x': pos_x,
        'y': pos_y,
        'size': size,
        'opacity': opacity,
        'lifetime': lifetime,
        'age': 0,
        'drift_x': drift_x,
        'drift_y': drift_y,
    }

def render_particles(frame, particles):
    """Render all particles onto frame"""
    for particle in particles:
        # Update particle age and position
        particle['age'] += 1
        particle['x'] += particle['drift_x']
        particle['y'] += particle['drift_y']
        
        # Calculate current opacity (fade out)
        fade_progress = particle['age'] / particle['lifetime']
        current_opacity = particle['opacity'] * (1 - fade_progress)
        
        # Draw particle (semi-transparent circle)
        gray_value = int(150 + 100 * (1 - fade_progress))  # Lighter as it fades
        color = (gray_value, gray_value, gray_value)
        
        cv2.circle(
            frame,
            (int(particle['x']), int(particle['y'])),
            particle['size'] // 2,
            color,
            -1,
            cv2.LINE_AA
        )
        
        # Blur the particle area slightly
        blur_size = particle['size']
        if blur_size > 0 and blur_size < 200:
            x_start = max(0, int(particle['x']) - blur_size)
            x_end = min(VIDEO_WIDTH, int(particle['x']) + blur_size)
            y_start = max(0, int(particle['y']) - blur_size)
            y_end = min(VIDEO_HEIGHT, int(particle['y']) + blur_size)
            
            roi = frame[y_start:y_end, x_start:x_end]
            if roi.size > 0:
                blurred = cv2.GaussianBlur(roi, (5, 5), 0)
                frame[y_start:y_end, x_start:x_end] = cv2.addWeighted(roi, 0.5, blurred, 0.5, 0)

def main():
    """Main animation generation function"""
    print("🚀 Generating spaceship intro animation...")
    
    # Load background
    header_path = Path(__file__).parent.parent / 'public' / 'header.png'
    if not header_path.exists():
        print(f"❌ Header image not found at {header_path}")
        print("Creating solid background instead...")
        background = np.zeros((VIDEO_HEIGHT, VIDEO_WIDTH, 3), dtype=np.uint8)
        # Add a gradient background
        for y in range(VIDEO_HEIGHT):
            ratio = y / VIDEO_HEIGHT
            background[y, :] = [
                int(20 * ratio),
                int(30 * ratio),
                int(50 * ratio)
            ]
    else:
        print(f"✓ Loaded background: {header_path}")
        img = Image.open(header_path).convert('RGB')
        # Resize to video dimensions
        img = img.resize((VIDEO_WIDTH, VIDEO_HEIGHT), Image.Resampling.LANCZOS)
        background = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    
    # Create spaceship sprite
    spaceship = create_spaceship_sprite()
    
    # Create output directory
    output_dir = Path(__file__).parent.parent / 'public' / 'animations'
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / 'spaceship-intro.mp4'
    
    # Setup video writer
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(
        str(output_path),
        fourcc,
        FPS,
        (VIDEO_WIDTH, VIDEO_HEIGHT)
    )
    
    if not out.isOpened():
        print("❌ Failed to open video writer")
        return False
    
    print(f"✓ Video writer initialized: {VIDEO_WIDTH}x{VIDEO_HEIGHT}@{FPS}fps, {TOTAL_FRAMES} frames")
    
    # Active particles
    particles = []
    
    # Generate frames
    for frame_num in range(TOTAL_FRAMES):
        progress = frame_num / TOTAL_FRAMES
        
        # Create frame copy
        frame = background.copy()
        
        # Calculate spaceship position
        ship_pos = interpolate_position(progress)
        
        # Spawn new smoke particles
        if frame_num % 1 == 0:  # Every frame
            for _ in range(PARTICLES_PER_FRAME):
                # Offset particles slightly behind spaceship
                offset_x = random.randint(-20, 20)
                offset_y = random.randint(-20, 20)
                particle = create_smoke_particle(
                    ship_pos[0] - 40 + offset_x,
                    ship_pos[1] - 40 + offset_y
                )
                particles.append(particle)
        
        # Render particles
        render_particles(frame, particles)
        
        # Remove dead particles
        particles = [p for p in particles if p['age'] < p['lifetime']]
        
        # Draw spaceship
        try:
            # Convert PIL spaceship to OpenCV format
            spaceship_cv = cv2.cvtColor(np.array(spaceship), cv2.COLOR_RGBA2BGR)
            
            # Calculate position in frame
            ship_x = ship_pos[0]
            ship_y = ship_pos[1]
            half_size = SPACESHIP_SIZE // 2
            
            x1 = max(0, ship_x - half_size)
            y1 = max(0, ship_y - half_size)
            x2 = min(VIDEO_WIDTH, ship_x + half_size)
            y2 = min(VIDEO_HEIGHT, ship_y + half_size)
            
            src_x1 = max(0, half_size - ship_x)
            src_y1 = max(0, half_size - ship_y)
            src_x2 = SPACESHIP_SIZE - max(0, (ship_x + half_size) - VIDEO_WIDTH)
            src_y2 = SPACESHIP_SIZE - max(0, (ship_y + half_size) - VIDEO_HEIGHT)
            
            if (x2 - x1) > 0 and (y2 - y1) > 0 and (src_x2 - src_x1) > 0 and (src_y2 - src_y1) > 0:
                src = spaceship_cv[src_y1:src_y2, src_x1:src_x2]
                
                # Blend spaceship with frame
                alpha = src[:, :, 3] / 255.0
                for c in range(3):
                    frame[y1:y2, x1:x2, c] = frame[y1:y2, x1:x2, c] * (1 - alpha) + src[:, :, c] * alpha
        except Exception as e:
            print(f"Warning: Could not render spaceship at frame {frame_num}: {e}")
        
        # Write frame
        out.write(frame)
        
        # Progress indicator
        if (frame_num + 1) % 30 == 0:
            print(f"  Frame {frame_num + 1}/{TOTAL_FRAMES} ({(frame_num + 1) / TOTAL_FRAMES * 100:.1f}%)")
    
    out.release()
    print(f"\n✅ Animation generated successfully!")
    print(f"   Output: {output_path}")
    print(f"   Duration: {DURATION_SECONDS}s @ {FPS}fps")
    print(f"   Resolution: {VIDEO_WIDTH}x{VIDEO_HEIGHT}")
    
    # Print file size
    file_size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"   File size: {file_size_mb:.2f} MB")
    
    return True

if __name__ == '__main__':
    success = main()
    exit(0 if success else 1)
