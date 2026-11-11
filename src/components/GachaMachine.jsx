import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, LockKeyhole, RotateCw, Sparkles, Star } from "lucide-react";
import { content } from "../content/content";
import { loadCollection, pickRandomAvailable, saveCollection } from "../lib/gacha";
import { HelloKitty, PinkBow, StarDoodle } from "./Decorations";
import Modal from "./Modal";
import PhotoImage from "./PhotoImage";
import SectionHeading from "./SectionHeading";

const CAPSULE_POSITIONS = [
  { left: "18%", top: "49%", delay: "0s" },
  { left: "44%", top: "38%", delay: "-1.1s" },
  { left: "70%", top: "47%", delay: "-2.3s" },
  { left: "30%", top: "66%", delay: "-3.4s" },
  { left: "57%", top: "63%", delay: "-1.8s" },
  { left: "78%", top: "69%", delay: "-2.8s" },
];

const RESULT_HEARTS = [
  { x: 8, y: 22, rotate: -18, delay: 0.05, scale: 1 },
  { x: 22, y: 8, rotate: 12, delay: 0.15, scale: 0.8 },
  { x: 42, y: 16, rotate: -8, delay: 0.1, scale: 1.15 },
  { x: 66, y: 7, rotate: 18, delay: 0.2, scale: 0.9 },
  { x: 82, y: 20, rotate: -12, delay: 0.08, scale: 1.05 },
  { x: 91, y: 42, rotate: 8, delay: 0.22, scale: 0.75 },
  { x: 14, y: 48, rotate: 20, delay: 0.26, scale: 0.7 },
  { x: 48, y: 33, rotate: 4, delay: 0.16, scale: 0.7 },
  { x: 73, y: 39, rotate: -22, delay: 0.3, scale: 0.85 },
  { x: 35, y: 5, rotate: 23, delay: 0.12, scale: 0.65 },
];

function Capsule({ item, isCollected, isSpinning, reduceMotion, small = false }) {
  return (
    <motion.span
      className={`capsule ${small ? "capsule--small" : ""} ${isCollected ? "is-collected" : ""}`}
      style={{
        "--capsule": item.color,
        "--capsule-deep": item.colorDeep,
      }}
      animate={
        reduceMotion
          ? { opacity: isCollected ? 0 : 1 }
          : isSpinning
            ? { y: [0, -13, 0, 9, 0], rotate: [0, -14, 10, -8, 0], opacity: isCollected ? 0 : 1 }
            : { y: [0, -3, 0], rotate: [0, -2, 0], opacity: isCollected ? 0 : 1 }
      }
      transition={
        isSpinning && !reduceMotion
          ? { duration: 0.9, repeat: Infinity, delay: Number.parseFloat(item.number) * 0.045, ease: "easeInOut" }
          : { duration: 4 + Number.parseFloat(item.number) * 0.25, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }
      }
      aria-hidden="true"
    >
      <span className="capsule__gloss" />
      <span className="capsule__seam" />
      <span className="capsule__mark">♥</span>
    </motion.span>
  );
}

export default function GachaMachine() {
  const reduceMotion = useReducedMotion();
  const gacha = content.gacha;
  const items = gacha.items;

  const [collection, setCollection] = useState(() => loadCollection(gacha.storageKey, items));
  const [phase, setPhase] = useState("idle");
  const [activeId, setActiveId] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const collectionRef = useRef(collection);
  const lockRef = useRef(false);
  const timersRef = useRef([]);

  const isBusy = phase === "spinning" || phase === "popping";
  const isComplete = collection.length >= items.length;
  const activeItem = activeId ? items.find((item) => item.id === activeId) : null;
  const collectedSet = useMemo(() => new Set(collection), [collection]);

  const collectedItems = useMemo(
    () =>
      collection
        .map((id) => items.find((item) => item.id === id))
        .filter(Boolean),
    [collection, items],
  );

  useEffect(() => {
    collectionRef.current = collection;
    saveCollection(gacha.storageKey, collection);
  }, [collection, gacha.storageKey]);

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
    },
    [],
  );

  function clearTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }

  function drawCapsule() {
    if (lockRef.current || isBusy || isComplete) return;

    lockRef.current = true;
    setModalMode(null);
    setActiveId(null);
    setPhase("spinning");

    const spinDuration = reduceMotion ? 500 : 2100;
    const popDuration = reduceMotion ? 220 : 620;

    const spinTimer = window.setTimeout(() => {
      const chosen = pickRandomAvailable(items, collectionRef.current);
      if (!chosen) {
        setPhase("idle");
        lockRef.current = false;
        return;
      }

      setCollection((previous) => {
        if (previous.includes(chosen.id)) return previous;
        return [...previous, chosen.id];
      });
      setActiveId(chosen.id);
      setPhase("popping");

      const popTimer = window.setTimeout(() => {
        setPhase("idle");
        setModalMode("result");
      }, popDuration);

      timersRef.current.push(popTimer);
    }, spinDuration);

    timersRef.current.push(spinTimer);
  }

  function closeResult() {
    clearTimers();
    setModalMode(null);
    setActiveId(null);
    setPhase("idle");
    lockRef.current = false;
  }

  function reviewItem(item) {
    if (isBusy || !collectedSet.has(item.id)) return;
    lockRef.current = true;
    setActiveId(item.id);
    setModalMode("review");
  }

  function resetDevCollection() {
    if (!import.meta.env.DEV) return;
    clearTimers();
    try {
      window.localStorage.removeItem(gacha.storageKey);
    } catch {
      // localStorage 不可用时，只需要清空页面状态。
    }
    setCollection([]);
    collectionRef.current = [];
    setActiveId(null);
    setModalMode(null);
    setPhase("idle");
    lockRef.current = false;
  }

  const knobLabel = isComplete
    ? gacha.completeLabel
    : phase === "spinning"
      ? gacha.spinningLabel
      : phase === "popping"
        ? gacha.poppingLabel
        : gacha.knobLabel;

  return (
    <section id="gacha" className="section gacha-section" aria-labelledby="gacha-title">
      <div className="gacha-section__decor" aria-hidden="true">
        <span className="gacha-section__check" />
        <span className="gacha-section__cloud gacha-section__cloud--one" />
        <span className="gacha-section__cloud gacha-section__cloud--two" />
        <StarDoodle className="gacha-section__star gacha-section__star--one" filled />
        <StarDoodle className="gacha-section__star gacha-section__star--two" />
        <span className="gacha-section__big-bow">
          <PinkBow tone="lilac" />
        </span>
        <span className="gacha-section__kitty">
          <HelloKitty />
        </span>
      </div>

      <div className="page-shell">
        <SectionHeading
          kicker={gacha.kicker}
          eyebrow={gacha.eyebrow}
          title={gacha.title}
          subtitle={gacha.subtitle}
          titleId="gacha-title"
        />

        <div className="gacha-layout">
          <div className="gacha-machine-column">
            <div className="machine-stage">
              <span className="machine-stage__halo" aria-hidden="true" />
              <span className="machine-stage__note machine-stage__note--left" aria-hidden="true">
                <Star size={12} fill="currentColor" /> {gacha.stageNoteLeft}{" "}
                <Star size={12} fill="currentColor" />
              </span>

              <motion.div
                className={`gacha-machine ${isBusy ? "is-busy" : ""} ${isComplete ? "is-complete" : ""}`}
                animate={
                  !reduceMotion && phase === "spinning"
                    ? { rotate: [0, -1.1, 1.1, 0], y: [0, -3, 1, 0] }
                    : { rotate: 0, y: 0 }
                }
                transition={
                  phase === "spinning" && !reduceMotion
                    ? { duration: 0.58, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.4 }
                }
              >
                <div className="gacha-machine__ears" aria-hidden="true">
                  <span className="gacha-machine__ear gacha-machine__ear--left" />
                  <span className="gacha-machine__ear gacha-machine__ear--right" />
                </div>

                <div className="gacha-machine__bow" aria-hidden="true">
                  <PinkBow />
                </div>

                <div className="gacha-machine__dome-wrap">
                  <div className="gacha-machine__dome">
                    <span className="gacha-machine__dome-shine" aria-hidden="true" />
                    <span className="gacha-machine__dome-glare" aria-hidden="true" />

                    {items.map((item, index) => {
                      if (collectedSet.has(item.id)) return null;
                      const position = CAPSULE_POSITIONS[index % CAPSULE_POSITIONS.length];
                      return (
                        <span
                          key={item.id}
                          className="gacha-machine__capsule-position"
                          style={{ left: position.left, top: position.top }}
                        >
                          <Capsule
                            item={item}
                            isCollected={false}
                            isSpinning={phase === "spinning"}
                            reduceMotion={reduceMotion}
                          />
                        </span>
                      );
                    })}

                    {collection.length === 0 ? (
                      <span className="gacha-machine__dome-label" aria-hidden="true">
                        {gacha.domeLabel}
                      </span>
                    ) : null}

                    {isComplete ? (
                      <motion.span
                        className="gacha-machine__empty-heart"
                        initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        aria-hidden="true"
                      >
                        ♥
                      </motion.span>
                    ) : null}
                  </div>
                </div>

                <div className="gacha-machine__body">
                  <div className="gacha-machine__brand">
                    <span className="gacha-machine__brand-kitty">
                      <HelloKitty />
                    </span>
                    <span className="gacha-machine__brand-text">{gacha.machineLabel}</span>
                    <span className="gacha-machine__brand-hearts" aria-hidden="true">
                      ♥ ✦ ♥
                    </span>
                  </div>

                  <div className="gacha-machine__divider" aria-hidden="true">
                    <span />
                    <Heart size={13} fill="currentColor" />
                    <span />
                  </div>

                  <div className="gacha-machine__controls">
                    <div className="gacha-machine__counter" aria-hidden="true">
                      <span className="gacha-machine__counter-top">{gacha.gaugeLabel}</span>
                      <strong>
                        {collection.length}
                        <span>/{items.length}</span>
                      </strong>
                      <span className="gacha-machine__counter-dots">
                        {items.map((item) => (
                          <span key={item.id} className={collectedSet.has(item.id) ? "is-filled" : ""} />
                        ))}
                      </span>
                    </div>

                    <div className="gacha-machine__knob-area">
                      <motion.button
                        type="button"
                        className={`gacha-machine__knob ${isComplete ? "is-disabled" : ""}`}
                        onClick={drawCapsule}
                        disabled={isComplete || isBusy}
                        aria-label={knobLabel}
                        aria-live="polite"
                        whileTap={reduceMotion || isBusy || isComplete ? undefined : { scale: 0.93 }}
                      >
                        <motion.span
                          className="gacha-machine__knob-disc"
                          animate={{
                            rotate: phase === "spinning" && !reduceMotion ? 360 : 0,
                          }}
                          transition={
                            phase === "spinning" && !reduceMotion
                              ? { duration: 1.05, repeat: Infinity, ease: "linear" }
                              : { duration: 0.3 }
                          }
                          aria-hidden="true"
                        >
                          <RotateCw size={27} strokeWidth={2.2} />
                          <span className="gacha-machine__knob-heart">♥</span>
                        </motion.span>
                        <span className="gacha-machine__knob-ring" aria-hidden="true" />
                      </motion.button>
                      <span className="gacha-machine__knob-label">{knobLabel}</span>
                    </div>
                  </div>

                  <div className="gacha-machine__output">
                    <span className="gacha-machine__output-label" aria-hidden="true">
                      {gacha.outputLabel}
                    </span>
                    <div className="gacha-machine__output-door">
                      <AnimatePresence>
                        {activeItem && (phase === "popping" || modalMode) ? (
                          <motion.span
                            className="gacha-machine__popped-capsule"
                            initial={reduceMotion ? false : { y: -45, opacity: 0, scale: 0.55 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: 12 }}
                            transition={{ type: "spring", stiffness: 210, damping: 16 }}
                            style={{ "--capsule": activeItem.color, "--capsule-deep": activeItem.colorDeep }}
                          >
                            <Capsule item={activeItem} isCollected={false} isSpinning={false} reduceMotion={reduceMotion} small />
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                    </div>
                    <span className="gacha-machine__output-slot" aria-hidden="true" />
                    <span className="gacha-machine__foot" aria-hidden="true">
                      <span className="gacha-machine__foot--left" />
                      <span className="gacha-machine__foot--right" />
                    </span>
                  </div>
                </div>

                <span className="gacha-machine__side-heart gacha-machine__side-heart--one" aria-hidden="true">
                  ♥
                </span>
                <span className="gacha-machine__side-heart gacha-machine__side-heart--two" aria-hidden="true">
                  ♥
                </span>
              </motion.div>

              <span className="machine-stage__note machine-stage__note--right" aria-hidden="true">
                {gacha.stageNoteRight}
              </span>
            </div>

            <p className="gacha-draw-hint">
              <Sparkles size={14} aria-hidden="true" />
              {gacha.drawHint}
            </p>

            <div className="gacha-status" aria-live="polite">
              {isComplete ? (
                <motion.p
                  className="gacha-status__complete"
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Heart size={15} fill="currentColor" aria-hidden="true" />
                  {gacha.allCollected}
                  <Heart size={15} fill="currentColor" aria-hidden="true" />
                </motion.p>
              ) : (
                <p className="gacha-status__progress">
                  {gacha.progressLabel} <strong>{collection.length}</strong> {gacha.progressUnit}
                </p>
              )}
            </div>
          </div>

          <aside className="collection-shelf" aria-labelledby="collection-title">
            <div className="collection-shelf__top">
              <span className="collection-shelf__kicker">{gacha.collectionKicker}</span>
              <span className="collection-shelf__count">
                {collection.length} <span>/ {items.length}</span>
              </span>
            </div>

            <h3 id="collection-title">{gacha.collectionTitle}</h3>
            <p className="collection-shelf__hint">{gacha.collectionHint}</p>

            <div className="collection-shelf__grid">
              {Array.from({ length: items.length }).map((_, index) => {
                const item = collectedItems[index];

                if (!item) {
                  return (
                    <div className="collection-slot collection-slot--empty" key={`empty-${index}`} aria-hidden="true">
                      <span className="collection-slot__lock">
                        <LockKeyhole size={16} strokeWidth={1.8} />
                      </span>
                      <span className="collection-slot__empty-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  );
                }

                return (
                  <motion.button
                    layout
                    type="button"
                    className="collection-slot collection-slot--filled"
                    key={item.id}
                    onClick={() => reviewItem(item)}
                    initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.86 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 20 }}
                    style={{ "--capsule": item.color, "--capsule-deep": item.colorDeep }}
                    aria-label={`${gacha.resultNumberPrefix} ${item.number}：${item.title}`}
                  >
                    <span className="collection-slot__order">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Capsule item={item} isCollected={false} isSpinning={false} reduceMotion={reduceMotion} small />
                    <span className="collection-slot__caption">
                      <span>{gacha.resultNumberPrefix} {item.number}</span>
                      <strong>{item.title}</strong>
                    </span>
                    <span className="collection-slot__sparkle" aria-hidden="true">
                      ✦
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="collection-shelf__message" aria-live="polite">
              {collection.length === 0
                ? gacha.emptyState
                : isComplete
                  ? gacha.allCollected
                  : gacha.collectionHint}
            </div>

            {import.meta.env.DEV ? (
              <button type="button" className="collection-shelf__reset" onClick={resetDevCollection}>
                {gacha.resetDev}
              </button>
            ) : null}
          </aside>
        </div>
      </div>

      <Modal
        open={Boolean(modalMode && activeItem)}
        onClose={closeResult}
        labelledBy="gacha-result-title"
        closeLabel={content.ui.close}
        className="gacha-result-modal"
      >
        {activeItem ? (
          <div className="gacha-result" style={{ "--capsule": activeItem.color, "--capsule-deep": activeItem.colorDeep }}>
            <div className="gacha-result__hearts" aria-hidden="true">
              {RESULT_HEARTS.map((heart, index) => (
                <span
                  key={index}
                  style={{
                    "--x": `${heart.x}%`,
                    "--y": `${heart.y}%`,
                    "--rotate": `${heart.rotate}deg`,
                    "--delay": `${heart.delay}s`,
                    "--scale": heart.scale,
                  }}
                >
                  {index % 3 === 0 ? "✦" : index % 3 === 1 ? "♥" : "✧"}
                </span>
              ))}
            </div>

            <header className="gacha-result__header">
              <span className="gacha-result__eyebrow">{gacha.resultEyebrow}</span>
              <span className="gacha-result__number">
                {gacha.resultNumberPrefix} <strong>{activeItem.number}</strong>
              </span>
            </header>

            <div className="gacha-result__capsule-badge" aria-hidden="true">
              <span className="gacha-result__capsule-ribbon" />
              <Capsule item={activeItem} isCollected={false} isSpinning={false} reduceMotion={reduceMotion} />
            </div>

            <figure className="gacha-result__polaroid">
              <span className="gacha-result__tape" aria-hidden="true" />
              <PhotoImage
                src={activeItem.photo}
                alt={activeItem.photoAlt}
                sizes="(max-width: 600px) 84vw, 460px"
                className="gacha-result__photo"
              />
              <figcaption>
                <span>{gacha.resultNumberPrefix} {activeItem.number}</span>
                <Heart size={12} fill="currentColor" aria-hidden="true" />
              </figcaption>
            </figure>

            <div className="gacha-result__copy">
              <span className="gacha-result__mode">
                {modalMode === "review" ? gacha.reviewHint : gacha.resultViewHint}
              </span>
              <h3 id="gacha-result-title">{activeItem.title}</h3>
              <p>{activeItem.text}</p>
              <span className="gacha-result__ornament" aria-hidden="true">
                ✦ ♥ ✦
              </span>
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  );
}
