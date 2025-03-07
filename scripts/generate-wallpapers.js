const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const WALLPAPER_COUNT = 30;
const WIDTH = 1080;
const HEIGHT = 1920;

const COLORS = [
    ['#1E88E5', '#43A047'], // Blue to Green
    ['#E53935', '#FB8C00'], // Red to Orange
    ['#8E24AA', '#1E88E5'], // Purple to Blue
    ['#43A047', '#FFD600'], // Green to Yellow
    ['#FB8C00', '#E53935'], // Orange to Red
];

function generateWallpaperSVG(index, motivationalText) {
    const [color1, color2] = COLORS[index % COLORS.length];
    const angle = (index * 45) % 360;

    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${angle} .5 .5)">
                <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
            </linearGradient>
            <filter id="shadow">
                <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="black" flood-opacity="0.3"/>
            </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <g filter="url(#shadow)">
            <text x="50%" y="50%" font-family="Arial" font-size="36" fill="white" text-anchor="middle">
                ${motivationalText}
            </text>
            <text x="50%" y="95%" font-family="Arial" font-size="48" font-weight="bold" fill="white" text-anchor="middle">
                Carbonetrix
            </text>
        </g>
        
        <!-- Dynamic pattern -->
        <path d="M0 ${HEIGHT * 0.8} 
                C ${WIDTH * 0.3} ${HEIGHT * 0.7} ${WIDTH * 0.7} ${HEIGHT * 0.9} ${WIDTH} ${HEIGHT * 0.8}"
              fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="5"/>
    </svg>`;
}

async function generateWallpaper(index) {
    const dir = path.join(__dirname, '..', 'src', 'assets', 'wallpapers');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const motivationalText = require('../src/constants/texts').MOTIVATIONAL_TEXTS[index];
    const svg = generateWallpaperSVG(index, motivationalText);
    const outputPath = path.join(dir, `wallpaper_${index + 1}.jpg`);

    try {
        await sharp(Buffer.from(svg))
            .jpeg({
                quality: 90,
                chromaSubsampling: '4:4:4'
            })
            .toFile(outputPath);
        console.log(`Generated wallpaper_${index + 1}.jpg`);
    } catch (error) {
        console.error(`Error generating wallpaper ${index + 1}:`, error);
    }
}

async function generateAllWallpapers() {
    console.log('Generating wallpapers...');
    for (let i = 0; i < WALLPAPER_COUNT; i++) {
        await generateWallpaper(i);
    }
    console.log('Wallpaper generation complete!');
}

generateAllWallpapers().catch(console.error); 