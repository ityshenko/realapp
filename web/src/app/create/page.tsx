'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { DISTRICTS } from '@/lib/constants';

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    propertyType: 'apartment',
    dealType: 'rent',
    rooms: '',
    area: '',
    livingArea: '',
    kitchenArea: '',
    floor: '',
    totalFloors: '',
    address: '',
    district: '',
    lat: '',
    lng: '',
    hasFurniture: false,
    hasParking: false,
    hasElevator: false,
    hasBalcony: false,
    isNewBuilding: false,
    petsAllowed: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPhotos((prev) => [...prev, ...newFiles]);
      setPhotoPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    router.push('/profile');
  };

  return (
    <main className="min-h-screen bg-[#353535]">
      <Header />

      <div className="container mx-auto px-4 py-12 pt-24">
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, title: 'Основное' },
              { num: 2, title: 'Параметры' },
              { num: 3, title: 'Расположение' },
              { num: 4, title: 'Фото' },
            ].map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                  step >= s.num 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-[#2a2a2a] text-gray-500 border border-white/10'
                }`}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={`ml-2 text-sm hidden md:block ${
                  step >= s.num ? 'text-white' : 'text-gray-500'
                }`}>
                  {s.title}
                </span>
                {index < 3 && (
                  <div className={`w-12 md:w-24 h-1 mx-2 rounded ${
                    step > s.num ? 'bg-blue-600' : 'bg-[#2a2a2a]'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-white/10 animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">Основная информация</h2>

              <div className="space-y-6">
                {/* Deal Type & Property Type */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-3">Тип сделки *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, dealType: 'rent' })}
                        className={`py-4 rounded-xl font-semibold transition-all ${
                          formData.dealType === 'rent'
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#353535] text-gray-400 border border-white/10 hover:border-blue-500'
                        }`}
                      >
                        🏠 Аренда
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, dealType: 'sale' })}
                        className={`py-4 rounded-xl font-semibold transition-all ${
                          formData.dealType === 'sale'
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#353535] text-gray-400 border border-white/10 hover:border-blue-500'
                        }`}
                      >
                        💰 Продажа
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-3">Тип недвижимости *</label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full bg-[#353535] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="apartment">Квартира</option>
                      <option value="house">Дом</option>
                      <option value="land">Участок</option>
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Заголовок *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Например: 2-к квартира в центре"
                    className="w-full bg-[#353535] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Максимум 50 символов</p>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Цена *</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full bg-[#353535] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">₽ {formData.dealType === 'rent' ? '/мес' : ''}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Описание</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Расскажите о преимуществах объекта..."
                    rows={5}
                    className="w-full bg-[#353535] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-all resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Максимум 2000 символов</p>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold transition-all"
                >
                  Далее →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Parameters */}
          {step === 2 && (
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-white/10 animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">Параметры объекта</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Rooms */}
                {formData.propertyType !== 'land' && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Комнаты</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setFormData({ ...formData, rooms: num.toString() })}
                          className={`w-12 h-12 rounded-xl font-semibold transition-all ${
                            formData.rooms === num.toString()
                              ? 'bg-blue-600 text-white'
                              : 'bg-[#353535] text-gray-400 border border-white/10 hover:border-blue-500'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Area */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Площадь, м² *</label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full bg-[#353535] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>

                {/* Floor */}
                {formData.propertyType === 'apartment' && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Этаж</label>
                      <input
                        type="number"
                        name="floor"
                        value={formData.floor}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="w-full bg-[#353535] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Этажей в доме</label>
                      <input
                        type="number"
                        name="totalFloors"
                        value={formData.totalFloors}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="w-full bg-[#353535] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Features */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-white mb-4">Удобства</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: 'hasFurniture', label: '🪑 С мебелью' },
                    { name: 'hasParking', label: '🚗 Парковка' },
                    { name: 'hasElevator', label: '🛗 Лифт' },
                    { name: 'hasBalcony', label: '🏠 Балкон/Лоджия' },
                    { name: 'isNewBuilding', label: '🏢 Новостройка' },
                    { name: 'petsAllowed', label: '🐾 Можно с животными' },
                  ].map((feature) => (
                    <label
                      key={feature.name}
                      className="flex items-center gap-3 p-4 bg-[#353535] rounded-xl cursor-pointer hover:bg-[#404040] transition-all border border-white/5"
                    >
                      <input
                        type="checkbox"
                        name={feature.name}
                        checked={formData[feature.name as keyof typeof formData] as boolean}
                        onChange={handleCheckboxChange}
                        className="w-5 h-5 rounded bg-[#353535] border-white/20 text-blue-600 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-gray-300">{feature.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-[#353535] hover:bg-[#404040] text-white px-8 py-3 rounded-xl font-semibold transition-all border border-white/10"
                >
                  ← Назад
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold transition-all"
                >
                  Далее →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-white/10 animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">Расположение</h2>

              <div className="space-y-6">
                {/* District */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Район</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full bg-[#353535] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">Выберите район</option>
                    {DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Адрес</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Улица, дом"
                    className="w-full bg-[#353535] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                {/* Coordinates */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Широта (lat) *</label>
                    <input
                      type="number"
                      step="0.000001"
                      name="lat"
                      value={formData.lat}
                      onChange={handleInputChange}
                      placeholder="48.008300"
                      className="w-full bg-[#353535] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Долгота (lng) *</label>
                    <input
                      type="number"
                      step="0.000001"
                      name="lng"
                      value={formData.lng}
                      onChange={handleInputChange}
                      placeholder="37.808300"
                      className="w-full bg-[#353535] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="h-64 bg-[#1a1a2e] rounded-xl flex items-center justify-center border border-white/10">
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">📍 Карта</p>
                    <p className="text-sm text-gray-600">Выберите точку на карте</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  💡 Координаты можно получить в Google Maps (клик правой кнопкой мыши)
                </p>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-[#353535] hover:bg-[#404040] text-white px-8 py-3 rounded-xl font-semibold transition-all border border-white/10"
                >
                  ← Назад
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold transition-all"
                >
                  Далее →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Photos */}
          {step === 4 && (
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-white/10 animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">Фотографии</h2>

              <div className="mb-6">
                <p className="text-gray-400 mb-4">
                  Загрузите фотографии объекта. Первое фото будет обложкой.
                </p>
                <p className="text-sm text-gray-500">
                  Можно загрузить до 20 фотографий. Форматы: JPG, PNG, WEBP
                </p>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {photoPreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={preview}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
                        Обложка
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/70 hover:bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {photoPreviews.length < 20 && (
                  <label className="aspect-square border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all group">
                    <div className="w-12 h-12 bg-[#353535] rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-all">
                      <span className="text-2xl text-gray-400 group-hover:text-white">+</span>
                    </div>
                    <span className="text-sm text-gray-400 mt-2 group-hover:text-white">
                      {photoPreviews.length}/20
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      multiple
                    />
                  </label>
                )}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-[#353535] hover:bg-[#404040] text-white px-8 py-3 rounded-xl font-semibold transition-all border border-white/10"
                >
                  ← Назад
                </button>
                <button
                  type="submit"
                  disabled={loading || photoPreviews.length === 0}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Публикация...
                    </>
                  ) : (
                    <>
                      ✓ Опубликовать
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
