import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { content } from "../content/content";
import { HelloKitty, PaperTape, PinkBow, StarDoodle } from "./Decorations";
import Modal from "./Modal";
import PhotoImage from "./PhotoImage";
import SectionHeading from "./SectionHeading";

const TILTS = [-1.8, 1.25, -0.7, 1.9, -1.2, 0.8, -2, 1.35, -0.55, 1.7];

export default function PhotoGallery() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(null);
  const photos = content.gallery.photos;
  const activePhoto = activeIndex === null ? null : photos[activeIndex];

  function closeLightbox() {
    setActiveIndex(null);
  }

  function showPrevious() {
    setActiveIndex((index) => (index === null ? index : (index - 1 + photos.length) % photos.length));
  }

  function showNext() {
    setActiveIndex((index) => (index === null ? index : (index + 1) % photos.length));
  }

  useEffect(() => {
    if (activeIndex === null) return undefined;

    function handleKeyDown(event) {
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) => (index === null ? index : (index - 1 + photos.length) % photos.length));
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index === null ? index : (index + 1) % photos.length));
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, photos.length]);

  return (
    <section id="memories" className="section gallery-section" aria-labelledby="gallery-title">
      <div className="gallery-section__decor" aria-hidden="true">
        <span className="gallery-section__grid" />
        <span className="gallery-section__big-heart">♡</span>
        <StarDoodle className="gallery-section__star gallery-section__star--one" filled />
        <StarDoodle className="gallery-section__star gallery-section__star--two" />
      </div>

      <div className="page-shell">
        <div className="gallery-heading-row">
          <SectionHeading
            kicker={content.gallery.kicker}
            eyebrow={content.gallery.eyebrow}
            title={content.gallery.title}
            subtitle={content.gallery.subtitle}
            align="left"
            className="gallery-heading"
            titleId="gallery-title"
          />

          <motion.div
            className="gallery-heading-sticker"
            initial={reduceMotion ? false : { opacity: 0, rotate: -8, y: 18 }}
            whileInView={{ opacity: 1, rotate: -4, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.16 }}
            aria-hidden="true"
          >
            <span className="gallery-heading-sticker__face">
              <HelloKitty />
            </span>
            <span className="gallery-heading-sticker__text">
              <Heart size={13} fill="currentColor" />
              {content.ui.galleryCount}
            </span>
            <span className="gallery-heading-sticker__bow">
              <PinkBow />
            </span>
          </motion.div>
        </div>

        <p className="gallery-footnote">
          <span className="gallery-footnote__bow" aria-hidden="true">
            <PinkBow />
          </span>
          {content.gallery.footnote}
        </p>

        <div className="gallery-wall">
          {photos.map((photo, index) => {
            const tilt = TILTS[index % TILTS.length];
            const number = String(index + 1).padStart(2, "0");

            return (
              <motion.div
                className={`gallery-item ${index % 7 === 3 ? "gallery-item--feature" : ""}`}
                key={photo.id}
                initial={reduceMotion ? false : { opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.56, delay: (index % 4) * 0.055, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  className="polaroid-card"
                  style={{ "--tilt": `${tilt}deg` }}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`${content.ui.viewPhoto}：${photo.title}`}
                >
                  <PaperTape
                    className={`polaroid-card__tape ${index % 3 === 1 ? "polaroid-card__tape--right" : ""}`}
                    tone={index % 4 === 2 ? "lilac" : "pink"}
                  />
                  <span className="polaroid-card__number" aria-hidden="true">
                    {number}
                  </span>

                  <span className="polaroid-card__photo">
                    <PhotoImage
                      src={photo.photo}
                      alt={photo.alt}
                      sizes="(max-width: 700px) 46vw, (max-width: 1100px) 32vw, 24vw"
                    />
                  </span>

                  <span className="polaroid-card__caption">
                    <span className="polaroid-card__meta">
                      <span>{photo.date || photo.indexLabel}</span>
                      <Heart size={11} fill="currentColor" aria-hidden="true" />
                    </span>
                    <span className="polaroid-card__title">{photo.title}</span>
                    <span className="polaroid-card__description">{photo.description}</span>
                  </span>

                  <span className="polaroid-card__sparkle" aria-hidden="true">
                    ✦
                  </span>
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="gallery-end-note" aria-hidden="true">
          <span className="gallery-end-note__line" />
          <span className="gallery-end-note__bow">
            <PinkBow />
          </span>
          <span className="gallery-end-note__line" />
        </div>
      </div>

      <Modal
        open={activeIndex !== null}
        onClose={closeLightbox}
        labelledBy="photo-lightbox-title"
        closeLabel={content.ui.close}
        className="photo-lightbox-modal"
      >
        {activePhoto ? (
          <div className="photo-lightbox">
            <div className="photo-lightbox__stage">
              <PhotoImage
                src={activePhoto.photo}
                alt={activePhoto.alt}
                sizes="(max-width: 700px) 88vw, 760px"
                className="photo-lightbox__image"
              />

              <button
                type="button"
                className="photo-lightbox__arrow photo-lightbox__arrow--prev"
                onClick={showPrevious}
                aria-label={content.ui.previous}
              >
                <ChevronLeft size={22} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="photo-lightbox__arrow photo-lightbox__arrow--next"
                onClick={showNext}
                aria-label={content.ui.next}
              >
                <ChevronRight size={22} aria-hidden="true" />
              </button>
            </div>

            <div className="photo-lightbox__caption">
              <div className="photo-lightbox__eyebrow">
                <span>
                  {activePhoto.date || activePhoto.indexLabel}
                </span>
                <span className="photo-lightbox__count">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
                </span>
              </div>
              <h3 id="photo-lightbox-title">{activePhoto.title}</h3>
              <p>{activePhoto.description}</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  );
}
