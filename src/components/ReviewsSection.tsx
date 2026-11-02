"use client";

import React from "react";
import { Star, ShieldCheck, Sparkles, Quote } from "lucide-react";

const REVIEWS = [
  {
    name: "Vikramaditya Roy",
    location: "Bengaluru",
    scent: "Titan Aura (Extrait)",
    rating: 5,
    date: "2 days ago",
    content:
      "Titan Aura has replaced my Creed bottle entirely. The pineapple opening is bright and crisp, but what truly blew me away was the birch smoke in the dry-down. Lasted on my suit jacket for more than 16 hours. Beast mode!",
  },
  {
    name: "Zoya Merchant",
    location: "Mumbai",
    scent: "Midnight Oud",
    rating: 5,
    date: "1 week ago",
    content:
      "The brand ambassador picture holding Midnight Oud drew me in, and the scent exceeds every expectation. The saffron and oud are so smooth—not sharp at all. It smells like pure royalty.",
  },
  {
    name: "Rohan Khanna",
    location: "Delhi NCR",
    scent: "Aqua Tide",
    rating: 5,
    date: "3 days ago",
    content:
      "Aqua Tide is the ultimate fresh aquatic fragrance. Clean, energetic, and doesn't disappear in hot humid weather like standard designer EDTs. At ₹349 this is unmatched value.",
  },
  {
    name: "Devika Sen",
    location: "Kolkata",
    scent: "Discovery Set (4x 8ml)",
    rating: 5,
    date: "5 days ago",
    content:
      "The Discovery Set arrived in just 2 days via Shiprocket! Packaging is ultra-luxurious, and testing 4 fragrances with the ₹200 voucher made it a no-brainer. Midnight Oud and Asphalt are absolute stunners.",
  },
];

export default function ReviewsSection() {
  return (
    <section className="py-24 bg-black border-b border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-gold/40 text-gold text-xs tracking-[0.25em] uppercase font-medium">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>VERIFIED SILLAGE TESTIMONIALS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Over 10,000+ <span className="gold-gradient-text italic">Signatures Worn.</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-light">
            Read real experiences from fragrance enthusiasts and tastemakers across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((review, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800/80 hover:border-gold/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">{review.date}</span>
                </div>

                <div className="relative">
                  <Quote className="w-6 h-6 text-zinc-800 absolute -top-2 -left-2 -z-0 opacity-40" />
                  <p className="text-xs text-zinc-300 leading-relaxed font-light relative z-10">
                    "{review.content}"
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-900 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span>{review.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <div className="text-[10px] text-zinc-500">{review.location}</div>
                </div>
                <span className="text-[10px] text-gold font-mono px-2 py-0.5 rounded bg-zinc-900 border border-gold/20">
                  {review.scent}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
