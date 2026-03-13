'use client';

import { Toaster } from 'react-hot-toast';
import { StoreProvider } from '@/store/provider';
import { SocketProvider } from '@/context/SocketContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <SocketProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#222',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            },
            success: {
              iconTheme: {
                primary: '#00A699',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF385C',
                secondary: '#fff',
              },
            },
          }}
        />
      </SocketProvider>
    </StoreProvider>
  );
}
