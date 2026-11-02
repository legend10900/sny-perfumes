import Hero from "@/components/Hero";
import VideoReels from "@/components/VideoReels";
import ProductGrid from "@/components/ProductGrid";
import BundlesSection from "@/components/BundlesSection";
import ReviewsSection from "@/components/ReviewsSection";
import FragrancePyramidModal from "@/components/FragrancePyramidModal";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Hero />
      <VideoReels />
      <ProductGrid />
      <BundlesSection />
      <ReviewsSection />
      <FragrancePyramidModal />
    </main>
  );
}
