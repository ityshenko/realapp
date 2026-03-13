'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
}

// Расширенная база знаний о недвижимости в ДНР
const KNOWLEDGE_BASE = {
  districts: {
    'ворошиловский': { name: 'Ворошиловский', desc: 'Центральный район, престижно, развитая инфраструктура', avgRent1: 35000, avgRent2: 50000, avgRent3: 70000, avgSale1: 3500000, avgSale2: 5500000, avgSale3: 8000000 },
    'киевский': { name: 'Киевский', desc: 'Спальный район, тихий, много зелени', avgRent1: 30000, avgRent2: 42000, avgRent3: 60000, avgSale1: 3000000, avgSale2: 4800000, avgSale3: 7000000 },
    'калининский': { name: 'Калининский', desc: 'Промышленный район, доступное жильё', avgRent1: 25000, avgRent2: 38000, avgRent3: 55000, avgSale1: 2800000, avgSale2: 4200000, avgSale3: 6500000 },
    'будённовский': { name: 'Будённовский', desc: 'Южный район, частный сектор, новостройки', avgRent1: 28000, avgRent2: 40000, avgRent3: 58000, avgSale1: 3200000, avgSale2: 5000000, avgSale3: 7500000 },
    'кировский': { name: 'Кировский', desc: 'Западный район, спокойный, недорогой', avgRent1: 23000, avgRent2: 35000, avgRent3: 50000, avgSale1: 2500000, avgSale2: 4000000, avgSale3: 6000000 },
    'петровский': { name: 'Петровский', desc: 'Юго-западный район, развитая инфраструктура', avgRent1: 26000, avgRent2: 38000, avgRent3: 55000, avgSale1: 2700000, avgSale2: 4300000, avgSale3: 6300000 },
    'пролетарский': { name: 'Пролетарский', desc: 'Восточный район, тихий, частный сектор', avgRent1: 22000, avgRent2: 33000, avgRent3: 48000, avgSale1: 2400000, avgSale2: 3800000, avgSale3: 5500000 },
  },
  propertyTypes: {
    'квартира': { desc: 'Наиболее популярный тип недвижимости', avgPrice: 45000 },
    'дом': { desc: 'Частные дома с участком', avgPrice: 8500000 },
    'участок': { desc: 'Земельные участки под ИЖС', avgPrice: 1800000 },
    'коммерция': { desc: 'Офисы, магазины, склады', avgPrice: 120000 },
  },
  mortgages: {
    standard: { rate: 16, minDownPayment: 0.2, maxTerm: 20, desc: 'Стандартная ипотека' },
    family: { rate: 6, minDownPayment: 0.15, maxTerm: 30, desc: 'Семейная ипотека (с детьми)' },
    it: { rate: 5, minDownPayment: 0.15, maxTerm: 30, desc: 'IT-ипотека' },
  },
};

// Mock listings for links
const MOCK_LISTINGS = [
  { id: '1', title: '2-к квартира в центре', price: 45000, dealType: 'rent', rooms: 2, area: 54, district: 'Ворошиловский' },
  { id: '2', title: '1-к квартира у парка', price: 32000, dealType: 'rent', rooms: 1, area: 42, district: 'Киевский' },
  { id: '3', title: '3-к квартира просторная', price: 65000, dealType: 'rent', rooms: 3, area: 85, district: 'Калининский' },
  { id: '4', title: 'Дом с участком', price: 8500000, dealType: 'sale', rooms: 4, area: 150, district: 'Будённовский' },
  { id: '5', title: 'Студия в новостройке', price: 28000, dealType: 'rent', rooms: 1, area: 32, district: 'Кировский' },
  { id: '6', title: '2-к квартира у рынка', price: 40000, dealType: 'rent', rooms: 2, area: 50, district: 'Петровский' },
  { id: '7', title: 'Участок 12 соток', price: 1800000, dealType: 'sale', area: 1200, district: 'Пролетарский' },
  { id: '8', title: '4-к квартира премиум', price: 120000, dealType: 'rent', rooms: 4, area: 120, district: 'Ворошиловский' },
];

// Интеллектуальные шаблоны ответов
const RESPONSE_PATTERNS = {
  greetings: {
    patterns: ['привет', 'здравствуй', 'добрый день', 'доброе утро', 'добрый вечер', 'hello', 'hi'],
    responses: [
      'Здравствуйте! Я AI-помощник Тут.ру. Помогу найти идеальную недвижимость в ДНР! Чем могу быть полезен?',
      'Добро пожаловать на Тут.ру! Ищете квартиру, дом или участок? Расскажите о ваших предпочтениях.',
      'Приветствую! Готов помочь с выбором недвижимости. Что вас интересует: аренда или покупка?',
    ],
  },
  rent: {
    patterns: ['аренд', 'снять', 'найм'],
    responses: [
      'Отличный выбор! Аренда — это гибко и удобно. Подскажите:\n• Сколько комнат нужно?\n• Какой район предпочитаете?\n• Какой бюджет в месяц?',
      'Помогу найти аренду! У нас есть варианты от 22 000 ₽/мес. Расскажите подробнее:\n• 1, 2 или 3 комнаты?\n• Нужна мебель?\n• Какой район?',
    ],
  },
  sale: {
    patterns: ['куп', 'продаж', 'покупк'],
    responses: [
      'Покупка недвижимости — важное решение! Я помогу подобрать лучшие варианты. Что ищете?\n• Квартиру, дом или участок?\n• Какой бюджет?\n• Район?',
      'Отлично! Покупка — это надёжно. У нас более 1200 объектов. Подскажите:\n• Тип недвижимости?\n• Бюджет?\n• Срочность?',
    ],
  },
  apartment: {
    patterns: ['квартир', 'студия', 'однушка', 'двушка', 'трёшка'],
    responses: [
      'Квартиры — самый популярный выбор! Средние цены:\n• 1-к: от 2.5 млн ₽\n• 2-к: от 4 млн ₽\n• 3-к: от 5.5 млн ₽\n\nКакой район вас интересует?',
      'Отлично! Квартиры есть во всех районах. Сколько комнат нужно и какой бюджет?',
    ],
  },
  house: {
    patterns: ['дом', 'коттедж', 'таунхаус'],
    responses: [
      'Дома — отличный выбор для семьи! Средние цены:\n• Будённовский: от 6 млн ₽\n• Киевский: от 8 млн ₽\n• Пролетарский: от 5 млн ₽\n\nКакой район предпочитаете?',
      'Частные дома с участком — это простор и комфорт! Какой площади дом вас интересует?',
    ],
  },
  land: {
    patterns: ['участок', 'земля', 'земельный'],
    responses: [
      'Участки под ИЖС — отличное вложение! Средние цены:\n• 6-10 соток: 1.5-2.5 млн ₽\n• 10-15 соток: 2.5-4 млн ₽\n\nКакой район и площадь?',
      'Земельные участки есть во всех районах. Для строительства дома или инвестиций?',
    ],
  },
  price: {
    patterns: ['цена', 'стоимость', 'сколько стоит', 'бюджет', 'дорого', 'дёшево'],
    responses: [
      'Цены зависят от района, площади и состояния. Средние по ДНР:\n• Аренда 1-к: 25-35 тыс. ₽/мес\n• Аренда 2-к: 38-50 тыс. ₽/мес\n• Покупка 1-к: от 2.5 млн ₽\n• Покупка 2-к: от 4 млн ₽\n\nКакой вариант вас интересует?',
    'Бюджет — важный критерий! Укажите диапазон, и я подберу лучшие варианты. Например: "до 50 тыс. ₽" или "от 3 до 5 млн ₽".',
    'Есть варианты на любой бюджет! От студий за 22 тыс. ₽/мес до премиум-квартир за 150 тыс. ₽/мес. Какой у вас бюджет?',
    ],
  },
  district: {
    patterns: ['район', 'центр', 'окраина'],
    responses: [
      'В Донецке 7 районов:\n• Ворошиловский — центр, престижно\n• Киевский — тихий, зелёный\n• Калининский — доступное жильё\n• Будённовский — новостройки\n• Кировский — спокойный\n• Петровский — развитая инфраструктура\n• Пролетарский — частный сектор\n\nКакой вам ближе?',
    'Выбор района зависит от образа жизни. Центр — удобно, но шумно. Спальные районы — тише. Какой приоритет?',
    ],
  },
  mortgage: {
    patterns: ['ипотек', 'кредит', 'рассрочк'],
    responses: [
      'Ипотека в ДНР:\n• Стандартная: 16% годовых, взнос 20%\n• Семейная: 6%, для семей с детьми\n• IT-ипотека: 5%, для IT-специалистов\n\nРассчитать ежемесячный платёж?',
      'Помогу с ипотекой! Средний платёж за 2-к квартиру: 50-70 тыс. ₽/мес. Какой бюджет рассматриваете?',
    ],
  },
  newbuilding: {
    patterns: ['новострой', 'новостройк', 'новый дом', 'жк'],
    responses: [
      'Новостройки популярны! ЖК в ДНР:\n• "Донбасс Палас" — премиум\n• "Столичный" — комфорт+\n• "Петровский" — эконом\n\nПлюсы: современные планировки, дворы без машин. Цены от 3 млн ₽.',
      'Новые дома — это современные планировки и гарантия. Минусы: срок сдачи, ремонт. Хотите посмотреть варианты?',
    ],
  },
  furniture: {
    patterns: ['мебель', 'с мебелью', 'без мебели'],
    responses: [
      'Квартиры с мебелью дороже на 10-15%, но готовы к проживанию. Без мебели — дешевле, можно обустроить под себя. Что предпочитаете?',
    ],
  },
  thanks: {
    patterns: ['спасибо', 'благодарю', 'мерси'],
    responses: [
      'Всегда рад помочь! 😊 Если есть ещё вопросы — обращайтесь!',
      'Пожалуйста! Удачи в поиске недвижимости! 🏠',
    ],
  },
  goodbye: {
    patterns: ['пока', 'до свидания', 'всего доброго', 'прощай'],
    responses: [
      'До свидания! Возвращайтесь, если нужна помощь с недвижимостью! 👋',
      'Всего доброго! Удачного дня! 😊',
    ],
  },
};

const QUICK_ACTIONS = [
  { label: '🏠 Аренда', query: 'Хочу арендовать квартиру' },
  { label: '💰 Купить', query: 'Интересует покупка недвижимости' },
  { label: '🏢 2-к квартира', query: 'Нужна 2-комнатная квартира' },
  { label: '💵 До 50к', query: 'Бюджет до 50000 рублей в месяц' },
  { label: '📍 Центр', query: 'Расскажите про Ворошиловский район' },
  { label: '🏦 Ипотека', query: 'Какие условия ипотеки?' },
  { label: '🏡 Дом', query: 'Хочу купить дом с участком' },
  { label: '📊 Цены', query: 'Какие средние цены на квартиры?' },
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 Привет! Я AI-помощник Тут.ру. Помогу найти идеальную недвижимость в ДНР!\n\nМогу помочь с:\n• Арендой и покупкой\n• Выбором района\n• Расчётом ипотеки\n• Актуальными ценами\n\nЧто вас интересует?',
      sender: 'ai',
      timestamp: new Date(),
      suggestions: QUICK_ACTIONS.slice(0, 4).map(a => a.query),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [context, setContext] = useState<{
    dealType?: 'rent' | 'sale';
    propertyType?: 'apartment' | 'house' | 'land';
    rooms?: number;
    budget?: number;
    district?: string;
  }>({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Интеллектуальный анализ запроса
  const analyzeQuery = (query: string) => {
    const lower = query.toLowerCase();
    const analysis: { intent?: string; entities: Record<string, any> } = { entities: {} };

    // Определение намерения
    for (const [intent, data] of Object.entries(RESPONSE_PATTERNS)) {
      if (data.patterns.some(p => lower.includes(p))) {
        analysis.intent = intent;
        break;
      }
    }

    // Извлечение сущностей
    if (lower.includes('1-к') || lower.includes('однушк') || lower.includes('одна комната')) analysis.entities.rooms = 1;
    if (lower.includes('2-к') || lower.includes('двушк') || lower.includes('две комнаты')) analysis.entities.rooms = 2;
    if (lower.includes('3-к') || lower.includes('трёшк') || lower.includes('три комнаты')) analysis.entities.rooms = 3;
    if (lower.includes('4-к') || lower.includes('четыре комнаты')) analysis.entities.rooms = 4;

    // Бюджет
    const budgetMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:тыс|тысяч|млн|миллион)/);
    if (budgetMatch) {
      const value = parseFloat(budgetMatch[1]);
      if (lower.includes('млн') || lower.includes('миллион')) {
        analysis.entities.budget = value * 1000000;
      } else if (lower.includes('тыс') || lower.includes('тысяч')) {
        analysis.entities.budget = value * 1000;
      }
    }

    // Районы
    Object.keys(KNOWLEDGE_BASE.districts).forEach(d => {
      if (lower.includes(d)) analysis.entities.district = d;
    });

    // Тип сделки
    if (lower.includes('аренд') || lower.includes('снять')) analysis.entities.dealType = 'rent';
    if (lower.includes('куп') || lower.includes('покупк')) analysis.entities.dealType = 'sale';

    // Тип недвижимости
    if (lower.includes('квартир') || lower.includes('студия')) analysis.entities.propertyType = 'apartment';
    if (lower.includes('дом') || lower.includes('коттедж')) analysis.entities.propertyType = 'house';
    if (lower.includes('участок') || lower.includes('земля')) analysis.entities.propertyType = 'land';

    return analysis;
  };

  // Генерация умного ответа
  const getAIResponse = (userMessage: string): { text: string; suggestions?: string[] } => {
    const analysis = analyzeQuery(userMessage);
    const lower = userMessage.toLowerCase();

    // Обновление контекста
    setContext(prev => ({
      ...prev,
      dealType: analysis.entities.dealType || prev.dealType,
      propertyType: analysis.entities.propertyType || prev.propertyType,
      rooms: analysis.entities.rooms || prev.rooms,
      budget: analysis.entities.budget || prev.budget,
      district: analysis.entities.district || prev.district,
    }));

    // Специфичные ответы по районам
    if (analysis.entities.district) {
      const district = KNOWLEDGE_BASE.districts[analysis.entities.district as keyof typeof KNOWLEDGE_BASE.districts];
      if (district) {
        return {
          text: `📍 **${district.name}**\n\n${district.desc}\n\n📊 Средние цены:\n• Аренда 1-к: ${formatPrice(district.avgRent1)}\n• Аренда 2-к: ${formatPrice(district.avgRent2)}\n• Аренда 3-к: ${formatPrice(district.avgRent3)}\n• Покупка 1-к: от ${formatPrice(district.avgSale1)}\n• Покупка 2-к: от ${formatPrice(district.avgSale2)}\n\nХотите посмотреть объекты в этом районе?`,
          suggestions: ['Показать объекты', 'Сравнить районы', 'Другой район'],
        };
      }
    }

    // Расчёт ипотеки
    if (lower.includes('рассчитать') || lower.includes('платёж') || lower.includes('ипотечный')) {
      const budget = analysis.entities.budget || context.budget || 5000000;
      const rate = 16;
      const term = 20;
      const downPayment = budget * 0.2;
      const loanAmount = budget - downPayment;
      const monthlyPayment = (loanAmount * (rate / 100 / 12)) / (1 - Math.pow(1 + rate / 100 / 12, -term * 12));

      return {
        text: `🏦 **Расчёт ипотеки**\n\nСтоимость: ${formatPrice(budget)}\nПервый взнос (20%): ${formatPrice(downPayment)}\nСумма кредита: ${formatPrice(loanAmount)}\n\n📊 Платёж в месяц: **${formatPrice(Math.round(monthlyPayment))}**\nСрок: ${term} лет\nСтавка: ${rate}%\n\n*Рассчитать для другой суммы?*`,
        suggestions: ['Семейная ипотека 6%', 'IT-ипотека 5%', 'Другая сумма'],
      };
    }

    // Ответы по шаблонам
    for (const [intent, data] of Object.entries(RESPONSE_PATTERNS)) {
      if (data.patterns.some(p => lower.includes(p))) {
        const response = data.responses[Math.floor(Math.random() * data.responses.length)];
        let suggestions = QUICK_ACTIONS.map(a => a.query);

        // Контекстные подсказки
        if (intent === 'rent' || intent === 'sale') {
          suggestions = ['Сколько комнат?', 'Какой район?', 'Указать бюджет', 'Показать объекты'];
        }
        if (intent === 'apartment') {
          suggestions = ['1-к квартира', '2-к квартира', '3-к квартира', 'Студия'];
        }

        return { text: response, suggestions };
      }
    }

    // Генерация ссылок на объявления при выборе типа недвижимости
    const getListingsLinks = () => {
      const filtered = MOCK_LISTINGS.filter(l => {
        if (context.dealType && l.dealType !== context.dealType) return false;
        if (context.propertyType === 'apartment' && !l.rooms) return false;
        if (context.propertyType === 'house' && l.rooms && l.rooms > 3) return false;
        if (context.propertyType === 'land' && l.rooms) return false;
        if (context.rooms && l.rooms !== context.rooms) return false;
        return true;
      }).slice(0, 3);

      if (filtered.length === 0) return '';

      const links = filtered.map(l => {
        const dealEmoji = l.dealType === 'rent' ? '🏠' : '💰';
        const roomsText = l.rooms ? `${l.rooms}-к` : '';
        return `• ${dealEmoji} <a href="/listings/${l.id}" class="text-blue-400 hover:underline">${l.title}</a> — ${formatPrice(l.price)} ${l.dealType === 'rent' ? '/мес' : ''}`;
      }).join('\n');

      return `\n\n📋 **Подходящие объекты:**\n${links}`;
    };

    // Ответы с учётом контекста
    if (context.dealType && context.propertyType) {
      const dealText = context.dealType === 'rent' ? 'аренду' : 'покупку';
      const propText = context.propertyType === 'apartment' ? 'квартиру' : context.propertyType === 'house' ? 'дом' : 'участок';
      const roomsText = context.rooms ? `${context.rooms}-к` : '';

      const listingsLinks = getListingsLinks();

      return {
        text: `Понял! Вы ищете ${roomsText} ${propText} на ${dealText}.\n\n${context.budget ? `Бюджет: ${formatPrice(context.budget)}.` : 'Укажите бюджет для точного подбора.'}\n\n${context.district ? `Район: ${KNOWLEDGE_BASE.districts[context.district as keyof typeof KNOWLEDGE_BASE.districts]?.name}.` : 'Какой район предпочитаете?'}${listingsLinks}`,
        suggestions: ['Показать объекты', 'Изменить параметры', 'Другой вариант'],
      };
    }

    // Ответ по умолчанию с анализом
    const defaultResponses = [
      'Интересный вопрос! Уточните, пожалуйста:\n• Аренда или покупка?\n• Какой тип недвижимости?\n• Бюджет и район?',
      'Понял вас! Чтобы подобрать лучшие варианты, расскажите:\n• Что ищете (квартира, дом, участок)?\n• Для аренды или покупки?\n• Какой бюджет?',
      'Хорошо! Помогу с выбором. Подскажите:\n• Тип сделки (аренда/покупка)\n• Тип объекта\n• Предпочтения по району',
    ];

    return {
      text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
      suggestions: QUICK_ACTIONS.map(a => a.query),
    };
  };

  const formatPrice = (price: number): string => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)} млн ₽`;
    }
    return `${(price / 1000).toFixed(0)} тыс. ₽`;
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Имитация "мышления" AI
    setTimeout(() => {
      const response = getAIResponse(text);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'ai',
        timestamp: new Date(),
        suggestions: response.suggestions,
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-[#FF8C42] rotate-90'
            : 'bg-gradient-to-br from-[#FF8C42] to-[#FF7B2A] hover:scale-110'
        }`}
        style={{ boxShadow: '0 4px 20px rgba(255, 140, 66, 0.3)' }}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-h-[600px] bg-[#2a2a2a] rounded-3xl shadow-2xl border border-white/10 overflow-hidden animate-slide-up flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FF8C42] to-[#FF7B2A] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold">Консультант Тут.ру</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-blue-100 text-sm">Онлайн • AI-помощник</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setMessages([messages[0]]);
                  setContext({});
                }}
                className="text-white/70 hover:text-white transition-colors"
                title="Начать заново"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : 'bg-[#353535] text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#353535] rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-400 mb-2">⚡ Быстрый выбор:</p>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {QUICK_ACTIONS.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(action.query)}
                    className="px-3 py-1.5 bg-[#353535] hover:bg-[#404040] rounded-lg text-xs text-gray-300 hover:text-white transition-all border border-white/5 whitespace-nowrap"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Context-aware suggestions */}
          {messages.length > 1 && messages[messages.length - 1].sender === 'ai' && messages[messages.length - 1].suggestions && (
            <div className="px-4 pb-2 border-t border-white/5 pt-2">
              <div className="flex flex-wrap gap-2">
                {messages[messages.length - 1].suggestions!.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(suggestion)}
                    className="px-3 py-1.5 bg-[#FF8C42]/10 hover:bg-[#FF8C42]/20 rounded-lg text-xs text-[#FF8C42] transition-all border border-[#FF8C42]/20 whitespace-nowrap"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Введите сообщение..."
                className="flex-1 bg-[#353535] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-[#FF8C42] outline-none transition-all text-sm"
              />
              <button
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim()}
                className="w-12 h-12 bg-gradient-to-r from-[#FF8C42] to-[#FF7B2A] rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
