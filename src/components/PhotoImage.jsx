import { useState } from "react";
import { content, photoSizes } from "../content/content";
import { HelloKitty } from "./Decorations";

const baseUrl = import.meta.env.BASE_URL;

// 内容文件里用 /photos/xxx 书写；部署到子路径时按 base 自动补全
function resolveSrc(src) {
  if (!src || !src.startsWith("/") || src.startsWith("//")) return src;
  return `${baseUrl}${src.slice(1)}`;
}

export default function PhotoImage({
  src,
  alt = "",
  className = "",
  loading = "lazy",
  fetchPriority,
}) {
  const resolvedSrc = resolveSrc(src);
  const [failedSrc, setFailedSrc] = useState(null);
  const failed = !resolvedSrc || failedSrc === resolvedSrc;

  if (failed) {
    return (
      <div className={`photo-placeholder ${className}`} role="img" aria-label={alt || content.ui.photoFallback}>
        <HelloKitty />
        <span className="photo-placeholder__title">{content.ui.photoFallback}</span>
        <span className="photo-placeholder__hint">{content.ui.photoFallbackHint}</span>
      </div>
    );
  }

  const [width, height] = photoSizes[src] || [];

  return (
    <img
      className={className}
      src={resolvedSrc}
      width={width}
      height={height}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      draggable="false"
      onError={() => setFailedSrc(resolvedSrc)}
    />
  );
}
