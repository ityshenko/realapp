'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Property {
  id: string;
  title: string;
  price: number;
  area: number;
  rooms: number;
  floor: number;
  totalFloors?: number;
  address: string;
  photo: string;
  hasFurniture: boolean;
  hasParking: boolean;
  isNewBuilding: boolean;
}

interface ComparisonProps {
  properties?: Property[];
}

const DEFAULT_PROPERTIES: Property[] = [
  {
    id: '1',
    title: '2-к квартира центр',
    price: 45000,
    area: 54,
    rooms: 2,
    floor: 3,
    totalFloors: 9,
    address: 'пр. Пушкина, 10',
    photo: 'https://placehold.co/800x600/FF8C42/FFFFFF?text=Property',hasFurniture: true,
    hasParking: true,
    isNewBuilding: false,
  },
  {
    id: '2',
    title: '2-к квартира near парк',
    price: 38000,
    area: 48,
    rooms: 2,
    floor: 5,
    totalFloors: 12,
    address: 'ул. Артема, 25',
    photo: 'https://placehold.co/800x600/FF8C42/FFFFFF?text=Property',hasFurniture: false,
    hasParking: false,
    isNewBuilding: true,
  },
  {
    id: '3',
    title: '2-к квартира просторная',
    price: 55000,
    area: 65,
    rooms: 2,
    floor: 7,
    totalFloors: 16,
    address: 'пр. Ильича, 50',
    photo: 'https://placehold.co/800x600/FF8C42/FFFFFF?text=Property',hasFurniture: true,
    hasParking: true,
    isNewBuilding: true,
  },
];

export function PropertyComparison({ properties = DEFAULT_PROPERTIES }: ComparisonProps) {
  const [compareList, setCompareList] = useState<Property[]>(properties.slice(0, 3));

  const addToCompare = (property: Property) => {
    if (compareList.length < 3 && !compareList.find(p => p.id === property.id)) {
      setCompareList([...compareList, property]);
    }
  };

  const removeFromCompare = (id: string) => {
    setCompareList(compareList.filter(p => p.id !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <div className="space-y-6">
      {/* Compare Bar */}
      {compareList.length > 0 && (
        <div className="bg-[#2a2a2a] rounded-2xl p-4 border border-white/10 sticky top-20 z-40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <span>📊</span>
              Сравнение объектов ({compareList.length}/3)
            </h3>
            <button
              onClick={clearCompare}
              className="text-red-400 hover:text-red-300 text-sm font-semibold"
            >
              Очистить всё
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto">
            {compareList.map((property) => (
              <div
                key={property.id}
                className="flex items-center gap-3 bg-[#353535] rounded-xl px-4 py-2 flex-shrink-0"
              >
                <img src={property.photo} alt={property.title} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <p className="text-white text-sm font-medium">{property.title}</p>
                  <p className="text-blue-400 text-sm">{property.price.toLocaleString()} ₽</p>
                </div>
                <button
                  onClick={() => removeFromCompare(property.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {compareList.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full bg-[#2a2a2a] rounded-2xl border border-white/10">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-left text-gray-400 font-medium w-48">Параметр</th>
                {compareList.map((property) => (
                  <th key={property.id} className="p-4 text-left min-w-[200px]">
                    <div className="relative">
                      <img
                        src={property.photo}
                        alt={property.title}
                        className="w-full h-32 object-cover rounded-xl mb-3"
                      />
                      <button
                        onClick={() => removeFromCompare(property.id)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-sm hover:bg-red-700 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-white font-semibold">{property.title}</p>
                    <p className="text-blue-400 font-bold">{property.price.toLocaleString()} ₽</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <ComparisonRow label="Площадь" icon="📐" properties={compareList} field="area" suffix=" м²" />
              <ComparisonRow label="Комнаты" icon="🏢" properties={compareList} field="rooms" />
              <ComparisonRow label="Этаж" icon="🏗️" properties={compareList} field="floor" suffix={(p) => `/${p.totalFloors}`} />
              <ComparisonRow label="Адрес" icon="📍" properties={compareList} field="address" />
              <ComparisonRow label="Мебель" icon="🪑" properties={compareList} field="hasFurniture" boolean />
              <ComparisonRow label="Парковка" icon="🚗" properties={compareList} field="hasParking" boolean />
              <ComparisonRow label="Новостройка" icon="🏢" properties={compareList} field="isNewBuilding" boolean />
              
              {/* Price per m² */}
              <tr className="border-t border-white/10">
                <td className="p-4 text-gray-400">💰 Цена за м²</td>
                {compareList.map((property) => (
                  <td key={property.id} className="p-4">
                    <span className="text-white font-semibold">
                      {Math.round(property.price / property.area).toLocaleString()} ₽
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-[#2a2a2a] rounded-2xl p-12 border border-white/10 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-white mb-2">Сравнение объектов</h3>
          <p className="text-gray-400 mb-6">Добавьте до 3-х объектов для сравнения</p>
          <p className="text-sm text-gray-500">Нажмите "Сравнить" на карточке объекта</p>
        </div>
      )}
    </div>
  );
}

function ComparisonRow({
  label,
  icon,
  properties,
  field,
  suffix = '',
  boolean = false,
}: {
  label: string;
  icon: string;
  properties: Property[];
  field: keyof Property;
  suffix?: string | ((p: Property) => string);
  boolean?: boolean;
}) {
  const values = properties.map(p => p[field]);
  const maxValue = typeof values[0] === 'number' ? Math.max(...(values as number[])) : null;

  return (
    <tr className="border-t border-white/10">
      <td className="p-4 text-gray-400">
        <span className="mr-2">{icon}</span>
        {label}
      </td>
      {properties.map((property, index) => {
        const value = property[field];
        const isBest = typeof value === 'number' && maxValue !== null && value === maxValue;
        
        return (
          <td key={property.id} className="p-4">
            <span className={`font-medium ${isBest && !boolean ? 'text-green-400' : 'text-white'}`}>
              {boolean ? (value ? '✓' : '—') : `${value}${typeof suffix === 'function' ? suffix(property) : suffix}`}
            </span>
            {isBest && !boolean && <span className="ml-2 text-xs text-green-400">(лучше)</span>}
          </td>
        );
      })}
    </tr>
  );
}

// Add to compare button component
export function AddToCompareButton({ property, onAdd }: { property: Property; onAdd: () => void }) {
  return (
    <button
      onClick={onAdd}
      className="flex items-center gap-2 px-4 py-2 bg-[#353535] hover:bg-[#404040] rounded-xl text-sm text-gray-300 hover:text-white transition-all border border-white/10"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      Сравнить
    </button>
  );
}
