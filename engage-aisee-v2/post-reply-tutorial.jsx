/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// post-reply-tutorial.jsx → app/(pages)/engage/_components/post-reply-tutorial.tsx
//
// Looping tutorial that teaches users how to POST their reply on X.
// Sits BEFORE <CopyLinkTutorial> in the Engage flow (step "post" → step "copy link").
//
// Choreography (4 phases):
//   0) cursor enters, glides onto the empty reply box, clicks → input focuses
//   1) reply text auto-types into the box; gray "Reply" button activates to black
//   2) cursor glides to the Reply button, click-press
//   3) compose box morphs into the posted reply card (success state)
//   → loop
// ─────────────────────────────────────────────────────────────────────────────

const { useState: useStatePRT, useEffect: useEffectPRT, useRef: useRefPRT } = React;

const REPLY_TEXT_PRT = "Thanks for sharing this — I found the part about onboarding new users especially useful.";

// ── X action glyphs (success state bottom row, reused from copy-link-tutorial) ─
const XGlyphPRT = {
  Reply: (props) => (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M1.75659 6.82329C1.75659 4.13091 3.93974 1.9502 6.63273 1.9502H9.29223C12.0273 1.9502 14.2439 4.16745 14.2439 6.90248C14.2439 8.70553 13.265 10.3624 11.688 11.2334L6.78197 13.9502V11.7025H6.74116C4.00613 11.7634 1.75659 9.56441 1.75659 6.82329ZM6.63273 3.16847C4.61223 3.16847 2.97487 4.80705 2.97487 6.82329C2.97487 8.87608 4.66218 10.5268 6.71375 10.4842L6.92756 10.4781H8.00025V11.8791L11.0989 10.1675C12.2874 9.50959 13.0256 8.26086 13.0256 6.90248C13.0256 4.8375 11.3542 3.16847 9.29223 3.16847H6.63273Z"/>
    </svg>
  ),
  Repost: (props) => (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M4.04001 3.71289L6.38007 5.89878L5.65989 6.66965L4.568 5.65062V10.1122C4.568 10.6929 5.04108 11.1681 5.62399 11.1681H8.52794V12.2241H5.62399C4.45765 12.2241 3.51202 11.279 3.51202 10.1122V5.65062L2.42013 6.66965L1.69995 5.89878L4.04001 3.71289ZM10.3759 4.83223H7.47196V3.77625H10.3759C11.5422 3.77625 12.4879 4.72136 12.4879 5.88822V10.3498L13.5798 9.33073L14.3 10.1016L11.9599 12.2875L9.61983 10.1016L10.34 9.33073L11.4319 10.3498V5.88822C11.4319 5.30743 10.9588 4.83223 10.3759 4.83223Z"/>
    </svg>
  ),
  Heart: (props) => (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M11.1121 4.23884C10.3544 4.20164 9.45112 4.55503 8.70032 5.578L8.20124 6.25378L7.70154 5.578C6.95012 4.55503 6.04619 4.20164 5.28857 4.23884C4.51793 4.28224 3.83223 4.72243 3.48443 5.42301C3.1422 6.11738 3.09198 7.14655 3.7814 8.41131C4.44726 9.63268 5.80067 11.0586 8.20124 12.5094C10.6006 11.0586 11.9534 9.63268 12.6192 8.41131C13.308 7.14655 13.2578 6.11738 12.915 5.42301C12.5671 4.72243 11.8821 4.28224 11.1121 4.23884ZM13.7079 9.00649C12.8703 10.544 11.2274 12.1808 8.51309 13.7617L8.20124 13.9477L7.88877 13.7617C5.17387 12.1808 3.53092 10.544 2.69209 9.00649C1.84892 7.45654 1.81792 5.99339 2.37342 4.87122C2.92334 3.76146 4.01451 3.06708 5.22595 3.00508C6.24954 2.94928 7.31405 3.35227 8.20062 4.25124C9.08657 3.35227 10.1511 2.94928 11.174 3.00508C12.3855 3.06708 13.4767 3.76146 14.0266 4.87122C14.5821 5.99339 14.5511 7.45654 13.7079 9.00649Z"/>
    </svg>
  ),
  View: (props) => (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M5.96875 13.25V2H7.21875V13.25H5.96875ZM11.75 13.25V5.4375H13V13.25H11.75ZM3 13.25L3.0025 7H4.2525L4.25 13.25H3ZM8.78 13.25V8.875H10.03V13.25H8.78Z"/>
    </svg>
  ),
  Bookmark: (props) => (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M4 4.25C4 3.56 4.5595 3 5.25 3H10.75C11.4405 3 12 3.56 12 4.25V13.47L8 10.615L4 13.47V4.25ZM5.25 4C5.112 4 5 4.11 5 4.25V11.53L8 9.385L11 11.53V4.25C11 4.11 10.888 4 10.75 4H5.25Z"/>
    </svg>
  ),
  Share: (props) => (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M8 3L11.1667 6.16667L10.3833 6.95556L8.55556 5.12222V10.45H7.44444V5.12222L5.61111 6.95556L4.82778 6.16667L8 3ZM13 9.89444L12.9889 11.8444C12.9889 12.6111 12.3667 13.2278 11.6 13.2278H4.38889C3.61667 13.2278 3 12.6056 3 11.8389V9.89444H4.11111V11.8389C4.11111 11.9944 4.23333 12.1167 4.38889 12.1167H11.6C11.7556 12.1167 11.8778 11.9944 11.8778 11.8389L11.8889 9.89444H13Z"/>
    </svg>
  ),
};

// ── Compose action icons (official X glyphs, supplied as SVGs) ───────────────
const ComposeIconsPRT = {
  Image: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M15 7c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M14.1 2.5c1.103 0 1.991-.001 2.709.058.728.06 1.368.185 1.96.487.941.48 1.707 1.245 2.186 2.185.302.593.428 1.233.487 1.961.059.718.058 1.606.058 2.71V14.1c0 1.103.001 1.991-.058 2.709-.06.728-.185 1.368-.487 1.96-.48.941-1.245 1.707-2.185 2.186-.593.302-1.233.428-1.961.487-.718.059-1.606.058-2.71.058H9.9c-1.103 0-1.991.001-2.709-.058-.728-.06-1.368-.185-1.96-.487-.941-.48-1.707-1.245-2.186-2.185-.302-.593-.428-1.233-.487-1.961-.059-.718-.058-1.606-.058-2.71V9.9c0-1.103-.001-1.991.058-2.709.06-.728.185-1.368.487-1.96.48-.941 1.245-1.707 2.185-2.186.593-.302 1.233-.428 1.961-.487.718-.059 1.606-.058 2.71-.058H14.1zM4.506 15.442c.006.473.017.865.045 1.203.05.606.142.954.276 1.217.288.565.746 1.023 1.31 1.31.264.135.612.228 1.217.277.617.05 1.41.051 2.546.051h4.2c.36 0 .685-.003.981-.005L7.96 12.373l-3.453 3.07zM9.9 4.5c-1.136 0-1.929 0-2.546.05-.605.05-.953.143-1.216.277-.565.288-1.023.746-1.31 1.31-.135.264-.228.612-.277 1.217C4.5 7.971 4.5 8.764 4.5 9.9v2.873l3.54-3.147 9.63 9.63c.07-.026.133-.053.192-.083.565-.288 1.023-.746 1.31-1.31.135-.264.228-.612.277-1.218.05-.616.051-1.409.051-2.545V9.9c0-1.136 0-1.929-.05-2.546-.05-.605-.143-.953-.277-1.216-.288-.565-.746-1.023-1.31-1.31-.264-.135-.612-.228-1.218-.277C16.03 4.5 15.236 4.5 14.1 4.5H9.9z"/>
    </svg>
  ),
  Gif: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M8.623 9.25c.766 0 1.532.344 2.043.945l-1.021.86c-.256-.258-.682-.43-1.022-.43-.766 0-1.361.688-1.361 1.375 0 .773.595 1.375 1.361 1.375.255 0 .511-.086.682-.172v-.515H8.283v-1.032h2.383v2.149c-.51.601-1.192.945-2.043.945C7.091 14.75 5.9 13.547 5.9 12s1.191-2.75 2.723-2.75zm4.511 5.5h-1.447v-5.5h1.447v5.5zm4.766-5.5v1.46h-2.297v.86h1.702v1.461h-1.703v1.719h-1.447v-5.5H17.9z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M14.1 2.5c1.103 0 1.991-.001 2.709.058.728.06 1.368.185 1.96.487.941.48 1.707 1.245 2.186 2.185.302.593.428 1.233.487 1.961.059.718.058 1.606.058 2.71V14.1c0 1.103.001 1.991-.058 2.709-.06.728-.185 1.368-.487 1.96-.48.941-1.245 1.707-2.185 2.186-.593.302-1.233.428-1.961.487-.718.059-1.606.058-2.71.058H9.9c-1.103 0-1.991.001-2.709-.058-.728-.06-1.368-.185-1.96-.487-.941-.48-1.707-1.245-2.186-2.185-.302-.593-.428-1.233-.487-1.961-.059-.718-.058-1.606-.058-2.71V9.9c0-1.103-.001-1.991.058-2.709.06-.728.185-1.368.487-1.96.48-.941 1.245-1.707 2.185-2.186.593-.302 1.233-.428 1.961-.487.718-.059 1.606-.058 2.71-.058H14.1zm-4.2 2c-1.136 0-1.929 0-2.546.05-.605.05-.953.143-1.216.277-.565.288-1.023.746-1.31 1.31-.135.264-.228.612-.277 1.217C4.5 7.971 4.5 8.764 4.5 9.9v4.2c0 1.136 0 1.929.05 2.545.05.606.143.954.277 1.217.288.565.746 1.023 1.31 1.31.264.135.612.228 1.217.277.617.05 1.41.051 2.546.051h4.2c1.136 0 1.929 0 2.545-.05.606-.05.954-.143 1.217-.277.565-.288 1.023-.746 1.31-1.31.135-.264.228-.612.277-1.218.05-.616.051-1.409.051-2.545V9.9c0-1.136 0-1.929-.05-2.546-.05-.605-.143-.953-.277-1.216-.288-.565-.746-1.023-1.31-1.31-.264-.135-.612-.228-1.218-.277C16.03 4.5 15.236 4.5 14.1 4.5H9.9z"/>
    </svg>
  ),
  Grok: (p) => (
    <svg viewBox="0 0 33 32" fill="currentColor" {...p}>
      <path d="M12.745 20.54l10.97-8.19c.539-.4 1.307-.244 1.564.38 1.349 3.288.746 7.241-1.938 9.955-2.683 2.714-6.417 3.31-9.83 1.954l-3.728 1.745c5.347 3.697 11.84 2.782 15.898-1.324 3.219-3.255 4.216-7.692 3.284-11.693l.008.009c-1.351-5.878.332-8.227 3.782-13.031L33 0l-4.54 4.59v-.014L12.743 20.544m-2.263 1.987c-3.837-3.707-3.175-9.446.1-12.755 2.42-2.449 6.388-3.448 9.852-1.979l3.72-1.737c-.67-.49-1.53-1.017-2.515-1.387-4.455-1.854-9.789-.931-13.41 2.728-3.483 3.523-4.579 8.94-2.697 13.561 1.405 3.454-.899 5.898-3.22 8.364C1.49 30.2.666 31.074 0 32l10.478-9.466"/>
    </svg>
  ),
  Emoji: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M8.688 13.453c.067.13.137.248.215.367.683 1.058 1.875 1.658 3.1 1.655 1.225.005 2.416-.593 3.095-1.652.077-.119.146-.238.212-.367l1.38.588c-.07.188-.146.365-.237.545-.788 1.628-2.629 2.714-4.452 2.686-1.824.024-3.658-1.061-4.451-2.685-.092-.18-.169-.356-.238-.543l1.376-.594zM9.25 8c.828 0 1.5.796 1.5 1.9 0 1.105-.672 1.85-1.5 1.85s-1.5-.745-1.5-1.85c0-1.104.672-1.9 1.5-1.9zm5.5 0c.828 0 1.5.796 1.5 1.9 0 1.105-.672 1.85-1.5 1.85s-1.5-.745-1.5-1.85c0-1.104.672-1.9 1.5-1.9z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M12.008 2c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10 4.477-10 10-10zm0 2c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z"/>
    </svg>
  ),
  Location: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"/>
    </svg>
  ),
  Schedule: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M3 2h18.61l-3.5 7 3.5 7H5v6H3V2zm2 12h13.38l-2.5-5 2.5-5H5v10z"/>
    </svg>
  ),
};

// ── Hand cursor — exact SVG as supplied (filter drop-shadow + black outline) ─
function HandCursorPRT() {
  return (
    <svg width="24" height="27" viewBox="0 0 136 154" fill="none" aria-hidden>
      <path
        d="M64.9993 133.957L16.8522 88.1394L24.6178 71.0548L47.1383 88.1394V16.0142H61.1165L64.9993 50.2811L89.8494 53.9704L105.381 58.6299H119.359V116.872L96.062 133.957H64.9993Z"
        fill="white"
      />
      <g filter="url(#prt_handcursor_shadow)">
        <path
          d="M111.22 55.6912V55.6813C118.333 55.6813 123.542 61.4068 123.542 68.4715V94.0321C123.542 118.19 120.175 137.774 83.8817 137.774C67.9998 137.774 60.4872 134.603 53.9297 129.257C53.0513 128.731 52.2383 128.103 51.5076 127.386L15.5444 91.6493C9.42018 85.5201 12.2214 76.9047 16.5143 72.6216C20.7974 68.3287 29.6934 67.6247 34.7297 72.6216L42.5328 80.41V20.7805C42.5471 17.3782 43.9117 14.1209 46.3267 11.7244C48.7416 9.3279 52.0093 7.98832 55.4116 8.00008C62.5253 8.00008 67.8669 13.7158 67.8669 20.7805V43.7576C69.7343 42.7536 71.8218 42.2292 73.9419 42.2315C79.6036 42.2315 83.9998 45.8647 85.7278 50.8961C87.6971 49.6801 90.0848 48.9565 92.5857 48.9565C98.2472 48.9565 102.634 52.5896 104.362 57.6308C106.3 56.3647 108.565 55.6907 110.88 55.6912H111.224H111.22ZM116.743 94.0321V94.0518H116.773V69.2887C116.773 62.9971 110.86 63.2432 110.86 63.2432C107.493 63.2432 104.987 65.9508 104.987 69.2887V82.5908H104.918C104.961 82.8148 104.984 83.0422 104.987 83.2702C104.993 83.7096 104.912 84.1459 104.748 84.5536C104.584 84.9613 104.341 85.3323 104.032 85.6449C103.723 85.9574 103.355 86.2053 102.949 86.3741C102.544 86.5428 102.108 86.629 101.669 86.6277C101.169 86.6286 100.675 86.5185 100.223 86.3053C99.7705 86.0921 99.3712 85.7812 99.0538 85.395C98.7363 85.0088 98.5086 84.5569 98.3869 84.072C98.2653 83.587 98.2529 83.0811 98.3506 82.5908H98.2818V63.0758C98.2818 57.4093 92.1868 57.0253 92.1868 57.0253C88.8196 57.0253 86.4268 59.7378 86.4268 63.0758V78.5687H86.3481C86.4466 79.0587 86.4349 79.5645 86.314 80.0494C86.193 80.5344 85.9658 80.9864 85.6487 81.3727C85.3316 81.7591 84.9326 82.0701 84.4806 82.2833C84.0285 82.4965 83.5347 82.6066 83.0349 82.6056C82.535 82.6065 82.0411 82.4963 81.5889 82.2831C81.1367 82.07 80.7374 81.759 80.42 81.3728C80.1025 80.9866 79.8748 80.5347 79.7532 80.0498C79.6316 79.5649 79.6192 79.059 79.7168 78.5687H79.6478V56.3656C79.6478 50.2266 73.6762 50.3102 73.6762 50.3102C70.3087 50.3102 67.8669 53.018 67.8669 56.3656V73.1828H67.8029C67.9017 73.6741 67.8898 74.1812 67.768 74.6672C67.6462 75.1533 67.4177 75.6061 67.0989 75.9927C66.7802 76.3794 66.3793 76.6901 65.9254 76.9024C65.4715 77.1146 64.976 77.2231 64.4749 77.2198C63.975 77.2207 63.4811 77.1106 63.0289 76.8974C62.5766 76.6842 62.1774 76.3733 61.8599 75.987C61.5425 75.6008 61.3147 75.1489 61.1931 74.664C61.0716 74.179 61.0591 73.6731 61.1568 73.1828H61.0928V22.1391C61.0928 18.8013 58.7888 16.0838 55.4214 16.0838C52.0442 16.0838 49.3168 18.8013 49.3168 22.1392V96.666C43.1629 90.5613 37.0189 84.4468 30.8749 78.3373C28.4922 75.9742 23.9678 76.0628 21.5063 78.5342C19.0497 80.9958 18.2866 84.8407 21.2946 87.8586L55.3328 121.675C61.6491 127.947 69.9888 131.039 83.8621 131.039C116.645 131.039 116.743 114.473 116.743 94.0321Z"
          fill="black"
        />
      </g>
      <defs>
        <filter
          id="prt_handcursor_shadow"
          x="0"
          y="0"
          width="135.542"
          height="153.773"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="6" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

// Per-phase durations (ms). 4 phases: approach+click input, type, click reply, success
const PHASE_MS_PRT = [1500, 2400, 1100, 1800];

window.PostReplyTutorial = function PostReplyTutorial({ handle = "@sophie" }) {
  const I = window.Icons;
  const { cn } = window;
  const [phase, setPhase] = useStatePRT(0);
  const [typedLen, setTypedLen] = useStatePRT(0);
  const [inputClicked, setInputClicked] = useStatePRT(false);
  const [replyClicked, setReplyClicked] = useStatePRT(false);
  const [entered, setEntered] = useStatePRT(false);

  const stageRef = useRefPRT(null);
  const inputRef = useRefPRT(null);
  const replyBtnRef = useRefPRT(null);

  const [cursorXY, setCursorXY] = useStatePRT({ x: 9999, y: 9999 });

  // Helper: place cursor on a target ref
  const placeOn = (ref) => {
    const stage = stageRef.current;
    const target = ref && ref.current;
    if (!stage || !target) return;
    const s = stage.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    setCursorXY({
      x: t.left - s.left + t.width / 2,
      y: t.top - s.top + t.height / 2,
    });
  };

  // Phase loop with per-phase duration
  useEffectPRT(() => {
    const t = setTimeout(() => setPhase((p) => (p + 1) % 4), PHASE_MS_PRT[phase]);
    return () => clearTimeout(t);
  }, [phase]);

  // Per-phase choreography
  useEffectPRT(() => {
    const timers = [];

    if (phase === 0) {
      // Loop restart: reset state, cursor offstage (snap, no transition)
      setInputClicked(false);
      setReplyClicked(false);
      setTypedLen(0);
      setEntered(false);
      const stage = stageRef.current;
      if (stage) {
        const s = stage.getBoundingClientRect();
        setCursorXY({ x: s.width + 30, y: s.height - 18 });
      }
      // Next frame: enter & slide onto input
      timers.push(setTimeout(() => {
        setEntered(true);
        placeOn(inputRef);
      }, 40));
      // Click-pulse input → focus state
      timers.push(setTimeout(() => setInputClicked(true), 1000));
    }

    if (phase === 1) {
      // Type out chars one at a time
      const total = REPLY_TEXT_PRT.length;
      const dur = 2100; // leave ~300ms buffer before phase end
      const charDur = Math.max(14, Math.floor(dur / total));
      let i = 0;
      const tick = () => {
        i += 1;
        setTypedLen(i);
        if (i < total) {
          const t = setTimeout(tick, charDur);
          timers.push(t);
        }
      };
      timers.push(setTimeout(tick, 60));
    }

    if (phase === 2) {
      // Ensure full text is shown
      setTypedLen(REPLY_TEXT_PRT.length);
      // Glide to Reply button
      timers.push(setTimeout(() => placeOn(replyBtnRef), 30));
      // Click-pulse Reply
      timers.push(setTimeout(() => setReplyClicked(true), 750));
    }

    // phase 3 → success card visible; cursor stays where Reply was

    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // Keep cursor pinned to target on resize
  useEffectPRT(() => {
    const onResize = () => {
      if (phase === 0 || phase === 1) placeOn(inputRef);
      else if (phase === 2) placeOn(replyBtnRef);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [phase]);

  // Status text from progress
  const status = phase === 0
    ? { txt: "Click the reply box", emoji: "✏️" }
    : phase === 1
    ? { txt: "Type your reply", emoji: "⌨️" }
    : phase === 2 && !replyClicked
    ? { txt: "Click Reply to post", emoji: "👇" }
    : { txt: "Reply posted", emoji: "✅" };

  const initial = (handle || "@s").replace("@", "").charAt(0).toUpperCase() || "S";
  const typed = REPLY_TEXT_PRT.slice(0, typedLen);
  const hasText = typedLen > 0;
  const isFull = typedLen >= REPLY_TEXT_PRT.length;
  const showSuccess = phase === 3 && replyClicked;

  return (
    <div className="flex flex-col gap-3">
      {/* ── Card stage (no border, matches CopyLinkTutorial) ─────────── */}
      <div ref={stageRef} className="relative bg-yellow-fbfbf3 rounded-[14px] p-4">
        {showSuccess ? (
          // ── Success state: posted reply card (matches image 3) ──────
          <div className="bg-white border border-primary/[0.10] rounded-[12px] p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] animate-fade-in">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-yellow-ffe253 inline-flex items-center justify-center text-primary text-[13px] font-bold shrink-0 select-none">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[13px] leading-none">
                  <span className="font-bold text-primary">{handle}</span>
                  <span className="text-primary/45">Now</span>
                </div>
                <div className="text-[13px] text-primary leading-[1.5] mt-1.5">
                  {REPLY_TEXT_PRT}
                </div>
              </div>
              <span className="text-primary/45 leading-none -mt-0.5 select-none text-[16px]">···</span>
            </div>

            {/* bottom action icons (X-style) */}
            <div className="flex items-center justify-between mt-3 pl-[42px] pr-0.5 text-primary/55">
              <XGlyphPRT.Reply className="w-4 h-4" />
              <XGlyphPRT.Repost className="w-4 h-4" />
              <XGlyphPRT.Heart className="w-4 h-4" />
              <XGlyphPRT.View className="w-4 h-4" />
              <XGlyphPRT.Bookmark className="w-4 h-4" />
              <XGlyphPRT.Share className="w-4 h-4" />
            </div>
          </div>
        ) : (
          // ── Compose state: empty/typing reply box (matches image 2) ─
          <div
            className={cn(
              "bg-white border rounded-[12px] p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors duration-200",
              inputClicked ? "border-primary/[0.22]" : "border-primary/[0.10]"
            )}
          >
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-yellow-ffe253 inline-flex items-center justify-center text-primary text-[13px] font-bold shrink-0 select-none">
                {initial}
              </div>
              <div
                ref={inputRef}
                key={`input-${inputClicked}`}
                className={cn(
                  "flex-1 min-w-0 min-h-[42px] text-[14px] leading-[1.5] py-1.5",
                  inputClicked && "animate-click-press"
                )}
                style={{ transformOrigin: "left center" }}
              >
                {!hasText ? (
                  <span className="text-primary/40">Post your reply</span>
                ) : (
                  <span className="text-primary">
                    {typed}
                    {phase === 1 && !isFull && (
                      <span
                        className="inline-block align-middle bg-primary ml-[1px]"
                        style={{
                          width: "1.5px",
                          height: "14px",
                          animation: "prtCaret 0.9s steps(1) infinite",
                          verticalAlign: "-2px",
                        }}
                      />
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* action icons + Reply button row */}
            <div className="flex items-center gap-3 mt-3 pl-[42px] pr-0.5" style={{ color: "#829BAB" }}>
              <ComposeIconsPRT.Image className="w-[18px] h-[18px]" />
              <ComposeIconsPRT.Gif className="w-[18px] h-[18px]" />
              <ComposeIconsPRT.Grok className="w-[18px] h-[18px]" />
              <ComposeIconsPRT.Emoji className="w-[18px] h-[18px]" />
              <ComposeIconsPRT.Location className="w-[18px] h-[18px]" />
              <ComposeIconsPRT.Schedule className="w-[18px] h-[18px]" />
              <div className="flex-1" />
              <button
                ref={replyBtnRef}
                key={`reply-${replyClicked}`}
                className={cn(
                  "h-7 px-4 rounded-full text-[13px] font-bold transition-colors duration-200 select-none",
                  hasText
                    ? "bg-primary text-white"
                    : "bg-primary/30 text-white cursor-not-allowed",
                  replyClicked && "animate-click-press"
                )}
                style={{ transformOrigin: "center center" }}
              >
                Reply
              </button>
            </div>
          </div>
        )}

        {/* Hand cursor — fingertip = target. Off-card + invisible until 'entered'. */}
        <div
          className="absolute pointer-events-none z-30"
          style={{
            left: `${cursorXY.x}px`,
            top: `${cursorXY.y}px`,
            transform: "translate(-9.7px, -1.4px)",
            transition: entered
              ? "left 650ms cubic-bezier(0.34,1.2,0.64,1), top 650ms cubic-bezier(0.34,1.2,0.64,1), opacity 180ms"
              : "none",
            opacity: entered ? 1 : 0,
          }}
        >
          <span
            key={`cursor-press-${inputClicked}-${replyClicked}`}
            className={cn(
              "inline-block",
              (inputClicked || replyClicked) && "animate-click-press"
            )}
            style={{ transformOrigin: "9.7px 1.4px" }}
          >
            <HandCursorPRT />
          </span>
        </div>

        {/* Progress dots — 4 phases */}
        <div className="flex items-center gap-1.5 mt-4 px-0.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={cn(
                "h-[3px] rounded-full flex-1 transition-all duration-500",
                i <= phase ? "bg-primary" : "bg-primary/[0.10]"
              )}
            />
          ))}
        </div>

        {/* Status line */}
        <div className="flex items-center gap-2 mt-3 text-[13px] text-primary/75 min-h-[20px]">
          <I.Info className="w-3.5 h-3.5 text-primary/40 shrink-0" />
          <span key={status.txt} className="inline-flex items-center gap-1.5 animate-fade-in whitespace-nowrap">
            <span aria-hidden className="text-[14px] leading-none">{status.emoji}</span>
            <span className={cn("whitespace-nowrap", showSuccess && "font-semibold text-primary")}>
              {status.txt}
            </span>
          </span>
        </div>
      </div>

      {/* Caret keyframes (scoped, low-collision name) */}
      <style>{`
        @keyframes prtCaret {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};
