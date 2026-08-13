import React from "react";

/**
 * Animated social-post icon.
 *
 * On hover (the SVG itself, OR any ancestor with the class `social-trigger`):
 *   - the avatar gives a small pop
 *   - the three content bars erase and "type" back in, left-to-right,
 *     staggered: handle line A → handle line B → body line
 *
 * Usage:
 *   <SocialIcon />                       // 16px, currentColor
 *   <SocialIcon size={24} />
 *
 *   <button className="social-trigger">
 *     <SocialIcon /> Posts
 *   </button>
 */

export interface SocialIconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Pixel size (width = height). Default 16. */
  size?: number | string;
  /** Fill color. Default `currentColor`. */
  color?: string;
  /** One full cycle in ms. Default 1600. */
  duration?: number;
  /** Disable the hover animation. */
  disabled?: boolean;
}

const STYLE_ID = "social-icon-anim-styles";

const CSS = `
.social-icon{
  display:inline-block;
  vertical-align:middle;
  overflow:visible;
}
/* every animated sub-part scales from its own left edge */
.social-icon .social-avatar,
.social-icon .social-bar-a,
.social-icon .social-bar-b,
.social-icon .social-bar-c{
  transform-box:fill-box;
  transform-origin:left center;
}
/* avatar pivots from its own center, not its left edge */
.social-icon .social-avatar{
  transform-origin:center center;
}

/* Hover on the icon itself OR on any ancestor with .social-trigger */
.social-icon:hover .social-avatar,
.social-trigger:hover .social-icon .social-avatar{
  animation:social-avatar-pop var(--social-duration,1600ms) ease-in-out infinite;
}
.social-icon:hover .social-bar-a,
.social-trigger:hover .social-icon .social-bar-a{
  animation:social-bar-type var(--social-duration,1600ms) ease-in-out 0ms infinite;
}
.social-icon:hover .social-bar-b,
.social-trigger:hover .social-icon .social-bar-b{
  animation:social-bar-type var(--social-duration,1600ms) ease-in-out 120ms infinite;
}
.social-icon:hover .social-bar-c,
.social-trigger:hover .social-icon .social-bar-c{
  animation:social-bar-type var(--social-duration,1600ms) ease-in-out 240ms infinite;
}

.social-icon[data-disabled="true"] *{ animation:none !important; transform:none !important; }

@keyframes social-avatar-pop{
  0%   { transform:scale(1);    }
  18%  { transform:scale(1.08); }
  35%  { transform:scale(1);    }
  100% { transform:scale(1);    }
}
@keyframes social-bar-type{
  0%   { transform:scaleX(1); }   /* full */
  15%  { transform:scaleX(1); }   /* hold a beat */
  22%  { transform:scaleX(0); }   /* quick erase */
  60%  { transform:scaleX(1); }   /* type back in */
  100% { transform:scaleX(1); }
}

@media (prefers-reduced-motion: reduce){
  .social-icon *{ animation:none !important; transform:none !important; }
}
`;

function useSocialStyles() {
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

export const SocialIcon: React.FC<SocialIconProps> = ({
  size = 16,
  color = "currentColor",
  duration = 1600,
  disabled = false,
  className,
  style,
  ...rest
}) => {
  useSocialStyles();

  return (
    <svg
      className={["social-icon", className].filter(Boolean).join(" ")}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={color}
      data-disabled={disabled ? "true" : undefined}
      style={{ ["--social-duration" as any]: `${duration}ms`, ...style }}
      aria-hidden={rest["aria-label"] ? undefined : true}
      {...rest}
    >
      {/* Frame — outer rounded rect with inner hollow (evenodd) */}
      <path
        fillRule="evenodd"
        d="M1.33325 2.66667C1.33325 2.29848 1.63173 2 1.99992 2H13.9999C14.3681 2 14.6666 2.29848 14.6666 2.66667V13.3333C14.6666 13.7015 14.3681 14 13.9999 14H1.99992C1.63173 14 1.33325 13.7015 1.33325 13.3333V2.66667ZM2.66659 3.33333V12.6667H13.3333V3.33333H2.66659Z"
      />
      {/* Avatar — square with inner cutout (evenodd) */}
      <path
        className="social-avatar"
        fillRule="evenodd"
        d="M3.99992 4.66667H7.99992V8.66667H3.99992V4.66667ZM5.33325 6V7.33333H6.66658V6H5.33325Z"
      />
      {/* Handle / name lines — top right */}
      <rect
        className="social-bar-a"
        x="9.33325"
        y="4.66667"
        width="2.66665"
        height="1.33333"
      />
      <rect
        className="social-bar-b"
        x="9.33325"
        y="7.33333"
        width="2.66665"
        height="1.33334"
      />
      {/* Body line — bottom */}
      <rect
        className="social-bar-c"
        x="3.99992"
        y="10"
        width="7.99998"
        height="1.33333"
      />
    </svg>
  );
};

export default SocialIcon;
