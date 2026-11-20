import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import FeaturedEquipment from "@/components/home/FeaturedEquipment";
import CategoriesSection from "@/components/home/CategoriesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import PopularEquipment from "@/components/home/PopularEquipment";
import CTASection from "@/components/home/TrustedOwners";
import SectionReveal from "@/components/shared/SectionReveal";
import TrustedOwners from "@/components/home/TrustedOwners";

export default function HomePage() {
  return (
    <>
      {/* 1. Animated Banner */}
      <SectionReveal>
        <HeroSection />
      </SectionReveal>
      {/* 2. Animated Featured Equipment */}
      <SectionReveal>
        <FeaturedEquipment />
      </SectionReveal>
      {/* 3. Animated Categories */}
      <SectionReveal>
        <CategoriesSection />
      </SectionReveal>
      {/* Why Choose Us */}
      <SectionReveal>
        <WhyChooseUs />
      </SectionReveal>
      {/* 5. Extra Section: How It Works */}
      <HowItWorks />
      {/* 4. Animated Customer Reviews */}
      <SectionReveal>
        <Testimonials />
      </SectionReveal>
      {/* 6. Extra Section: Trusted Owners */}
      <TrustedOwners />
    </>
  );
}
