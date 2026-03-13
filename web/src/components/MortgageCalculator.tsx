'use client';

import { useState, useEffect } from 'react';

interface MortgageCalculatorProps {
  propertyPrice?: number;
  className?: string;
}

interface BankOffer {
  name: string;
  rate: number;
  minDownPayment: number;
  maxTerm: number;
  logo: string;
}

const BANK_OFFERS: BankOffer[] = [
  { name: 'Сбербанк', rate: 12.5, minDownPayment: 20, maxTerm: 30, logo: '🏦' },
  { name: 'ВТБ', rate: 12.9, minDownPayment: 15, maxTerm: 30, logo: '🏛️' },
  { name: 'Альфа-Банк', rate: 13.2, minDownPayment: 20, maxTerm: 25, logo: '🅰️' },
  { name: 'Тинькофф', rate: 13.5, minDownPayment: 10, maxTerm: 30, logo: '🟡' },
];

export function MortgageCalculator({ propertyPrice = 8500000, className = '' }: MortgageCalculatorProps) {
  const [price, setPrice] = useState(propertyPrice);
  const [downPayment, setDownPayment] = useState(2000000);
  const [term, setTerm] = useState(20);
  const [rate, setRate] = useState(12.5);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [selectedBank, setSelectedBank] = useState<BankOffer | null>(null);
  const [showApplication, setShowApplication] = useState(false);

  useEffect(() => {
    calculateMortgage();
  }, [price, downPayment, term, rate]);

  const calculateMortgage = () => {
    const principal = price - downPayment;
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term * 12;

    if (principal <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) {
      setMonthlyPayment(0);
      setTotalPayment(0);
      setTotalInterest(0);
      return;
    }

    const monthly =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const total = monthly * numberOfPayments;
    const interest = total - principal;

    setMonthlyPayment(monthly);
    setTotalPayment(total);
    setTotalInterest(interest);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const loanToValue = ((price - downPayment) / price) * 100;
  const incomeRequired = monthlyPayment / 0.4;

  const selectBank = (bank: BankOffer) => {
    setSelectedBank(bank);
    setRate(bank.rate);
    setTerm(Math.min(term, bank.maxTerm));
  };

  return (
    <div className={`bg-[#2D2D2D] rounded-2xl p-6 border border-white/10 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏦</span>
          <div>
            <h2 className="text-xl font-bold text-white">Ипотечный калькулятор</h2>
            <p className="text-sm text-neutral-400">Рассчитайте платёж и выберите банк</p>
          </div>
        </div>
        <button
          onClick={() => setShowApplication(!showApplication)}
          className="text-[#FF8C42] hover:text-[#FFA96D] text-sm font-semibold"
        >
          {showApplication ? 'Скрыть заявку' : 'Подать заявку'}
        </button>
      </div>

      {/* Inputs */}
      <div className="space-y-6">
        {/* Property Price */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-neutral-400">Стоимость недвижимости</label>
            <span className="text-white font-semibold">{formatCurrency(price)} ₽</span>
          </div>
          <input
            type="range"
            min="1000000"
            max="50000000"
            step="100000"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full h-2 bg-[#3A3A3A] rounded-full appearance-none cursor-pointer accent-[#FF8C42]"
          />
          <div className="flex justify-between text-xs text-neutral-500 mt-1">
            <span>1 млн</span>
            <span>50 млн</span>
          </div>
        </div>

        {/* Down Payment */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-neutral-400">Первоначальный взнос</label>
            <span className="text-white font-semibold">{formatCurrency(downPayment)} ₽</span>
          </div>
          <input
            type="range"
            min="0"
            max={price}
            step="100000"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full h-2 bg-[#3A3A3A] rounded-full appearance-none cursor-pointer accent-[#FF8C42]"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-neutral-500">
              {((downPayment / price) * 100).toFixed(1)}% от стоимости
            </span>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-32 bg-[#3A3A3A] border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm text-right focus:border-[#FF8C42] focus:ring-1 focus:ring-[#FF8C42] outline-none"
            />
          </div>
        </div>

        {/* Loan to Value Indicator */}
        <div className="bg-[#3A3A3A] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-400">Кредит / Стоимость</span>
            <span className={`text-sm font-semibold ${loanToValue > 80 ? 'text-red-400' : 'text-green-400'}`}>
              {loanToValue.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-3 bg-[#2D2D2D] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                loanToValue > 80 ? 'bg-red-500' : loanToValue > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(loanToValue, 100)}%` }}
            />
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            {loanToValue > 80
              ? '⚠️ Высокий риск, может потребоваться страховка'
              : loanToValue > 60
              ? '⚡ Средний показатель'
              : '✓ Отличный первоначальный взнос'}
          </p>
        </div>

        {/* Loan Term */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-neutral-400">Срок кредита</label>
            <span className="text-white font-semibold">{term} лет</span>
          </div>
          <div className="flex gap-2">
            {[10, 15, 20, 25, 30].map((years) => (
              <button
                key={years}
                onClick={() => setTerm(years)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  term === years
                    ? 'bg-[#FF8C42] text-white'
                    : 'bg-[#3A3A3A] text-neutral-400 hover:bg-[#404040]'
                }`}
              >
                {years}
              </button>
            ))}
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-neutral-400">Процентная ставка</label>
            <span className="text-white font-semibold">{rate}%</span>
          </div>
          <div className="flex gap-2">
            {[10, 12, 12.5, 13, 14].map((r) => (
              <button
                key={r}
                onClick={() => setRate(r)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  rate === r
                    ? 'bg-[#FF8C42] text-white'
                    : 'bg-[#3A3A3A] text-neutral-400 hover:bg-[#404040]'
                }`}
              >
                {r}%
              </button>
            ))}
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            💡 Ставки от 12% для семейной ипотеки, от 14% для вторички
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="mt-8 bg-gradient-to-br from-[#FF8C42]/20 to-[#FF7B2A]/20 rounded-xl p-6 border border-[#FF8C42]/30">
        <h3 className="text-lg font-bold text-white mb-4">Результаты расчёта</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#2D2D2D] rounded-xl p-4">
            <p className="text-neutral-400 text-sm mb-1">Ежемесячный платёж</p>
            <p className="text-2xl font-bold text-[#FF8C42]">{formatCurrency(monthlyPayment)} ₽</p>
          </div>
          <div className="bg-[#2D2D2D] rounded-xl p-4">
            <p className="text-neutral-400 text-sm mb-1">Сумма кредита</p>
            <p className="text-xl font-bold text-white">{formatCurrency(price - downPayment)} ₽</p>
          </div>
          <div className="bg-[#2D2D2D] rounded-xl p-4">
            <p className="text-neutral-400 text-sm mb-1">Общая выплата</p>
            <p className="text-xl font-bold text-white">{formatCurrency(totalPayment)} ₽</p>
          </div>
          <div className="bg-[#2D2D2D] rounded-xl p-4">
            <p className="text-neutral-400 text-sm mb-1">Проценты</p>
            <p className="text-xl font-bold text-yellow-400">{formatCurrency(totalInterest)} ₽</p>
          </div>
        </div>

        {/* Income Requirement */}
        <div className="mt-4 bg-[#2D2D2D] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Рекомендуемый доход</p>
              <p className="text-xs text-neutral-500">Платёж не более 40% от дохода</p>
            </div>
            <p className="text-lg font-bold text-green-400">{formatCurrency(incomeRequired)} ₽</p>
          </div>
        </div>
      </div>

      {/* Bank Offers */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-white mb-4">Предложения банков</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BANK_OFFERS.map((bank) => (
            <button
              key={bank.name}
              onClick={() => selectBank(bank)}
              className={`p-4 rounded-xl border transition-all text-left ${
                selectedBank?.name === bank.name
                  ? 'bg-[#FF8C42]/20 border-[#FF8C42]'
                  : 'bg-[#3A3A3A] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{bank.logo}</span>
                  <div>
                    <p className="text-white font-semibold">{bank.name}</p>
                    <p className="text-xs text-neutral-400">до {bank.maxTerm} лет</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#FF8C42] font-bold">{bank.rate}%</p>
                  <p className="text-xs text-neutral-400">от {bank.minDownPayment}%</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button className="flex-1 bg-gradient-to-r from-[#FF8C42] to-[#FF7B2A] hover:from-[#FF7B2A] hover:to-[#FF8C42] text-white py-4 rounded-xl font-semibold transition-all shadow-lg shadow-[#FF8C42]/30">
          Подать заявку на ипотеку
        </button>
        <button className="px-6 bg-[#3A3A3A] hover:bg-[#404040] text-white py-4 rounded-xl font-semibold transition-all border border-white/10">
          📋 Печать
        </button>
      </div>

      {/* Application Modal */}
      {showApplication && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2D2D2D] rounded-2xl p-8 max-w-md w-full border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Заявка на ипотеку</h3>
              <button
                onClick={() => setShowApplication(false)}
                className="text-neutral-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">ФИО</label>
                <input
                  type="text"
                  placeholder="Иванов Иван Иванович"
                  className="w-full bg-[#3A3A3A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:border-[#FF8C42] focus:ring-1 focus:ring-[#FF8C42] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Телефон</label>
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  className="w-full bg-[#3A3A3A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:border-[#FF8C42] focus:ring-1 focus:ring-[#FF8C42] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="example@mail.ru"
                  className="w-full bg-[#3A3A3A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:border-[#FF8C42] focus:ring-1 focus:ring-[#FF8C42] outline-none"
                />
              </div>
              {selectedBank && (
                <div className="bg-[#3A3A3A] rounded-xl p-4">
                  <p className="text-sm text-neutral-400 mb-1">Выбранный банк</p>
                  <p className="text-white font-semibold">{selectedBank.name}</p>
                  <p className="text-[#FF8C42] font-bold">{selectedBank.rate}%</p>
                </div>
              )}
            </div>

            <button className="w-full mt-6 bg-gradient-to-r from-[#FF8C42] to-[#FF7B2A] hover:from-[#FF7B2A] hover:to-[#FF8C42] text-white py-4 rounded-xl font-semibold transition-all shadow-lg shadow-[#FF8C42]/30">
              Отправить заявку
            </button>
            <p className="text-xs text-neutral-500 text-center mt-4">
              Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
