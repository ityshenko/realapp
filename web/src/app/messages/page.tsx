'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CONVERSATIONS = [
  {
    id: '1',
    user: {
      name: 'Иван Петров',
      avatar: 'https://placehold.co/800x600/FF8C42/FFFFFF?text=Property',online: true,
    },
    listing: {
      title: '2-к квартира в центре',
      photo: 'https://placehold.co/800x600/FF8C42/FFFFFF?text=Property',},
    lastMessage: 'Здравствуйте! Квартира ещё свободна?',
    time: '10:30',
    unread: 2,
  },
  {
    id: '2',
    user: {
      name: 'Анна Сидорова',
      avatar: 'https://placehold.co/800x600/FF8C42/FFFFFF?text=Property',online: false,
    },
    listing: {
      title: 'Дом с участком',
      photo: 'https://placehold.co/800x600/FF8C42/FFFFFF?text=Property',},
    lastMessage: 'Когда можно посмотреть объект?',
    time: 'Вчера',
    unread: 0,
  },
  {
    id: '3',
    user: {
      name: 'Сергей Козлов',
      avatar: 'https://placehold.co/800x600/FF8C42/FFFFFF?text=Property',online: true,
    },
    listing: {
      title: 'Студия в новостройке',
      photo: 'https://placehold.co/800x600/FF8C42/FFFFFF?text=Property',},
    lastMessage: 'Спасибо, всё понравилось!',
    time: 'Вчера',
    unread: 0,
  },
];

const MOCK_MESSAGES = [
  { id: '1', text: 'Здравствуйте! Интересует квартира.', sender: 'them', time: '10:15' },
  { id: '2', text: 'Добрый день! Да, она ещё свободна.', sender: 'me', time: '10:18' },
  { id: '3', text: 'Здравствуйте! Квартира ещё свободна?', sender: 'them', time: '10:30', unread: true },
];

export default function MessagesPage() {
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  const activeConversation = CONVERSATIONS.find(c => c.id === selectedChat);

  return (
    <main className="min-h-screen bg-[#353535]">
      <Header />

      <div className="container mx-auto px-4 py-8 pt-28">
        <div className="flex items-center gap-4 mb-8">
          {selectedChat && (
            <button
              onClick={() => setSelectedChat(null)}
              className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Назад</span>
            </button>
          )}
          <h1 className="text-3xl font-bold text-white">Сообщения</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-[#2a2a2a] rounded-2xl border border-white/10 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10">
              <input
                type="text"
                placeholder="Поиск сообщений..."
                className="w-full bg-[#353535] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {CONVERSATIONS.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`w-full p-4 flex items-center gap-4 transition-all border-b border-white/5 ${
                    selectedChat === conv.id ? 'bg-blue-600/20' : 'hover:bg-[#353535]'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={conv.user.avatar}
                      alt={conv.user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conv.user.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2a2a2a]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white truncate">{conv.user.name}</h3>
                      <span className="text-xs text-gray-500 flex-shrink-0">{conv.time}</span>
                    </div>
                    <p className={`text-sm truncate ${conv.unread > 0 ? 'text-white font-semibold' : 'text-gray-400'}`}>
                      {conv.lastMessage}
                    </p>
                  </div>

                  {/* Unread Badge */}
                  {conv.unread > 0 && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {conv.unread}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-[#2a2a2a] rounded-2xl border border-white/10 overflow-hidden flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 flex items-center gap-4">
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="lg:hidden p-2 hover:bg-[#353535] rounded-xl transition-all border border-white/10"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <img
                    src={activeConversation?.user.avatar}
                    alt={activeConversation?.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{activeConversation?.user.name}</h3>
                    <p className="text-sm text-gray-400">
                      {activeConversation?.listing.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeConversation?.user.online && (
                      <span className="text-sm text-green-400 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        Онлайн
                      </span>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {MOCK_MESSAGES.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          msg.sender === 'me'
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#353535] text-white'
                        } ${msg.unread ? 'ring-2 ring-blue-500' : ''}`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-blue-200' : 'text-gray-500'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setMessageText('');
                    }}
                    className="flex gap-3"
                  >
                    <button
                      type="button"
                      className="p-3 bg-[#353535] hover:bg-[#404040] rounded-xl transition-all border border-white/10"
                    >
                      <span className="text-xl">📷</span>
                    </button>
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Введите сообщение..."
                      className="flex-1 bg-[#353535] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-all"
                    />
                    <button
                      type="submit"
                      className="px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all"
                    >
                      Отправить
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Выберите чат
                  </h3>
                  <p className="text-gray-400">
                    Выберите разговор из списка слева
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
