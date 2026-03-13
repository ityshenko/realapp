export const DISTRICTS = [
  { id: 1, name: 'Все районы' },
  { id: 2, name: 'Ворошиловский' },
  { id: 3, name: 'Киевский' },
  { id: 4, name: 'Калининский' },
  { id: 5, name: 'Будённовский' },
  { id: 6, name: 'Кировский' },
  { id: 7, name: 'Петровский' },
  { id: 8, name: 'Пролетарский' },
];

export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Квартира' },
  { value: 'house', label: 'Дом' },
  { value: 'land', label: 'Участок' },
];

export const DEAL_TYPES = [
  { value: 'rent', label: 'Аренда' },
  { value: 'sale', label: 'Продажа' },
];

export const PROMOTION_TYPES = [
  { type: 'boost', name: 'Поднять в поиске', icon: '📈' },
  { type: 'highlight', name: 'Выделить цветом', icon: '⭐' },
  { type: 'combo', name: 'Комбо (Поднять + Выделить)', icon: '🔥' },
];
