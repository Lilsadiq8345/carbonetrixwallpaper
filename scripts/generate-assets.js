const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const https = require('https');

// Professional images related to sustainability and green technology
const IMAGE_URLS = [
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e',  // Sustainability
  'https://images.unsplash.com/photo-1518005020951-eccb494ad742',  // Green Building
  'https://images.unsplash.com/photo-1509391366360-2e959784a276',  // Renewable Energy
  'https://images.unsplash.com/photo-1511497584788-876760111969',  // Nature Conservation
  'https://images.unsplash.com/photo-1519999482648-25049ddd37b1',  // Smart City
];

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(`${url}?w=1080&h=1920&fit=crop&q=80`, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

async function processWallpaper(imageBuffer, index) {
  const outputPath = path.join(__dirname, '../src/assets/wallpapers', `${getWallpaperName(index)}.jpg`);

  await sharp(imageBuffer)
    .resize(1080, 1920, {
      fit: 'cover',
      position: 'center'
    })
    .modulate({
      brightness: 0.9,  // Slightly darker for better text visibility
      saturation: 1.2   // Slightly more vibrant
    })
    .jpeg({
      quality: 90,
      progressive: true
    })
    .toFile(outputPath);
}

function getWallpaperName(index) {
  const names = [
    'sustainability1',
    'green-building1',
    'renewable-energy1',
    'nature-conservation1',
    'smart-city1'
  ];
  return names[index];
}

async function generateLogo() {
  const width = 400;
  const height = 100;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#2d936c;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1a5f7a;stop-opacity:1" />
        </linearGradient>
      </defs>
      <text x="50%" y="50%" font-family="Arial" font-size="48" 
        fill="url(#logoGradient)" text-anchor="middle" dominant-baseline="middle"
        style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3));">
        Carbonetrix
      </text>
    </svg>
  `;

  const outputPath = path.join(__dirname, '../src/assets', 'carbonetrix-logo.png');

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);
}

async function main() {
  // Create directories if they don't exist
  const dirs = [
    path.join(__dirname, '../src/assets'),
    path.join(__dirname, '../src/assets/wallpapers'),
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Download and process wallpapers
  console.log('Downloading and processing wallpapers...');
  for (let i = 0; i < IMAGE_URLS.length; i++) {
    const imageBuffer = await downloadImage(IMAGE_URLS[i]);
    await processWallpaper(imageBuffer, i);
    console.log(`Processed wallpaper ${i + 1} of ${IMAGE_URLS.length}`);
  }

  // Generate logo
  console.log('Generating logo...');
  await generateLogo();

  console.log('Assets generated successfully!');
}

main().catch(console.error); 