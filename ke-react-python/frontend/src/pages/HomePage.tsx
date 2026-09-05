import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Hero } from '@/components/sections/Hero';
import { Portfolio } from '@/components/sections/Portfolio';
import { Products } from '@/components/sections/Products';
import { Services } from '@/components/sections/Services';
import { Testimonials } from '@/components/sections/Testimonials';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <About />
      <Products />
      <Services />
      <Portfolio />
      <Testimonials />
      <Contact />
    </div>
  );
}