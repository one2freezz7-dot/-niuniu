import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { content } from "../content/content";
import { HelloKitty, PinkBow, StarDoodle } from "./Decorations";
import PhotoImage from "./PhotoImage";
import SectionHeading from "./SectionHeading";

export default function Timeline() {
  const reduceMotion = useReducedMotion();
  const timeline = content.timeline;

  return (
    <section id="timeline" className="section timeline-section" aria-labelledby="timeline-title">
      <div className="timeline-section__decor" aria-hidden="true">
        <span className="timeline-section__cloud timeline-section__cloud--one" />
        <span className="timeline-section__cloud timeline-section__cloud--two" />
        <StarDoodle className="timeline-section__star timeline-section__star--one" filled />
        <StarDoodle className="timeline-section__star timeline-section__star--two" />
        <span className="timeline-section__heart timeline-section__heart--one">♥</span>
        <span className="timeline-section__heart timeline-section__heart--two">♥</span>
        <span className="timeline-section__kitty">
          <HelloKitty />
        </span>
        <span className="timeline-section__bow">
          <PinkBow />
        </span>
      </div>

      <div className="page-shell">
        <SectionHeading
          kicker={timeline.kicker}
          eyebrow={timeline.eyebrow}
          title={timeline.title}
          subtitle={timeline.subtitle}
          titleId="timeline-title"
        />

        <div className="timeline">
          <span className="timeline__line" aria-hidden="true" />

          {timeline.nodes.map((node, index) => {
            const isRight = index % 2 === 1;
            const number = String(index + 1).padStart(2, "0");

            return (
              <motion.article
                className={`timeline-item ${isRight ? "timeline-item--right" : ""} ${
                  node.placeholder ? "timeline-item--placeholder" : ""
                }`}
                key={node.id}
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, x: isRight ? 36 : -36, y: 22 }
                }
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.66, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="timeline-item__card-wrap">
                  <div className="timeline-item__card">
                    <div className="timeline-item__topline">
                      <span className="timeline-item__date">{node.date}</span>
                      <span className="timeline-item__tag">{node.tag}</span>
                    </div>

                    {node.photo ? (
                      <div className="timeline-item__photo">
                        <PhotoImage
                          src={node.photo}
                          alt={node.photoAlt}
                          sizes="(max-width: 700px) 84vw, 410px"
                        />
                        <span className="timeline-item__photo-corner" aria-hidden="true">
                          <PinkBow />
                        </span>
                      </div>
                    ) : (
                      <div className="timeline-item__blank" aria-hidden="true">
                        <span className="timeline-item__blank-kitty">
                          <HelloKitty />
                        </span>
                        <span className="timeline-item__blank-line" />
                        <span className="timeline-item__blank-line timeline-item__blank-line--short" />
                        <span className="timeline-item__blank-stars">✦ ♥ ✦</span>
                      </div>
                    )}

                    <div className="timeline-item__body">
                      <span className="timeline-item__eyebrow">{node.eyebrow}</span>
                      <h3>{node.title}</h3>
                      <p>{node.text}</p>
                    </div>

                    <span className="timeline-item__number" aria-hidden="true">
                      {number}
                    </span>
                  </div>
                </div>

                <div className="timeline-item__axis" aria-hidden="true">
                  <span className="timeline-item__pulse" />
                  <span className="timeline-item__node">
                    <Heart size={14} fill="currentColor" strokeWidth={1.8} />
                  </span>
                </div>

                <div className="timeline-item__ornament" aria-hidden="true">
                  {index % 2 === 0 ? (
                    <span className="timeline-item__kitty">
                      <HelloKitty />
                    </span>
                  ) : (
                    <span className="timeline-item__bow">
                      <PinkBow tone={index === 1 ? "lilac" : "pink"} />
                    </span>
                  )}
                  <span className="timeline-item__hand-note">
                    {index === timeline.nodes.length - 1
                      ? content.ui.timelineToBeContinued
                      : `${content.ui.timelineChapter} ${number}`}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
