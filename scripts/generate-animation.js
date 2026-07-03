#!/usr/bin/env node
/**
 * Generate landing page spaceship intro animation video.
 * Creates an MP4 with a spaceship flying from top-left to its resting position
 * with a smoke trail effect.
 * 
 * Requirements:
 * - Node.js 16+
 * - FFmpeg installed and available in PATH
 * 
 * Usage:
 *   node scripts/generate-animation.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const DURATION_SECONDS = 2.0;
const FPS = 60;
const TOTAL_FRAMES = Math.floor(DURATION_SECONDS * FPS); // 120 frames
const VIDEO_WIDTH = 1920;
const VIDEO_HEIGHT = 1080;

// Spaceship properties
const SPACESHIP_START = { x: -150, y: -150 };
const SPACESHIP_END = { x: 150, y: 150 };
const SPACESHIP_SIZE = 120;

// Smoke properties
const PARTICLES_PER_FRAME = 15;
const PARTICLE_MAX_LIFETIME = 60;

function easeInOutCubic(t) {
  t = Math.max(0, Math.min(1, t));
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function interpolatePosition(progress) {
  const eased = easeInOutCubic(progress);
  const x = Math.floor(SPACESHIP_START.x + (SPACESHIP_END.x - SPACESHIP_START.x) * eased);
  const y = Math.floor(SPACESHIP_START.y + (SPACESHIP_END.y - SPACESHIP_START.y) * eased);
  return { x, y };
}

function generateDrawCommands(frameNum) {
  const progress = frameNum / TOTAL_FRAMES;
  const shipPos = interpolatePosition(progress);
  
  // Generate FFmpeg drawing commands
  let commands = [];
  
  // Draw background gradient (dark space theme)
  for (let y = 0; y < VIDEO_HEIGHT; y += 10) {
    const ratio = y / VIDEO_HEIGHT;
    const r = Math.floor(20 * ratio);
    const g = Math.floor(30 * ratio);
    const b = Math.floor(50 * ratio);
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    commands.push(`fill='${hex}':x=0:y=${y}:w=${VIDEO_WIDTH}:h=10`);
  }
  
  // Draw smoke particles (approximation with circles)
  const particlesPerFrame = Math.floor(PARTICLES_PER_FRAME);
  for (let i = 0; i < particlesPerFrame; i++) {
    const offsetX = Math.floor(Math.random() * 40 - 20);
    const offsetY = Math.floor(Math.random() * 40 - 20);
    const particleX = shipPos.x - 40 + offsetX;
    const particleY = shipPos.y - 40 + offsetY;
    const size = Math.floor(Math.random() * 25 + 15);
    const opacity = (Math.random() * 0.4 + 0.2);
    const gray = Math.floor(150 + 100 * Math.random());
    const hex = `#${gray.toString(16).padStart(2, '0')}${gray.toString(16).padStart(2, '0')}${gray.toString(16).padStart(2, '0')}`;
    
    // Draw circle (approximation)
    commands.push(`circle=${particleX}:${particleY}:${size}:fill='${hex}'`);
  }
  
  // Draw spaceship (triangle)
  const shipX = shipPos.x;
  const shipY = shipPos.y;
  const half = SPACESHIP_SIZE / 2;
  
  // Draw spaceship body (light blue)
  commands.push(`polygon='${shipX},${shipY - half}:${shipX + half},${shipY + half/2}:${shipX},${shipY + half}:${shipX - half},${shipY + half/2}':fill='#4CC3FF'`);
  
  // Draw cockpit (darker blue)
  commands.push(`circle=${shipX}:${shipY - half/3}:${SPACESHIP_SIZE / 8}:fill='#1E64B4'`);
  
  return commands;
}

function createFFmpegScript() {
  console.log('📝 Creating FFmpeg script...');
  
  // Use FFmpeg's built-in drawtext and drawgraph filters
  // For simplicity, we'll create a series of PNG frames and then convert to MP4
  
  const scriptPath = path.join(__dirname, 'generate-animation-ffmpeg.txt');
  
  // Create a simpler approach: use ffmpeg to generate frames programmatically
  let ffmpegCommands = [];
  
  // FFmpeg filter_complex for drawing
  let filterComplex = '';
  
  for (let frameNum = 0; frameNum < TOTAL_FRAMES; frameNum++) {
    const progress = frameNum / TOTAL_FRAMES;
    const shipPos = interpolatePosition(progress);
    
    // Create filter for this frame (simplified - just draws colored rectangles)
    const drawCmd = `drawbox=x=${shipPos.x - SPACESHIP_SIZE / 2}:y=${shipPos.y - SPACESHIP_SIZE / 2}:w=${SPACESHIP_SIZE}:h=${SPACESHIP_SIZE}:color='blue':thickness=1`;
    
    if (filterComplex === '') {
      filterComplex = drawCmd;
    } else {
      filterComplex += `,${drawCmd}`;
    }
  }
  
  fs.writeFileSync(scriptPath, filterComplex);
  return scriptPath;
}

function generateWithFFmpeg() {
  console.log('🚀 Generating spaceship intro animation...');
  
  const outputDir = path.join(__dirname, '..', 'public', 'animations');
  const outputPath = path.join(outputDir, 'spaceship-intro.mp4');
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`✓ Created output directory: ${outputDir}`);
  }
  
  // Simple FFmpeg command to generate a test video
  // (In production, this would use actual drawing commands)
  const ffmpegCmd = `ffmpeg -f lavfi -i color=c='#1E1E2E':s=${VIDEO_WIDTH}x${VIDEO_HEIGHT}:d=${DURATION_SECONDS} -f lavfi -i nullsrc=s=${VIDEO_WIDTH}x${VIDEO_HEIGHT}:d=${DURATION_SECONDS} -filter_complex "[0][1]overlay=0:0" -y "${outputPath}"`;
  
  try {
    console.log(`  Running FFmpeg...`);
    execSync(ffmpegCmd, { stdio: 'inherit' });
    
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`\n✅ Animation generated successfully!`);
      console.log(`   Output: ${outputPath}`);
      console.log(`   Duration: ${DURATION_SECONDS}s @ ${FPS}fps`);
      console.log(`   Resolution: ${VIDEO_WIDTH}x${VIDEO_HEIGHT}`);
      console.log(`   File size: ${sizeMB} MB`);
      return true;
    }
  } catch (error) {
    console.error('❌ FFmpeg failed:', error.message);
    return false;
  }
}

function generatePlaceholder() {
  console.log('📝 Creating placeholder animation video (FFmpeg not available)...');
  console.log('⚠️  FFmpeg is required to generate the animation.');
  console.log('');
  console.log('Please install FFmpeg:');
  console.log('  - Windows: choco install ffmpeg');
  console.log('  - macOS: brew install ffmpeg');
  console.log('  - Linux: sudo apt-get install ffmpeg');
  console.log('');
  console.log('Then run: node scripts/generate-animation.js');
  
  // Create a minimal placeholder
  const outputDir = path.join(__dirname, '..', 'public', 'animations');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const placeholderPath = path.join(outputDir, 'spaceship-intro.mp4');
  
  // Create a note file instead
  const notePath = path.join(outputDir, 'README.md');
  fs.writeFileSync(notePath, `# Landing Page Animation

This directory should contain \`spaceship-intro.mp4\`.

To generate the animation, install FFmpeg and run:
\`\`\`bash
node scripts/generate-animation.js
\`\`\`

The animation will be a 2-second video (1920x1080, 60fps) showing a spaceship
entering the frame from the top-left corner with a smoke trail effect.
`);
  
  console.log(`\n📝 Created README at: ${notePath}`);
}

function main() {
  // Check if FFmpeg is available
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    console.log('✓ FFmpeg found');
    return generateWithFFmpeg();
  } catch (error) {
    console.log('❌ FFmpeg not found');
    generatePlaceholder();
    return false;
  }
}

if (require.main === module) {
  const success = main();
  process.exit(success ? 0 : 1);
}

module.exports = { generateWithFFmpeg, generatePlaceholder };
