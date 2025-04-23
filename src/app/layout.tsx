import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zoppy Conexo',
  description: 'Desafio das Conexões - Zoppy',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gradient-to-b from-cyan-500 to-blue-500 text-white`}>
        <header className="text-center py-4 bg-blue-600 shadow-md">
          <h1 className="text-4xl font-bold">Zoppy</h1>
          <h2 className="text-2xl">Desafio das Conexões</h2>
        </header>
        <main className="container mx-auto p-4">{children}</main>
        <footer className="text-center py-4 bg-blue-600">
          <p>© 2025 Zoppy. Todos os direitos reservados.</p>
        </footer>
      </body>
    </html>
  );
}
