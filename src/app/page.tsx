import { Header } from '@/components/Header';
import { MainContent } from '@/components/MainContent';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-gray-700 font-[family-name:var(--font-geist-sans)]">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}
