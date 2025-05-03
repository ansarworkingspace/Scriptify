import { Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata = {
  title: 'Scriptify js Compiler',
  description: 'A modern JavaScript compiler',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
