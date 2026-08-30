import './globals.css';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { ThemeProvider } from '../components/theme/ThemeProvider';

export const metadata = {
  title: 'AI Guardian - AI Governance & Compliance Platform',
  description: 'Enterprise AI Governance, Model Risk Management, and Regulatory Compliance Platform for Financial Institutions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-[#0B0F17] text-slate-100 h-full flex overflow-hidden">
        <ThemeProvider>
          <div className="flex h-full w-full overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
              <Header />
              <main className="flex-1 flex flex-col min-h-0 overflow-y-auto p-6 md:p-8">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
