import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Gift, Heart, Sparkles, Star } from "lucide-react";
import { content } from "../content/content";
import { HelloKitty, PinkBow, StarDoodle } from "./Decorations";
import PhotoImage from "./PhotoImage";
import SectionHeading from "./SectionHeading";

const CONFETTI = [
  { x: 7, y: 6, rotate: -24, delay: 0, duration: 5.4, type: "heart", tone: "#F48FB1" },
  { x: 18, y: 22, rotate: 32, delay: 0.4, duration: 6.1, type: "star", tone: "#E8C75B" },
  { x: 28, y: 8, rotate: 11, delay: 0.9, duration: 5.1, type: "ribbon", tone: "#E9DDFB" },
  { x: 38, y: 15, rotate: -35, delay: 0.2, duration: 6.4, type: "heart", tone: "#E86B91" },
  { x: 49, y: 5, rotate: 18, delay: 1.2, duration: 5.8, type: "star", tone: "#F4A7C0" },
  { x: 61, y: 17, rotate: -12, delay: 0.6, duration: 5.2, type: "ribbon", tone: "#FFD6E5" },
  { x: 74, y: 7, rotate: 28, delay: 1.5, duration: 6.8, type: "heart", tone: "#F48FB1" },
  { x: 86, y: 19, rotate: -28, delay: 0.3, duration: 5.7, type: "star", tone: "#E8C75B" },
  { x: 94, y: 36, rotate: 14, delay: 1.1, duration: 6.2, type: "ribbon", tone: "#DCC8F7" },
  { x: 12, y: 41, rotate: 9, delay: 1.8, duration: 5.5, type: "star", tone: "#F48FB1" },
  { x: 3, y: 26, rotate: -18, delay: 0.8, duration: 6.6, type: "heart", tone: "#E86B91" },
  { x: 80, y: 44, rotate: 36, delay: 1.4, duration: 5.9, type: "heart", tone: "#F7A5BE" },
];

function Confetti() {
  return (
    <div className="gift-confetti" aria-hidden="true">
      {CONFETTI.map((piece, index) => (
        <span
          key={index}
          className={`gift-confetti__piece gift-confetti__piece--${piece.type}`}
          style={{
            "--x": `${piece.x}%`,
            "--y": `${piece.y}%`,
            "--rotate": `${piece.rotate}deg`,
            "--delay": `${piece.delay}s`,
            "--duration": `${piece.duration}s`,
            "--tone": piece.tone,
          }}
        >
          {piece.type === "heart" ? "♥" : piece.type === "star" ? "✦" : ""}
        </span>
      ))}
    </div>
  );
}

export default function FinalGift() {
  const reduceMotion = useReducedMotion();
  const gift = content.gift;
  const [phase, setPhase] = useState("closed");
  const stageRef = useRef(null);

  const isOpening = phase === "opening";
  const isOpen = phase === "open";

  useEffect(() => {
    if (phase !== "opening") return undefined;
    const timer = window.setTimeout(() => setPhase("open"), reduceMotion ? 120 : 760);
    return () => window.clearTimeout(timer);
  }, [phase, reduceMotion]);

  function openGift() {
    if (phase !== "closed") return;
    setPhase("opening");
  }

  function replayGift() {
    setPhase("closed");
    window.setTimeout(() => {
      stageRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    }, 60);
  }

  return (
    <section id="gift" className="section gift-section" aria-labelledby="gift-title">
      <div className="gift-section__decor" aria-hidden="true">
        <span className="gift-section__night" />
        <span className="gift-section__cloud gift-section__cloud--one" />
        <span className="gift-section__cloud gift-section__cloud--two" />
        <StarDoodle className="gift-section__star gift-section__star--one" filled />
        <StarDoodle className="gift-section__star gift-section__star--two" filled />
        <StarDoodle className="gift-section__star gift-section__star--three" />
        <span className="gift-section__heart gift-section__heart--one">♥</span>
        <span className="gift-section__heart gift-section__heart--two">♥</span>
        <span className="gift-section__kitty">
          <HelloKitty />
        </span>
      </div>

      <div className="page-shell">
        <SectionHeading
          kicker={gift.kicker}
          eyebrow={gift.eyebrow}
          title={gift.title}
          subtitle={gift.subtitle}
          titleId="gift-title"
        />

        <div className={`gift-stage ${isOpen ? "gift-stage--open" : ""}`} ref={stageRef}>
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.div
                className="gift-closed"
                key="closed-gift"
                initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -20, scale: 0.96 }}
                transition={{ duration: 0.45 }}
              >
                <span className="gift-closed__label">
                  <Gift size={15} aria-hidden="true" />
                  {gift.closedLabel}
                  <Sparkles size={15} aria-hidden="true" />
                </span>

                <motion.button
                  type="button"
                  className={`gift-box ${isOpening ? "is-opening" : ""}`}
                  onClick={openGift}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                  aria-expanded={phase !== "closed"}
                  aria-label={`${gift.closedLabel}，${gift.closedHint}`}
                >
                  <span className="gift-box__glow" aria-hidden="true" />

                  <motion.span
                    className="gift-box__lid"
                    animate={isOpening && !reduceMotion ? { y: -82, rotate: -8 } : { y: 0, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 170, damping: 16 }}
                    aria-hidden="true"
                  >
                    <span className="gift-box__lid-ribbon" />
                    <span className="gift-box__bow">
                      <PinkBow />
                    </span>
                    <span className="gift-box__label">
                      <span>{gift.boxFor}</span>
                      <strong>{gift.boxName}</strong>
                    </span>
                  </motion.span>

                  <span className="gift-box__body" aria-hidden="true">
                    <span className="gift-box__body-ribbon" />
                    <span className="gift-box__body-heart">♥</span>
                    <span className="gift-box__body-shine" />
                    <span className="gift-box__tag">
                      <span className="gift-box__tag-kitty">
                        <HelloKitty />
                      </span>
                      <span>{gift.boxTag}</span>
                    </span>
                  </span>

                  <span className="gift-box__ribbon-end gift-box__ribbon-end--one" aria-hidden="true" />
                  <span className="gift-box__ribbon-end gift-box__ribbon-end--two" aria-hidden="true" />
                  <span className="gift-box__sparkle gift-box__sparkle--one" aria-hidden="true">
                    ✦
                  </span>
                  <span className="gift-box__sparkle gift-box__sparkle--two" aria-hidden="true">
                    ✦
                  </span>
                </motion.button>

                <p className="gift-closed__hint">{gift.closedHint}</p>
                <div className="gift-closed__note" aria-hidden="true">
                  <span />
                  <Heart size={12} fill="currentColor" />
                  <span />
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="gift-reveal"
                key="opened-gift"
                initial={reduceMotion ? false : { opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Confetti />

                <p className="gift-reveal__eyebrow">
                  <Star size={13} fill="currentColor" aria-hidden="true" />
                  {gift.openedLabel}
                  <Star size={13} fill="currentColor" aria-hidden="true" />
                </p>

                <div className="gift-reveal__content">
                  <motion.figure
                    className="gift-photo"
                    initial={reduceMotion ? false : { opacity: 0, rotate: -4, y: 24 }}
                    animate={{ opacity: 1, rotate: -2.2, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.12 }}
                  >
                    <span className="gift-photo__tape" aria-hidden="true" />
                    <span className="gift-photo__badge" aria-hidden="true">
                      <span>{gift.photoBadgeTop}</span>
                      <strong>{gift.photoBadgeMain}</strong>
                      <span>{gift.photoBadgeBottom}</span>
                    </span>
                    <div className="gift-photo__frame">
                      <PhotoImage
                        src={gift.photo}
                        alt={gift.photoAlt}
                        sizes="(max-width: 700px) 82vw, 430px"
                      />
                    </div>
                    <figcaption>
                      <Heart size={13} fill="currentColor" aria-hidden="true" />
                      {gift.photoCaption}
                    </figcaption>
                    <span className="gift-photo__bow" aria-hidden="true">
                      <PinkBow tone="cream" />
                    </span>
                  </motion.figure>

                  <motion.article
                    className="gift-letter"
                    initial={reduceMotion ? false : { opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, delay: 0.28 }}
                    aria-labelledby="gift-letter-title"
                  >
                    <span className="gift-letter__tape" aria-hidden="true" />
                    <span className="gift-letter__kitty" aria-hidden="true">
                      <HelloKitty />
                    </span>
                    <span className="gift-letter__label">{gift.letterLabel}</span>
                    <h3 id="gift-letter-title">{gift.letterTitle}</h3>

                    <div className="gift-letter__body">
                      {gift.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>

                    <blockquote className="gift-letter__highlight">
                      <span className="gift-letter__quote" aria-hidden="true">
                        “
                      </span>
                      <p>{gift.highlight}</p>
                      <span className="gift-letter__quote gift-letter__quote--close" aria-hidden="true">
                        ”
                      </span>
                    </blockquote>

                    {gift.birthdayLine ? (
                      <p className="gift-letter__birthday">{gift.birthdayLine}</p>
                    ) : null}
                    <p className="gift-letter__signature">{gift.signature}</p>

                    <div className="gift-letter__footer">
                      <span className="gift-letter__seal" aria-hidden="true">
                        <PinkBow />
                      </span>
                      <button type="button" className="gift-letter__replay" onClick={replayGift}>
                        {gift.replay}
                      </button>
                    </div>
                  </motion.article>
                </div>

                <motion.div
                  className="gift-final-line"
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.75 }}
                >
                  <span className="gift-final-line__bow" aria-hidden="true">
                    <PinkBow />
                  </span>
                  <p>{content.meta.coreLine}</p>
                  <span className="gift-final-line__heart" aria-hidden="true">
                    ♥
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
