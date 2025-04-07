import { redirect } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirect to the default locale
  redirect('/en');
} 