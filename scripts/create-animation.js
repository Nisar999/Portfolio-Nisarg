#!/usr/bin/env node
/**
 * Create landing animation using Canvas and FFmpeg
 * Creates a spaceship that flies from top-left to position with smoke trail
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const WIDTH = 1920;
const HEIGHT = 1080;
const DURATION_SECONDS = 2;
const FPS = 60;
const TOTAL_FRAMES = DURATION_SECONDS * FPS;

function easeInOutCubic(t) {
  t = Math.max(0, Math.min(1, t));
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function interpolatePosition(progress) {
  const eased = easeInOutCubic(progress);
  const x = -150 + (150 - (-150)) * eased;
  const y = -150 + (150 - (-150)) * eased;
  return { x: Math.floor(x), y: Math.floor(y) };
}

function drawSpaceship(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  
  // Draw spaceship body (light blue)
  ctx.fillStyle = '#4CC3FF';
  ctx.strokeStyle = '#3296D1';
  ctx.lineWidth = 2;
  
  // Triangle body
  ctx.beginPath();
  ctx.moveTo(0, -size/2);
  ctx.lineTo(size/2, size/4);
  ctx.lineTo(0, size/2);
  ctx.lineTo(-size/2, size/4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Cockpit (darker blue)
  ctx.fillStyle = '#1E64B4';
  ctx.beginPath();
  ctx.arc(0, -size/6, size/8, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

function drawSmoke(ctx, particles) {
  particles.forEach(p => {
    const alpha = (1 - p.age / p.lifetime) * p.opacity;
    ctx.fillStyle = `rgba(120, 120, 120, ${alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function generateFrames() {
  console.log('Generating animation frames...');
  
  const outputDir = path.join(__dirname, '..', 'public', 'animations');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const framesDir = path.join(outputDir, 'frames');
  if (!fs.existsSync(framesDir)) {
    fs.mkdirSync(framesDir, { recursive: true });
  }
  
  const particles = [];
  
  for (let frameNum = 0; frameNum < TOTAL_FRAMES; frameNum++) {
    const progress = frameNum / TOTAL_FRAMES;
    const shipPos = interpolatePosition(progress);
    
    // Create canvas
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');
    
    // Draw background gradient (dark space)
    const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, '#0a0a14');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Add some stars (optional)
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) {
      const x = (frameNum * 0.1 + i * 38.4) % WIDTH;
      const y = (i * 21.6) % HEIGHT;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    
    // Spawn new particles
    for (let i = 0; i < 15; i++) {
      const offsetX = (Math.random() - 0.5) * 40;
      const offsetY = (Math.random() - 0.5) * 40;
      particles.push({
        x: shipPos.x - 60 + offsetX,
        y: shipPos.y - 60 + offsetY,
        size: Math.random() * 25 + 15,
        opacity: Math.random() * 0.4 + 0.2,
        lifetime: 60,
        age: 0,
        driftX: (Math.random() - 0.5) * 2,
        driftY: Math.random() * 2,
      });
    }
    
    // Update particles
    particles.forEach(p => {
      p.age++;
      p.x += p.driftX;
      p.y += p.driftY;
    });
    
    // Remove dead particles
    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].age >= particles[i].lifetime) {
        particles.splice(i, 1);
      }
    }
    
    // Draw smoke
    drawSmoke(ctx, particles);
    
    // Draw spaceship
    drawSpaceship(ctx, shipPos.x, shipPos.y, 120);
    
    // Save frame
    const framePath = path.join(framesDir, `frame_${frameNum.toString().padStart(4, '0')}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(framePath, buffer);
    
    if ((frameNum + 1) % 30 === 0) {
      console.log(`  Generated ${frameNum + 1}/${TOTAL_FRAMES} frames`);
    }
  }
  
  return framesDir;
}

function createVideo(framesDir) {
  console.log('Creating video from frames...');
  
  const outputPath = path.join(framesDir, '..', 'spaceship-intro.mp4');
  const framePattern = path.join(framesDir, 'frame_%04d.png');
  
  try {
    // Create video using FFmpeg
    const cmd = `ffmpeg -framerate ${FPS} -i "${framePattern}" -c:v libx264 -pix_fmt yuv420p -y "${outputPath}"`;
    execSync(cmd, { stdio: 'inherit' });
    
    const stats = fs.statSync(outputPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`\n✅ Animation created successfully!`);
    console.log(`   Output: ${outputPath}`);
    console.log(`   Duration: ${DURATION_SECONDS}s @ ${FPS}fps`);
    console.log(`   Resolution: ${WIDTH}x${HEIGHT}`);
    console.log(`   File size: ${sizeMB} MB`);
    
    // Clean up frames
    console.log('Cleaning up frames...');
    execSync(`rm -r "${framesDir}"`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to create video:', error.message);
    return false;
  }
}

function main() {
  try {
    // Check for canvas
    require('canvas');
  } catch (e) {
    console.error('❌ canvas package not installed');
    console.log('Install with: npm install canvas');
    process.exit(1);
  }
  
  try {
    const framesDir = generateFrames();
    const success = createVideo(framesDir);
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
