// Placeholder изображения для тестирования
// Используем placehold.co вместо Unsplash для надежности

export function getPropertyPlaceholder(type: 'apartment' | 'house' | 'land' = 'apartment', index?: number): string {
  const colors = ['FF8C42', 'FF7B2A', '4A90D9', '5B9BD5', '70AD47', 'FFC000'];
  const colorIndex = index ? index % colors.length : 0;
  const color = colors[colorIndex];
  
  const labels = {
    apartment: 'Квартира',
    house: 'Дом',
    land: 'Участок',
  };
  
  return `https://placehold.co/800x600/${color}/FFFFFF?text=${encodeURIComponent(labels[type])}`;
}

export function getAvatarPlaceholder(name?: string): string {
  const colors = ['FF8C42', '4A90D9', '70AD47', 'FFC000', 'E74C3C'];
  const index = name ? name.length % colors.length : 0;
  const color = colors[index];
  const initial = name ? name.charAt(0).toUpperCase() : 'U';
  
  return `https://placehold.co/200x200/${color}/FFFFFF?text=${initial}`;
}

export function getBuildingPlaceholder(): string {
  return 'https://placehold.co/400x300/2a2a2a/FFFFFF?text=Здание';
}
