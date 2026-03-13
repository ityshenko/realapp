'use client';

interface PlaceholderImageProps {
  width?: number;
  height?: number;
  text?: string;
  color?: string;
  className?: string;
  alt?: string;
}

export function PlaceholderImage({ 
  width = 800, 
  height = 600, 
  text = 'Недвижимость', 
  color = 'FF8C42',
  className = '',
  alt = 'Placeholder'
}: PlaceholderImageProps) {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#${color}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) * 0.08}" 
            fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
        ${text}
      </text>
    </svg>
  `;
  
  const encodedSvg = encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22');
  
  return (
    <img
      src={`data:image/svg+xml,${encodedSvg}`}
      alt={alt}
      className={className}
      style={{ objectFit: 'cover' }}
    />
  );
}

export function AvatarPlaceholder({ name = 'U', size = 200 }: { name?: string; size?: number }) {
  const colors = ['FF8C42', '4A90D9', '70AD47', 'FFC000', 'E74C3C'];
  const index = name.length % colors.length;
  const color = colors[index];
  
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#${color}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.5}" 
            fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
        ${name.charAt(0).toUpperCase()}
      </text>
    </svg>
  `;
  
  const encodedSvg = encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22');
  
  return `data:image/svg+xml,${encodedSvg}`;
}
