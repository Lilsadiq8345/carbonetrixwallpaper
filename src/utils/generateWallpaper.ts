const COLORS = [
    ['#1E88E5', '#43A047'], // Blue to Green
    ['#E53935', '#FB8C00'], // Red to Orange
    ['#8E24AA', '#1E88E5'], // Purple to Blue
    ['#43A047', '#FFD600'], // Green to Yellow
    ['#FB8C00', '#E53935'], // Orange to Red
];

function btoa(str: string): string {
    return encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode(Number('0x' + p1));
        });
}

export function generateWallpaperSVG(index: number, text: string): string {
    const [color1, color2] = COLORS[index % COLORS.length];
    const angle = (index * 45) % 360;

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
        <defs>
            <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${angle} .5 .5)">
                <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
            </linearGradient>
            <filter id="shadow${index}">
                <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="black" flood-opacity="0.3"/>
            </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad${index})"/>
        <g filter="url(#shadow${index})">
            <text x="50%" y="50%" font-family="Arial" font-size="36" fill="white" text-anchor="middle" textLength="80%" lengthAdjust="spacingAndGlyphs">
                ${text}
            </text>
            <text x="50%" y="95%" font-family="Arial" font-size="48" font-weight="bold" fill="white" text-anchor="middle">
                Carbonetrix
            </text>
        </g>
        
        <path d="M0 1536 
                C 324 1344 756 1728 1080 1536"
              fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="5"/>
    </svg>`;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
} 