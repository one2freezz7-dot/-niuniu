import { useId } from "react";
import { Sparkles, Star } from "lucide-react";

export function HelloKitty({ className = "", label = "" }) {
  const id = useId().replace(/:/g, "");
  const headGradient = `kitty-head-${id}`;
  const bowGradient = `kitty-bow-${id}`;

  return (
    <svg
      className={`kitty-illustration ${className}`}
      viewBox="0 0 320 300"
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : "true"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={headGradient} cx="36%" cy="23%" r="82%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="72%" stopColor="#FFFDFC" />
          <stop offset="100%" stopColor="#FFEFF3" />
        </radialGradient>
        <linearGradient id={bowGradient} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9A8C3" />
          <stop offset="55%" stopColor="#F48FB1" />
          <stop offset="100%" stopColor="#E86B91" />
        </linearGradient>
      </defs>

      <g fill={`url(#${headGradient})`} stroke="#79545C" strokeWidth="5" strokeLinejoin="round">
        <path d="M72 99 49 26c-3-10 7-17 16-10l62 49Z" />
        <path d="m248 99 23-73c3-10-7-17-16-10l-62 49Z" />
        <ellipse cx="160" cy="169" rx="116" ry="98" />
      </g>

      <ellipse cx="160" cy="169" rx="116" ry="98" fill={`url(#${headGradient})`} opacity="0.92" />

      <g fill="#79545C">
        <ellipse cx="113" cy="164" rx="8.5" ry="12" />
        <ellipse cx="207" cy="164" rx="8.5" ry="12" />
      </g>

      <ellipse cx="160" cy="188" rx="10.5" ry="7.5" fill="#F5C34F" stroke="#79545C" strokeWidth="3.5" />

      <g fill="none" stroke="#79545C" strokeWidth="4" strokeLinecap="round">
        <path d="M82 147c-13-2-25-1-36 3" />
        <path d="M80 165c-14 0-26 2-38 7" />
        <path d="M84 182c-12 2-23 6-33 12" />
        <path d="M238 147c13-2 25-1 36 3" />
        <path d="M240 165c14 0 26 2 38 7" />
        <path d="M236 182c12 2 23 6 33 12" />
      </g>

      <g fill="#F8B7CB" opacity="0.55">
        <ellipse cx="93" cy="193" rx="15" ry="8" />
        <ellipse cx="227" cy="193" rx="15" ry="8" />
      </g>

      <g transform="translate(71 54) rotate(-12)">
        <path
          d="M32 27C20 7-10-5-20 12c-11 20 17 39 45 28Z"
          fill={`url(#${bowGradient})`}
          stroke="#79545C"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M35 27C47 7 77-5 87 12c11 20-17 39-45 28Z"
          fill={`url(#${bowGradient})`}
          stroke="#79545C"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <circle cx="33" cy="28" r="15" fill="#F7A5BE" stroke="#79545C" strokeWidth="5" />
        <ellipse cx="29" cy="22" rx="4" ry="5.5" fill="#FFE2EC" opacity="0.9" />
        <circle cx="-2" cy="11" r="3.5" fill="#FFF1F6" opacity="0.75" />
        <circle cx="73" cy="11" r="3.5" fill="#FFF1F6" opacity="0.75" />
      </g>
    </svg>
  );
}

export function PinkBow({ className = "", tone = "pink" }) {
  const palettes = {
    pink: ["#F9A8C3", "#E86B91"],
    cream: ["#FFF7EF", "#FFD6E5"],
    lilac: ["#DCC8F7", "#B990E2"],
  };
  const [light, dark] = palettes[tone] || palettes.pink;

  return (
    <svg
      className={`pink-bow ${className}`}
      viewBox="0 0 120 78"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="#79545C" strokeWidth="4" strokeLinejoin="round">
        <path d="M49 36C35 14 4 3-5 21c-10 21 22 40 54 26Z" fill={dark} />
        <path d="M60 36C74 14 105 3 114 21c10 21-22 40-54 26Z" fill={light} />
        <circle cx="54" cy="38" r="17" fill="#F48FB1" />
      </g>
      <circle cx="49" cy="32" r="4" fill="#FFF2F6" opacity="0.8" />
      <circle cx="18" cy="23" r="3" fill="#FFF2F6" opacity="0.55" />
      <circle cx="91" cy="23" r="3" fill="#FFF2F6" opacity="0.55" />
    </svg>
  );
}

export function StarDoodle({ className = "", filled = false }) {
  return (
    <Star
      className={`doodle star-doodle ${className}`}
      strokeWidth={1.8}
      fill={filled ? "currentColor" : "none"}
      aria-hidden="true"
    />
  );
}

export function SparkleDoodle({ className = "" }) {
  return <Sparkles className={`doodle sparkle-doodle ${className}`} strokeWidth={1.8} aria-hidden="true" />;
}

export function KittySticker({ className = "", text = "" }) {
  return (
    <div className={`kitty-sticker ${className}`}>
      <span className="kitty-sticker__face">
        <HelloKitty />
      </span>
      {text ? <span className="kitty-sticker__text">{text}</span> : null}
    </div>
  );
}

export function HeartDot({ className = "" }) {
  return (
    <span className={`heart-dot ${className}`} aria-hidden="true">
      <span>♥</span>
    </span>
  );
}

export function PaperTape({ className = "", tone = "" }) {
  return <span className={`paper-tape ${tone ? `paper-tape--${tone}` : ""} ${className}`} aria-hidden="true" />;
}

export function GinghamHeart({ className = "" }) {
  return (
    <span className={`gingham-heart ${className}`} aria-hidden="true">
      <span className="gingham-heart__shape" />
    </span>
  );
}
