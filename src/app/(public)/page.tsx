import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import FeaturedEquipment from "@/components/home/FeaturedEquipment";
import CategoriesSection from "@/components/home/CategoriesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import PopularEquipment from "@/components/home/PopularEquipment";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedEquipment />
      <CategoriesSection />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <PopularEquipment />
      <CTASection />
    </>
  );
}
