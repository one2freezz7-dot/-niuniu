import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, MailOpen, Sparkles } from "lucide-react";
import { content } from "../content/content";
import { HelloKitty, PinkBow, StarDoodle } from "./Decorations";
import SectionHeading from "./SectionHeading";

export default function LoveLetter() {
  const reduceMotion = useReducedMotion();
  const letter = content.letter;
  const [phase, setPhase] = useState("closed");
  const [typedLength, setTypedLength] = useState(0);
  const restartRef = useRef(null);
  const isOpen = phase === "open";

  const bodyText = useMemo(() => letter.paragraphs.join("\n\n"), [letter.paragraphs]);
  const characters = useMemo(() => Array.from(bodyText), [bodyText]);
  const displayedLength = reduceMotion && isOpen ? characters.length : typedLength;
  const typedText = characters.slice(0, displayedLength).join("");
  const typingComplete = displayedLength >= characters.length;

  useEffect(() => {
    if (phase !== "opening") return undefined;
    const timer = window.setTimeout(() => {
      setTypedLength(0);
      setPhase("open");
    }, reduceMotion ? 150 : 760);
    return () => window.clearTimeout(timer);
  }, [phase, reduceMotion]);

  useEffect(() => {
    if (!isOpen || reduceMotion) return undefined;

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTypedLength(index);
      if (index >= characters.length) window.clearInterval(timer);
    }, 26);

    return () => window.clearInterval(timer);
  }, [isOpen, characters.length, reduceMotion]);

  useEffect(
    () => () => {
      if (restartRef.current) window.clearTimeout(restartRef.current);
    },
    [],
  );

  function openEnvelope() {
    if (phase !== "closed") return;
    setPhase("opening");
  }

  function skipTyping() {
    setTypedLength(characters.length);
  }

  function replayLetter() {
    setPhase("closed");
    setTypedLength(0);
    restartRef.current = window.setTimeout(() => {
      document.getElementById("letter-stage")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    }, 50);
  }

  return (
    <section id="letter" className="section letter-section" aria-labelledby="letter-title">
      <div className="letter-section__decor" aria-hidden="true">
        <span className="letter-section__blob letter-section__blob--one" />
        <span className="letter-section__blob letter-section__blob--two" />
        <span className="letter-section__check" />
        <StarDoodle className="letter-section__star letter-section__star--one" filled />
        <StarDoodle className="letter-section__star letter-section__star--two" />
        <span className="letter-section__floating-heart letter-section__floating-heart--one">♥</span>
        <span className="letter-section__floating-heart letter-section__floating-heart--two">♥</span>
      </div>

      <div className="page-shell">
        <SectionHeading
          kicker={letter.kicker}
          eyebrow={letter.eyebrow}
          title={letter.title}
          subtitle={letter.subtitle}
          titleId="letter-title"
        />

        <div id="letter-stage" className={`letter-stage ${isOpen ? "letter-stage--open" : ""}`}>
          <div className="letter-stage__kitty" aria-hidden="true">
            <span className="letter-stage__kitty-inner">
              <HelloKitty />
            </span>
            <span className="letter-stage__kitty-bow">
              <PinkBow />
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {!isOpen ? (
              <motion.div
                className="envelope-wrap"
                key="envelope"
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -30, scale: 0.96 }}
                transition={{ duration: 0.42 }}
              >
                <motion.button
                  type="button"
                  className={`envelope ${phase === "opening" ? "is-opening" : ""}`}
                  onClick={openEnvelope}
                  whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                  aria-expanded={phase !== "closed"}
                  aria-label={`${letter.envelopeHint}，${letter.envelopeTo}`}
                >
                  <span className="envelope__back" aria-hidden="true" />
                  <span className="envelope__peek" aria-hidden="true">
                    <span className="envelope__peek-lines" />
                    <span className="envelope__peek-heart">♥</span>
                  </span>
                  <span className="envelope__pocket" aria-hidden="true" />
                  <span className="envelope__flap" aria-hidden="true" />
                  <span className="envelope__address">
                    <span className="envelope__to">{letter.envelopeTo}</span>
                    <span className="envelope__from">{letter.envelopeFrom}</span>
                  </span>
                  <span className="envelope__seal" aria-hidden="true">
                    <span className="envelope__seal-bow">
                      <PinkBow />
                    </span>
                    <span>{letter.envelopeSeal}</span>
                  </span>
                  <span className="envelope__heart-sticker" aria-hidden="true">
                    ♥
                  </span>
                  <span className="envelope__hint">
                    <MailOpen size={16} aria-hidden="true" />
                    {letter.envelopeHint}
                  </span>
                </motion.button>

                <motion.div
                  className="envelope-caption"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <span className="envelope-caption__line" />
                  <Sparkles size={14} aria-hidden="true" />
                  <span>{letter.envelopeFrom}</span>
                  <Sparkles size={14} aria-hidden="true" />
                  <span className="envelope-caption__line" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.article
                className="letter-card"
                key="letter"
                initial={reduceMotion ? false : { opacity: 0, y: 54, scale: 0.965 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                aria-labelledby="letter-paper-title"
              >
                <span className="letter-card__tape letter-card__tape--left" aria-hidden="true" />
                <span className="letter-card__tape letter-card__tape--right" aria-hidden="true" />
                <span className="letter-card__watermark" aria-hidden="true">
                  <HelloKitty />
                </span>

                <header className="letter-card__header">
                  <span className="letter-card__label">{letter.letterLabel}</span>
                  <span className="letter-card__stamp" aria-hidden="true">
                    <span className="letter-card__stamp-bow">
                      <PinkBow />
                    </span>
                    <span>{letter.stampText}</span>
                  </span>
                </header>

                <h3 id="letter-paper-title" className="letter-card__greeting">
                  {letter.greeting}
                </h3>

                <div className="letter-card__body" aria-hidden="true">
                  <div className="letter-card__typed">
                    {typedText}
                    {!typingComplete ? <span className="letter-card__caret" /> : null}
                  </div>
                </div>

                {typingComplete ? (
                  <motion.div
                    className="letter-card__rest"
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                  >
                    <p className="letter-card__highlight">
                      <Heart size={15} fill="currentColor" aria-hidden="true" />
                      <span>{letter.highlight}</span>
                      <Heart size={15} fill="currentColor" aria-hidden="true" />
                    </p>
                    {letter.closing ? (
                      <p className="letter-card__closing">{letter.closing}</p>
                    ) : null}
                    <p className="letter-card__signature">{letter.signature}</p>
                  </motion.div>
                ) : (
                  <button type="button" className="letter-card__skip" onClick={skipTyping}>
                    {content.ui.letterSkip}
                  </button>
                )}

                <p className="letter-card__ps">{letter.ps}</p>

                <div className="letter-card__footer">
                  <span className="letter-card__footer-bow" aria-hidden="true">
                    <PinkBow />
                  </span>
                  <button type="button" className="letter-card__replay" onClick={replayLetter}>
                    {content.ui.letterReplay}
                  </button>
                </div>

                <div className="sr-only">
                  <p>{letter.greeting}</p>
                  {letter.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  <p>{letter.highlight}</p>
                  {letter.closing ? <p>{letter.closing}</p> : null}
                  <p>{letter.signature}</p>
                  <p>{letter.ps}</p>
                </div>
              </motion.article>
            )}
          </AnimatePresence>

          <div className="letter-stage__below" aria-hidden="true">
            <span />
            <Heart size={13} fill="currentColor" />
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}
