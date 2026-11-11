import { ArrowUp, Heart } from "lucide-react";
import { content } from "../content/content";
import { HelloKitty, PinkBow } from "./Decorations";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__bow" aria-hidden="true">
        <PinkBow tone="cream" />
      </div>

      <div className="site-footer__kitty" aria-hidden="true">
        <HelloKitty />
      </div>

      <p className="site-footer__note">{content.footer.note}</p>

      <p className="site-footer__signature">
        <span aria-hidden="true">♥</span>
        {content.footer.signature}
        <span aria-hidden="true">♥</span>
      </p>

      <div className="site-footer__bottom">
        <span>{content.footer.small}</span>
        <span className="site-footer__dot" aria-hidden="true" />
        <span>{content.meta.coreLine}</span>
      </div>

      <a className="site-footer__top" href="#opening">
        <ArrowUp size={15} aria-hidden="true" />
        {content.ui.backToTop}
      </a>

      <Heart className="site-footer__heart" size={18} fill="currentColor" aria-hidden="true" />
    </footer>
  );
}
