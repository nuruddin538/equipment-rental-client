"use client";

import { useEffect, useState } from "react";
import { Star, Quote, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const testimonials = [
  {
    name: "James Wilson",
    role: "Construction Contractor",
    initials: "JW",
    rating: 5,
    date: "October 2026",
    review:
      "EQUIPORA made finding construction equipment incredibly easy. The rental process was smooth, pricing was fair, and the equipment arrived exactly as expected.",
  },
  {
    name: "Sarah Mitchell",
    role: "Professional Photographer",
    initials: "SM",
    rating: 5,
    date: "September 2026",
    review:
      "I needed a professional camera setup for a weekend project. I found exactly what I needed without spending a fortune. Definitely a platform I'll use again.",
  },
  {
    name: "Michael Anderson",
    role: "Small Business Owner",
    initials: "MA",
    rating: 5,
    date: "September 2026",
    review:
      "The flexible rental options are a game changer for my business. Instead of buying expensive equipment, I can rent what I need whenever a project comes up.",
  },
  {
    name: "Emily Carter",
    role: "Event Planner",
    initials: "EC",
    rating: 5,
    date: "August 2026",
    review:
      "Booking event equipment was simple and convenient. I really appreciate having different options in one place. It saved me both time and effort.",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const activeReview = testimonials[activeIndex];

  const nextReview = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const previousReview = () => {
    setActiveIndex(
      (current) => (current - 1 + testimonials.length) % testimonials.length
    );
  };

  // Automatically change review every 3 seconds
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, shouldReduceMotion]);

  return (
    <section className="overflow-hidden bg-[#FAF9F5] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        {/* Section heading */}
        <div className="mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[#EF8051]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#788077]">
                Voices of our community
              </span>
            </div>

            <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.055em] text-[#14211F] sm:text-5xl lg:text-7xl">
              Good experiences.
              <br />
              <span className="font-normal text-[#858A80]">Real people.</span>
            </h2>
          </div>

          <p className="max-w-xs text-sm leading-7 text-[#7B8278] lg:pb-2">
            Discover why customers choose EQUIPORA to find the right equipment
            for their next big idea.
          </p>
        </div>

        {/* Rating overview */}
        <div className="mb-10 flex flex-col gap-5 border-y border-[#14211F]/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl font-semibold tracking-[-0.06em] text-[#14211F]">
              5.0
            </span>

            <div>
              <div className="flex gap-1 text-[#E99A48]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={15}
                    fill="currentColor"
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-[#858A80]">
                Customer review highlights
              </p>
            </div>
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#858A80]">
            What our customers are saying
          </p>
        </div>

        {/* Animated review slider */}
        <div
          className="relative overflow-hidden rounded-sm border border-[#14211F]/10 bg-white"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsPaused(false);
            }
          }}
          aria-label="Customer reviews carousel"
          aria-roledescription="carousel"
        >
          <div className="relative min-h-[410px] px-6 py-9 sm:min-h-[370px] sm:px-12 sm:py-12 lg:px-20 lg:py-14">
            <AnimatePresence mode="wait">
              <motion.article
                key={activeReview.name}
                initial={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }
                }
                transition={{ duration: 0.55, ease: "easeInOut" }}
                className="flex h-full flex-col justify-between"
                aria-live="polite"
                aria-atomic="true"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex gap-1 text-[#E99A48]">
                        {Array.from({
                          length: activeReview.rating,
                        }).map((_, index) => (
                          <Star
                            key={index}
                            size={17}
                            fill="currentColor"
                            strokeWidth={1.5}
                          />
                        ))}
                      </div>

                      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#858A80]">
                        Verified experience
                      </p>
                    </div>

                    <Quote
                      size={42}
                      strokeWidth={1}
                      className="text-[#D8DED1] sm:size-12"
                    />
                  </div>

                  <p className="mt-9 max-w-4xl text-xl font-medium leading-[1.6] tracking-[-0.035em] text-[#26352E] sm:text-2xl lg:text-3xl lg:leading-[1.55]">
                    “{activeReview.review}”
                  </p>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-[#14211F]/10 pt-7">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8EBD9] text-sm font-bold text-[#405F50]">
                      {activeReview.initials}
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-[#14211F]">
                        {activeReview.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#858A80]">
                        {activeReview.role}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-medium uppercase tracking-wider text-[#A0A49B]">
                    {activeReview.date}
                  </span>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* Slider controls */}
          <div className="flex flex-col gap-5 border-t border-[#14211F]/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-12 lg:px-20">
            {/* Pagination dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((review, index) => (
                <button
                  key={review.name}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show review ${index + 1}`}
                  aria-current={activeIndex === index ? "true" : undefined}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    activeIndex === index
                      ? "w-10 bg-[#14211F]"
                      : "w-5 bg-[#14211F]/20 hover:bg-[#14211F]/50"
                  }`}
                />
              ))}

              <span className="ml-3 font-mono text-[11px] text-[#858A80]">
                0{activeIndex + 1} / 0{testimonials.length}
              </span>
            </div>

            {/* Previous / Next */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={previousReview}
                aria-label="Previous review"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#14211F]/15 text-[#14211F] transition-all hover:bg-[#14211F] hover:text-white"
              >
                <ArrowLeft size={17} />
              </button>

              <button
                type="button"
                onClick={nextReview}
                aria-label="Next review"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#14211F] text-white transition-all hover:bg-[#344A3F]"
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <p className="text-sm text-[#858A80]">
            Every successful project starts with the right equipment.
          </p>

          <Link
            href="/equipment"
            className="group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-[#14211F]"
          >
            Start your next project
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#14211F] text-[#F4F1E8] transition-transform duration-300 group-hover:translate-x-1">
              <ArrowUpRight size={16} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
