import { motion, useReducedMotion } from "framer-motion";
import { PinkBow } from "./Decorations";

export default function SectionHeading({
  kicker,
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
  titleId,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <header className={`section-heading section-heading--${align} ${className}`}>
      <motion.div
        className="section-heading__meta"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.5 }}
      >
        <span className="section-heading__bow" aria-hidden="true">
          <PinkBow />
        </span>
        <span>{kicker}</span>
        <span className="section-heading__dot" aria-hidden="true" />
        <span className="section-heading__eyebrow">{eyebrow}</span>
      </motion.div>

      <motion.h2
        id={titleId}
        className="section-heading__title"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.62, delay: 0.05 }}
      >
        {title}
      </motion.h2>

      <motion.div
        className="section-heading__underline"
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.16 }}
        aria-hidden="true"
      >
        <span className="section-heading__line" />
        <span className="section-heading__heart">♥</span>
        <span className="section-heading__line" />
      </motion.div>

      {subtitle ? (
        <motion.p
          className="section-heading__subtitle"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          {subtitle}
        </motion.p>
      ) : null}
    </header>
  );
}
