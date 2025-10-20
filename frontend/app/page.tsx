import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import WhySection from '@/components/landing/WhySection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import AnnouncementsSection from '@/components/landing/AnnouncementsSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <WhySection />
      <FeaturesSection />
      <AnnouncementsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}