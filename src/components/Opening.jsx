import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Heart, Sparkles } from "lucide-react";
import { content } from "../content/content";
import { HelloKitty, PinkBow, StarDoodle } from "./Decorations";
import PhotoImage from "./PhotoImage";

function formatBirthday(value) {
  if (!value) return "";
  const parts = String(value).split("-");
  if (parts.length !== 3) return value;
  return `${parts[0]}.${parts[1]}.${parts[2]}`;
}

export default function Opening() {
  const reduceMotion = useReducedMotion();
  const copy = content.opening;

  const fadeUp = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section id="opening" className="hero section" aria-labelledby="hero-title">
      <div className="hero__background" aria-hidden="true">
        <span className="hero__blob hero__blob--one" />
        <span className="hero__blob hero__blob--two" />
        <span className="hero__check" />
        <StarDoodle className="hero__star hero__star--a" filled />
        <StarDoodle className="hero__star hero__star--b" />
        <StarDoodle className="hero__star hero__star--c" filled />
        <span className="hero__tiny-heart hero__tiny-heart--a">♥</span>
        <span className="hero__tiny-heart hero__tiny-heart--b">♥</span>
      </div>

      <div className="page-shell hero__inner">
        <div className="hero__copy">
          <motion.div className="hero__eyebrow" {...fadeUp(0.04)}>
            <span className="hero__eyebrow-bow" aria-hidden="true">
              <PinkBow />
            </span>
            <span>{copy.eyebrow}</span>
          </motion.div>

          <motion.h1 id="hero-title" className="hero__title" {...fadeUp(0.1)}>
            <span className="hero__title-line hero__title-line--plain">{copy.titleBefore}</span>
            <span className="hero__title-line">
              <span className="hero__title-accent">{copy.titleAccent}</span>
            </span>
            <span className="hero__title-line">{copy.titleAfter}</span>
            <span className="hero__title-sparkle" aria-hidden="true">
              <Sparkles size={22} />
            </span>
          </motion.h1>

          <motion.p className="hero__subtitle" {...fadeUp(0.2)}>
            {copy.subtitle}
          </motion.p>

          <motion.div className="hero__actions" {...fadeUp(0.28)}>
            <a className="primary-button" href="#memories">
              <span>{copy.primaryButton}</span>
              <ArrowDown size={18} strokeWidth={2.4} aria-hidden="true" />
            </a>

            <a className="text-button" href="#gacha">
              <Heart size={15} fill="currentColor" strokeWidth={2} aria-hidden="true" />
              <span>{copy.secondaryText}</span>
            </a>
          </motion.div>

          <motion.div className="hero__meta" {...fadeUp(0.35)}>
            <span className="hero__meta-dot" aria-hidden="true" />
            <span>{copy.scrollHint}</span>
            {content.meta.birthday ? (
              <span className="hero__birthday">{formatBirthday(content.meta.birthday)} · 生日快乐</span>
            ) : null}
          </motion.div>
        </div>

        <motion.div
          className="hero__art"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 22 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero__halo" aria-hidden="true">
            <span className="hero__halo-ring hero__halo-ring--outer" />
            <span className="hero__halo-ring hero__halo-ring--inner" />
            <span className="hero__halo-dots" />
          </div>

          <span className="hero__doodle-bow" aria-hidden="true">
            <PinkBow tone="lilac" />
          </span>
          <span className="hero__doodle-star hero__doodle-star--one" aria-hidden="true">
            ✦
          </span>
          <span className="hero__doodle-star hero__doodle-star--two" aria-hidden="true">
            ✧
          </span>

          <div className="hero__kitty-wrap">
            <motion.div
              className="hero__kitty-float"
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <HelloKitty className="hero__kitty" label={copy.kittyAriaLabel} />
              <span className="hero__kitty-shadow" aria-hidden="true" />
            </motion.div>
          </div>

          <motion.figure
            className="hero__polaroid"
            initial={reduceMotion ? false : { opacity: 0, rotate: -11, x: -16 }}
            animate={{ opacity: 1, rotate: -7, x: 0 }}
            transition={{ duration: 0.8, delay: 0.62 }}
          >
            <span className="hero__polaroid-tape" aria-hidden="true" />
            <div className="hero__polaroid-photo">
              <PhotoImage
                src={copy.photo}
                alt={copy.photoAlt}
                loading="eager"
                fetchPriority="high"
                sizes="170px"
              />
            </div>
            <figcaption>{copy.photoCaption}</figcaption>
          </motion.figure>

          <motion.div
            className="hero__day-badge"
            initial={reduceMotion ? false : { opacity: 0, rotate: 9, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 7, scale: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.72 }}
          >
            <span className="hero__day-badge-top">{copy.badgeTop}</span>
            <strong>{copy.badgeMain}</strong>
            <span className="hero__day-badge-bottom">{copy.badgeBottom}</span>
            <span className="hero__day-badge-note">{copy.badgeNote}</span>
          </motion.div>

          <motion.span
            className="hero__hand-note"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {copy.floatingNote}
          </motion.span>
        </motion.div>
      </div>

      <a className="hero__scroll-cue" href="#memories" aria-label={copy.scrollHint}>
        <span className="hero__scroll-cue-line" aria-hidden="true" />
        <span className="hero__scroll-cue-heart" aria-hidden="true">
          ♥
        </span>
      </a>
    </section>
  );
}
