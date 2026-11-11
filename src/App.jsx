import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { content } from "./content/content";
import Navigation from "./components/Navigation";
import Opening from "./components/Opening";
import PhotoGallery from "./components/PhotoGallery";
import Timeline from "./components/Timeline";
import LoveLetter from "./components/LoveLetter";
import GachaMachine from "./components/GachaMachine";
import FinalGift from "./components/FinalGift";
import SiteFooter from "./components/SiteFooter";

export default function App() {
  useEffect(() => {
    document.title = content.meta.siteTitle;

    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", content.meta.description);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="site">
        <div className="site-atmosphere" aria-hidden="true">
          <span className="site-atmosphere__glow site-atmosphere__glow--one" />
          <span className="site-atmosphere__glow site-atmosphere__glow--two" />
          <span className="site-atmosphere__grain" />
        </div>

        <Navigation />

        <main id="main-content">
          <Opening />
          <PhotoGallery />
          <Timeline />
          <LoveLetter />
          <GachaMachine />
          <FinalGift />
        </main>

        <SiteFooter />
      </div>
    </MotionConfig>
  );
}
