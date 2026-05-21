import { FeatureGrid } from "./FeatureGrid";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { TopNav } from "./TopNav";

export function LandingPage() {
  return (
    <div className="aurel-page">
      <TopNav />
      <Hero />
      <FeatureGrid />
      <Footer />
    </div>
  );
}
