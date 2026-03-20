import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'EduHub - Academic Knowledge Platform',
  description: 'Discover, learn, and share academic knowledge with EduHub',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#fefdf8', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#fdf8f6',
                color: '#271d19',
                border: '1px solid #e0cec7',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
