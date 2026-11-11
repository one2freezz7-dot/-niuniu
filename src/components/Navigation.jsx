import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Camera, Clock3, Gift, Heart, Mail, Sparkles } from "lucide-react";
import { content } from "../content/content";
import { PinkBow } from "./Decorations";

const ICONS = {
  opening: Heart,
  memories: Camera,
  timeline: Clock3,
  letter: Mail,
  gacha: Gift,
  gift: Sparkles,
};

export default function Navigation() {
  const [active, setActive] = useState(content.nav[0].id);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 26, restDelta: 0.001 });

  useEffect(() => {
    let frame = 0;

    function updateActive() {
      frame = 0;
      const anchor = window.scrollY + window.innerHeight * 0.36;
      let current = content.nav[0].id;

      for (const item of content.nav) {
        const element = document.getElementById(item.id);
        if (element && element.offsetTop <= anchor) current = item.id;
      }

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24) {
        current = content.nav[content.nav.length - 1].id;
      }

      setActive(current);
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(updateActive);
    }

    updateActive();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">
        {content.ui.skipToContent}
      </a>

      <header className="site-header">
        <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />

        <a className="site-brand" href="#opening" aria-label={content.meta.siteTitle}>
          <span className="site-brand__mark" aria-hidden="true">
            <PinkBow />
          </span>
          <span className="site-brand__text">
            <span className="site-brand__name">{content.meta.name}</span>
            <span className="site-brand__sub">{content.meta.brandSub}</span>
          </span>
        </a>

        <nav className="desktop-nav" aria-label={content.ui.pageNavLabel}>
          {content.nav.map((item) => {
            const Icon = ICONS[item.id] || Heart;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`desktop-nav__link ${active === item.id ? "is-active" : ""}`}
                aria-current={active === item.id ? "page" : undefined}
              >
                <Icon size={15} strokeWidth={2.2} aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </header>

      <nav className="mobile-nav" aria-label={content.ui.pageNavLabel}>
        {content.nav.map((item) => {
          const Icon = ICONS[item.id] || Heart;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`mobile-nav__link ${active === item.id ? "is-active" : ""}`}
              aria-current={active === item.id ? "page" : undefined}
            >
              <span className="mobile-nav__icon">
                <Icon size={19} strokeWidth={2.15} aria-hidden="true" />
              </span>
              <span className="mobile-nav__label">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </>
  );
}
