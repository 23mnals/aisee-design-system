/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// post-reply-tutorial-reddit.jsx
//
// Reddit counterpart to post-reply-tutorial.jsx. Looping tutorial that shows
// how to POST a comment on a Reddit thread.
//
// Choreography (4 phases):
//   0) cursor enters, glides onto the collapsed "Join the conversation" pill,
//      clicks → input expands with toolbar + Cancel / Comment buttons
//   1) reply text auto-types; gray "Comment" button → Reddit dark-green
//   2) cursor glides to the Comment button, click-press
//   3) compose box morphs into the posted comment card (success state)
//   → loop
// ─────────────────────────────────────────────────────────────────────────────

const { useState: useStateRDT, useEffect: useEffectRDT, useRef: useRefRDT } = React;

const REPLY_TEXT_RDT = "Thanks for sharing this — I found the part about onboarding new users especially useful.";
const RDT_GRAY  = "#5F686F";
const RDT_GREEN = "#0F5132";

// ── Reddit compose-toolbar icons (image / gif / format Aa) ───────────────────
const ComposeIconsRDT = {
  Image: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path d="M14.6 2H5.4A3.4 3.4 0 002 5.4v9.2A3.4 3.4 0 005.4 18h9.2a3.4 3.4 0 003.4-3.4V5.4A3.4 3.4 0 0014.6 2zM5.4 3.8h9.2c.882 0 1.6.718 1.6 1.6v9.2c0 .484-.22.913-.561 1.207l-5.675-5.675a3.39 3.39 0 00-2.404-.996c-.87 0-1.74.332-2.404.996L3.8 11.488V5.4c0-.882.718-1.6 1.6-1.6zM3.8 14.6v-.567l2.629-2.628a1.59 1.59 0 011.131-.469c.427 0 .829.166 1.131.469l4.795 4.795H5.4c-.882 0-1.6-.718-1.6-1.6zm6.95-7.1a1.75 1.75 0 113.5 0 1.75 1.75 0 01-3.5 0z"/>
    </svg>
  ),
  Gif: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path d="M3.018 13.566a3.858 3.858 0 01-1.483-1.462A4.09 4.09 0 011 10.027c0-.774.183-1.474.551-2.102A3.939 3.939 0 013.09 6.44c.657-.361 1.407-.542 2.247-.542a4.753 4.753 0 011.642.29.813.813 0 01.473 1.08l-.011.028a.818.818 0 01-1.058.43l-.094-.034a3.025 3.025 0 00-1.001-.166c-.469 0-.894.1-1.274.302a2.27 2.27 0 00-.9.86c-.22.373-.33.806-.33 1.299 0 .486.105.92.314 1.304.209.384.496.682.861.897.365.214.775.32 1.231.32.37 0 .705-.07 1.003-.212.298-.142.532-.34.701-.591a1.47 1.47 0 00.249-.847H5.687a.74.74 0 110-1.48h2.4a.74.74 0 01.742.74v.55c0 .65-.151 1.236-.451 1.756-.3.52-.727.93-1.281 1.228-.554.299-1.197.447-1.928.447-.8 0-1.517-.178-2.15-.534h-.001zm7.082-.453V6.887c0-.49.403-.887.9-.887s.9.397.9.887v6.226c0 .49-.403.887-.9.887a.894.894 0 01-.9-.887zm3.918.094V6.792c0-.438.355-.793.794-.793h3.394a.793.793 0 110 1.586h-2.405v1.83h1.921a.793.793 0 110 1.586h-1.921v2.207a.793.793 0 01-.794.793h-.195a.793.793 0 01-.794-.793v-.001z"/>
    </svg>
  ),
  Format: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path d="M19.68 17.061c-.08.595-.695.991-1.254.771-.594-.233-.857-.517-.857-.517-.221-.207-.365-.424-.434-.65h-.025c-.266.368-.655.673-1.168.914-.512.24-1.074.36-1.686.36-.594 0-1.124-.117-1.588-.353a2.647 2.647 0 01-1.083-.977 2.613 2.613 0 01-.386-1.406c0-.555.15-1.043.454-1.465.303-.422.756-.75 1.359-.985.603-.234 1.346-.353 2.229-.353h1.546v-.407c0-.465-.126-.861-.378-1.189-.252-.328-.704-.492-1.355-.492-.42 0-.872.073-1.36.221-.193.059-.387.115-.571.173a.848.848 0 01-1.045-.505c-.166-.43.033-.928.463-1.093.247-.094.517-.181.812-.258a7.618 7.618 0 011.757-.25c1.122-.027 1.947.171 2.475.591.499.396.807.827.926 1.291.119.465.179.957.179 1.479v2.956c0 .368.04.646.119.832 0 0 .05.18.353.338a.962.962 0 01.518.974zm-4.07-.892a2.29 2.29 0 00.91-.629c.247-.28.37-.618.37-1.015v-.68h-1.648c-.634 0-1.146.104-1.537.314-.391.209-.586.538-.586.985 0 .379.139.679.417.9.277.221.625.331 1.044.331.329 0 .672-.069 1.032-.208l-.001.002zm-5.924 1.732a.916.916 0 01-.886-.66l-1.003-3.562H3.489l-.983 3.56a.915.915 0 01-.886.662c-.608 0-1.05-.568-.885-1.14L4.69 2.954a.991.991 0 01.956-.706c.444 0 .834.288.956.705L10.57 16.76c.165.573-.276 1.141-.885 1.141zm-4.01-12.2h-.06l-1.742 6.371h3.56L5.677 5.7z"/>
    </svg>
  ),
  Sparkle: (p) => (
    <svg viewBox="0 0 16 16" fill="currentColor" {...p}>
      <path d="M8 1.6l1.45 3.5L13 6.55l-3.05 1.95L8 12 6.05 8.5 3 6.55l3.55-1.45L8 1.6zM13 9.5l.7 1.7L15.4 12l-1.7.8-.7 1.7-.7-1.7-1.7-.8 1.7-.8.7-1.7z"/>
    </svg>
  ),
};

// ── Reddit success-row action icons (vote arrow / comment bubble / share arrow) ─
const ActionIconsRDT = {
  Upvote: (p) => (
    <svg viewBox="0 0 16 16" fill="currentColor" {...p}>
      <path d="M7.62139 14C6.95814 13.999 6.32235 13.735 5.85348 13.2659C5.3846 12.7968 5.12092 12.1609 5.12025 11.4976V8.93456H3.09786C2.88069 8.93505 2.66829 8.87086 2.48775 8.75016C2.3072 8.62946 2.1667 8.45773 2.08414 8.25685C2.00061 8.05624 1.97865 7.83531 2.02105 7.62217C2.06345 7.40904 2.1683 7.21334 2.32226 7.05997L7.21969 2.16001C7.3282 2.05726 7.47195 2 7.62139 2C7.77083 2 7.91458 2.05726 8.02309 2.16001L12.9205 7.0606C13.2351 7.37577 13.3285 7.84505 13.158 8.25685C12.9875 8.66866 12.5896 8.93456 12.1443 8.93456H10.1219V11.4976C10.1214 12.1609 9.85776 12.7969 9.38885 13.2661C8.91994 13.7352 8.28406 13.9992 7.62076 14H7.62139ZM3.19324 7.79705H6.25713V11.4168C6.25713 12.1305 6.76873 12.7829 7.47865 12.8555C7.66884 12.8753 7.86104 12.8548 8.04284 12.7956C8.22464 12.7363 8.39197 12.6396 8.53401 12.5116C8.67606 12.3836 8.78966 12.2272 8.86745 12.0525C8.94525 11.8779 8.98552 11.6888 8.98565 11.4976V7.79705H12.0495L7.62139 3.36574L3.19324 7.79705Z"/>
    </svg>
  ),
  UpvoteFilled: (p) => (
    <svg viewBox="0 0 16 16" fill="currentColor" {...p}>
      <path d="M7.62139 14C6.95814 13.999 6.32235 13.735 5.85348 13.2659C5.3846 12.7968 5.12092 12.1609 5.12025 11.4976V8.93456H3.09786C2.88069 8.93505 2.66829 8.87086 2.48775 8.75016C2.3072 8.62946 2.1667 8.45773 2.08414 8.25685C2.00061 8.05624 1.97865 7.83531 2.02105 7.62217C2.06345 7.40904 2.1683 7.21334 2.32226 7.05997L7.21969 2.16001C7.3282 2.05726 7.47195 2 7.62139 2C7.77083 2 7.91458 2.05726 8.02309 2.16001L12.9205 7.0606C13.2351 7.37577 13.3285 7.84505 13.158 8.25685C12.9875 8.66866 12.5896 8.93456 12.1443 8.93456H10.1219V11.4976C10.1214 12.1609 9.85776 12.7969 9.38885 13.2661C8.91994 13.7352 8.28406 13.9992 7.62076 14H7.62139Z"/>
    </svg>
  ),
  Comment: (p) => (
    <svg viewBox="0 0 16 16" fill="currentColor" {...p}>
      <path d="M8.66617 2C7.07487 2 5.54875 2.63214 4.42353 3.75736C3.29831 4.88258 2.66617 6.4087 2.66617 8C2.66617 9.298 3.19284 10.3867 3.95617 11.3047L2.15351 13.1073C2.08028 13.1804 2.03038 13.2735 2.01012 13.375C1.98986 13.4764 2.00016 13.5816 2.03971 13.6772C2.07925 13.7727 2.14627 13.8544 2.23227 13.9119C2.31828 13.9694 2.4194 14 2.52284 14H8.66617C10.2575 14 11.7836 13.3679 12.9088 12.2426C14.034 11.1174 14.6662 9.5913 14.6662 8C14.6662 6.4087 14.034 4.88258 12.9088 3.75736C11.7836 2.63214 10.2575 2 8.66617 2ZM8.66617 12.8H6.10751C5.44484 12.8027 4.83617 12.8353 4.07751 12.896L4.02684 12.7707C4.56355 12.329 5.08135 11.8648 5.57884 11.3793L4.87884 10.5373C4.19751 9.71733 3.86617 8.88733 3.86617 8C3.86617 5.35333 6.01951 3.2 8.66617 3.2C11.3128 3.2 13.4662 5.35333 13.4662 8C13.4662 10.6467 11.3128 12.8 8.66617 12.8Z"/>
    </svg>
  ),
  Share: (p) => (
    <svg viewBox="0 0 16 16" fill="currentColor" {...p}>
      <path d="M9.43251 13.0906L14.3557 8.16951C14.4154 8.10979 14.4628 8.03889 14.4952 7.96085C14.5275 7.88281 14.5441 7.79917 14.5441 7.7147C14.5441 7.63023 14.5275 7.54659 14.4952 7.46856C14.4628 7.39052 14.4154 7.31962 14.3557 7.2599L9.43251 2.33885C9.26842 2.17649 9.06004 2.06621 8.83351 2.02185C8.60699 1.97748 8.3724 2.00101 8.15919 2.08947C7.94453 2.17812 7.76105 2.32856 7.63205 2.52168C7.50305 2.7148 7.43434 2.9419 7.43465 3.17415V5.02695C3.18312 5.37636 1.1381 9.19702 1.00091 12.9848C0.99214 13.1867 1.04684 13.3862 1.15731 13.5554C1.26779 13.7246 1.42849 13.8549 1.61685 13.928C1.80349 14.0045 2.00941 14.0205 2.20565 13.9738C2.40188 13.9272 2.57855 13.8202 2.71081 13.6679L2.94947 13.3957C4.16776 12.0066 5.32389 10.6868 7.43465 10.4639V12.2567C7.43465 12.7333 7.71904 13.1584 8.15919 13.3414C8.37246 13.4302 8.60724 13.4539 8.83395 13.4095C9.06067 13.3651 9.26918 13.2546 9.43322 13.092L9.43251 13.0906ZM8.72225 11.9844V9.14343H8.07917C5.24315 9.14343 3.67616 10.644 2.36211 12.1166C2.72939 9.25061 4.37927 6.28598 8.07845 6.28598H8.72154V3.44424L12.9938 7.71435L8.72297 11.9844H8.72219Z"/>
    </svg>
  ),
};

// ── Hand cursor (re-exported under a Reddit-scoped name to avoid collisions) ─
function HandCursorRDT() {
  return (
    <svg width="24" height="24" viewBox="-1 -1 18 18" fill="none" aria-hidden>
      <g filter="url(#rdt_handcursor_shadow)">
        <path
          d="M13.3295 5.93164C14.2021 5.93164 14.841 6.63274 14.841 7.49929V10.6346C14.841 13.5978 14.4279 16 9.97618 16C8.02809 16 7.10658 15.6111 6.30222 14.9553C6.19448 14.8908 6.09475 14.8138 6.00511 14.7258L1.59383 10.3423C0.842613 9.5905 1.18622 8.53373 1.71279 8.00836C2.23816 7.48178 3.32936 7.39543 3.94712 8.00836L4.90426 8.96368V1.56766C4.90601 1.15034 5.0734 0.750795 5.36962 0.456837C5.66584 0.162879 6.06666 -0.00143497 6.48398 9.44287e-06C7.35658 9.44287e-06 8.01178 0.701105 8.01178 1.56766V4.46786C8.24084 4.3447 8.4969 4.28038 8.75696 4.28066C9.45141 4.28066 9.99067 4.72631 10.2026 5.34347C10.4442 5.19432 10.7371 5.10555 11.0438 5.10555C11.7383 5.10555 12.2763 5.5512 12.4883 6.16957C12.726 6.01426 13.0038 5.93159 13.2878 5.93164H13.3295ZM14.007 10.6346V10.637H14.0106V7.59954C14.0106 6.82779 13.2854 6.85798 13.2854 6.85798C12.8723 6.85798 12.565 7.19011 12.565 7.59954V9.2312H12.5565C12.5618 9.25868 12.5646 9.28656 12.565 9.31453C12.5658 9.36843 12.5558 9.42195 12.5357 9.47196C12.5156 9.52198 12.4857 9.56748 12.4479 9.60582C12.41 9.64416 12.3648 9.67457 12.315 9.69527C12.2653 9.71597 12.2119 9.72654 12.158 9.72637C12.0966 9.72648 12.0361 9.71297 11.9806 9.68683C11.9251 9.66068 11.8761 9.62254 11.8372 9.57516C11.7983 9.52779 11.7703 9.47236 11.7554 9.41288C11.7405 9.35339 11.739 9.29134 11.751 9.2312H11.7425V6.83745C11.7425 6.14239 10.9949 6.09529 10.9949 6.09529C10.5819 6.09529 10.2884 6.42803 10.2884 6.83745V8.73784H10.2787C10.2908 8.79794 10.2894 8.85998 10.2745 8.91947C10.2597 8.97895 10.2318 9.0344 10.1929 9.08179C10.154 9.12918 10.1051 9.16733 10.0496 9.19348C9.99419 9.21964 9.93362 9.23314 9.87231 9.23301C9.81099 9.23312 9.7504 9.21961 9.69493 9.19346C9.63946 9.16731 9.59049 9.12917 9.55155 9.0818C9.51261 9.03443 9.48468 8.979 9.46976 8.91951C9.45484 8.86003 9.45332 8.79798 9.4653 8.73784H9.45685V6.01437C9.45685 5.26134 8.72435 5.27161 8.72435 5.27161C8.3113 5.27161 8.01178 5.60374 8.01178 6.01437V8.0772H8.00393C8.01604 8.13746 8.01458 8.19965 7.99964 8.25927C7.9847 8.31889 7.95666 8.37443 7.91757 8.42186C7.87847 8.46928 7.8293 8.5074 7.77362 8.53343C7.71795 8.55947 7.65717 8.57277 7.59571 8.57238C7.53439 8.57248 7.47381 8.55898 7.41834 8.53283C7.36287 8.50668 7.31389 8.46854 7.27495 8.42116C7.23601 8.37379 7.20808 8.31836 7.19316 8.25888C7.17825 8.19939 7.17672 8.13734 7.1887 8.0772H7.18085V1.73433C7.18085 1.3249 6.89824 0.991567 6.48519 0.991567C6.07094 0.991567 5.73639 1.3249 5.73639 1.73433V10.9577C4.98155 10.2089 4.22792 9.45886 3.47429 8.70945C3.18201 8.4196 2.62705 8.43046 2.32512 8.73361C2.02379 9.03554 1.93019 9.50717 2.29915 9.87734L6.47432 14.0253C7.24909 14.7947 8.27205 15.1739 9.97376 15.1739C13.9949 15.1739 14.007 13.1419 14.007 10.6346Z"
          fill="black"
        />
        <path
          d="M14.007 10.6346V10.637H14.0106V7.59954C14.0106 6.82779 13.2854 6.85798 13.2854 6.85798C12.8723 6.85798 12.565 7.19011 12.565 7.59954V9.2312H12.5565C12.5618 9.25868 12.5646 9.28656 12.565 9.31453C12.5658 9.36843 12.5558 9.42195 12.5357 9.47196C12.5156 9.52198 12.4857 9.56748 12.4479 9.60582C12.41 9.64416 12.3648 9.67457 12.315 9.69527C12.2653 9.71597 12.2119 9.72654 12.158 9.72637C12.0966 9.72648 12.0361 9.71297 11.9806 9.68683C11.9251 9.66068 11.8761 9.62254 11.8372 9.57516C11.7983 9.52779 11.7703 9.47236 11.7554 9.41288C11.7405 9.35339 11.739 9.29134 11.751 9.2312H11.7425V6.83745C11.7425 6.14239 10.9949 6.09529 10.9949 6.09529C10.5819 6.09529 10.2884 6.42803 10.2884 6.83745V8.73784H10.2787C10.2908 8.79794 10.2894 8.85998 10.2745 8.91947C10.2597 8.97895 10.2318 9.0344 10.1929 9.08179C10.154 9.12918 10.1051 9.16733 10.0496 9.19348C9.99419 9.21964 9.93362 9.23314 9.87231 9.23301C9.81099 9.23312 9.7504 9.21961 9.69493 9.19346C9.63946 9.16731 9.59049 9.12917 9.55155 9.0818C9.51261 9.03443 9.48468 8.979 9.46976 8.91951C9.45484 8.86003 9.45332 8.79798 9.4653 8.73784H9.45685V6.01437C9.45685 5.26134 8.72435 5.27161 8.72435 5.27161C8.3113 5.27161 8.01178 5.60374 8.01178 6.01437V8.0772H8.00393C8.01604 8.13746 8.01458 8.19965 7.99964 8.25927C7.9847 8.31889 7.95666 8.37443 7.91757 8.42186C7.87847 8.46928 7.8293 8.5074 7.77362 8.53343C7.71795 8.55947 7.65717 8.57277 7.59571 8.57238C7.53439 8.57248 7.47381 8.55898 7.41834 8.53283C7.36287 8.50668 7.31389 8.46854 7.27495 8.42116C7.23601 8.37379 7.20808 8.31836 7.19316 8.25888C7.17825 8.19939 7.17672 8.13734 7.1887 8.0772H7.18085V1.73433C7.18085 1.3249 6.89824 0.991567 6.48519 0.991567C6.07094 0.991567 5.73639 1.3249 5.73639 1.73433V10.9577C4.98155 10.2089 4.22792 9.45886 3.47429 8.70945C3.18201 8.4196 2.62705 8.43046 2.32512 8.73361C2.02379 9.03554 1.93019 9.50717 2.29915 9.87734L6.47432 14.0253C7.24909 14.7947 8.27205 15.1739 9.97376 15.1739C13.9949 15.1739 14.007 13.1419 14.007 10.6346Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="rdt_handcursor_shadow"
          x="-0.31288"
          y="-0.981292"
          width="16.6258"
          height="18.9439"
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
          <feOffset dy="0.490646" />
          <feGaussianBlur stdDeviation="0.735969" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

// Per-phase durations (ms). 4 phases: click-to-expand, type, click comment, success
const PHASE_MS_RDT = [1500, 2400, 1100, 1800];

window.PostReplyTutorialReddit = function PostReplyTutorialReddit({ handle = "u/sophie" }) {
  const I = window.Icons;
  const { cn } = window;
  const [phase, setPhase] = useStateRDT(0);
  const [typedLen, setTypedLen] = useStateRDT(0);
  const [inputClicked, setInputClicked] = useStateRDT(false);
  const [commentClicked, setCommentClicked] = useStateRDT(false);
  const [entered, setEntered] = useStateRDT(false);

  const stageRef = useRefRDT(null);
  const inputRef = useRefRDT(null);
  const commentBtnRef = useRefRDT(null);

  const [cursorXY, setCursorXY] = useStateRDT({ x: 9999, y: 9999 });

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

  useEffectRDT(() => {
    const t = setTimeout(() => setPhase((p) => (p + 1) % 4), PHASE_MS_RDT[phase]);
    return () => clearTimeout(t);
  }, [phase]);

  useEffectRDT(() => {
    const timers = [];

    if (phase === 0) {
      setInputClicked(false);
      setCommentClicked(false);
      setTypedLen(0);
      setEntered(false);
      const stage = stageRef.current;
      if (stage) {
        const s = stage.getBoundingClientRect();
        setCursorXY({ x: s.width + 30, y: s.height - 18 });
      }
      timers.push(setTimeout(() => {
        setEntered(true);
        placeOn(inputRef);
      }, 40));
      timers.push(setTimeout(() => setInputClicked(true), 1000));
    }

    if (phase === 1) {
      const total = REPLY_TEXT_RDT.length;
      const dur = 2100;
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
      setTypedLen(REPLY_TEXT_RDT.length);
      // After typing finishes the Comment button position moves slightly because
      // the input height grows; re-place cursor *after* the next paint.
      timers.push(setTimeout(() => placeOn(commentBtnRef), 30));
      timers.push(setTimeout(() => setCommentClicked(true), 750));
    }

    return () => timers.forEach(clearTimeout);
  }, [phase]);

  useEffectRDT(() => {
    const onResize = () => {
      if (phase === 0 || phase === 1) placeOn(inputRef);
      else if (phase === 2) placeOn(commentBtnRef);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [phase]);

  const status = phase === 0
    ? { txt: "Click the comment box", emoji: "✏️" }
    : phase === 1
    ? { txt: "Type your comment", emoji: "⌨️" }
    : phase === 2 && !commentClicked
    ? { txt: "Click Comment to post", emoji: "👇" }
    : { txt: "Comment posted", emoji: "✅" };

  const initial = (handle || "u/s").replace(/^u\//, "").charAt(0).toUpperCase() || "S";
  const typed = REPLY_TEXT_RDT.slice(0, typedLen);
  const hasText = typedLen > 0;
  const isFull = typedLen >= REPLY_TEXT_RDT.length;
  const showSuccess = phase === 3 && commentClicked;
  const showExpanded = inputClicked && !showSuccess;

  return (
    <div className="flex flex-col gap-3">
      {/* ── Card stage ─────────────────────────────────────────────── */}
      <div ref={stageRef} className="relative bg-yellow-fbfbf3 rounded-[14px] p-4">
        {/* Fixed-height inner area so the yellow card stays the same size across phases */}
        <div className="min-h-[150px]">
          {showSuccess ? (
            // ── Success state: posted comment card (matches image 3) ─────
            <div className="bg-white border border-primary/[0.10] rounded-[16px] p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] animate-fade-in">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-yellow-ffe253 inline-flex items-center justify-center text-primary text-[13px] font-bold shrink-0 select-none">
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[13px] leading-none">
                    <span className="font-bold text-primary">{handle}</span>
                    <span style={{ color: RDT_GRAY }}>· Now</span>
                  </div>
                </div>
                <span style={{ color: RDT_GRAY }} className="leading-none -mt-0.5 select-none text-[16px]">···</span>
              </div>

              <div className="text-[13px] text-primary leading-[1.5] mt-2">
                {REPLY_TEXT_RDT}
              </div>

              {/* bottom action row (Reddit-style: vote / comment / Share + ⋯) */}
              <div className="flex items-center mt-3 text-[13px]" style={{ color: RDT_GRAY }}>
                {/* Vote group: ↑(filled red) 1 ↓ — user already upvoted their own post */}
                <div className="inline-flex items-center gap-1.5 mr-6">
                  <ActionIconsRDT.UpvoteFilled className="w-4 h-4" style={{ color: "#D93901" }} />
                  <span className="font-medium" style={{ color: "#D93901" }}>1</span>
                  <ActionIconsRDT.Upvote className="w-4 h-4" style={{ transform: "rotate(180deg)" }} />
                </div>
                {/* Comment */}
                <div className="inline-flex items-center gap-1.5 mr-6">
                  <ActionIconsRDT.Comment className="w-4 h-4" />
                  <span className="font-medium">comment</span>
                </div>
                {/* Share */}
                <div className="inline-flex items-center gap-1.5">
                  <ActionIconsRDT.Share className="w-4 h-4" />
                  <span className="font-medium">Share</span>
                </div>
                <div className="flex-1" />
                <span className="leading-none -mt-1 select-none text-[18px]">···</span>
              </div>
            </div>
          ) : (
            // ── Compose state: collapsed pill OR expanded box ─────────────
            showExpanded ? (
              // EXPANDED (image 2): tall input + toolbar + Cancel/Comment buttons
              <div
                className="bg-white rounded-[20px] px-4 pt-3 pb-2 border transition-colors duration-200"
                style={{ borderColor: "rgba(95,104,111,0.32)" }}
              >
                {/* Sparkle at top-right */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    ref={inputRef}
                    key={`input-${inputClicked}`}
                    className={cn(
                      "flex-1 min-w-0 min-h-[60px] text-[14px] leading-[1.55] text-primary",
                      inputClicked && phase === 0 && "animate-click-press"
                    )}
                    style={{ transformOrigin: "left center" }}
                  >
                    {!hasText ? (
                      <span style={{ color: RDT_GRAY }}>Join the conversation</span>
                    ) : (
                      <span>
                        {typed}
                        {phase === 1 && !isFull && (
                          <span
                            className="inline-block align-middle bg-primary ml-[1px]"
                            style={{
                              width: "1.5px",
                              height: "14px",
                              animation: "rdtCaret 0.9s steps(1) infinite",
                              verticalAlign: "-2px",
                            }}
                          />
                        )}
                      </span>
                    )}
                  </div>
                  <ComposeIconsRDT.Sparkle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: RDT_GRAY }} />
                </div>

                {/* toolbar row */}
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-3" style={{ color: RDT_GRAY }}>
                    <ComposeIconsRDT.Image className="w-[18px] h-[18px]" />
                    <ComposeIconsRDT.Gif className="w-[18px] h-[18px]" />
                    <ComposeIconsRDT.Format className="w-[18px] h-[18px]" />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="h-7 px-3 rounded-full text-[12px] font-bold select-none"
                      style={{ color: RDT_GRAY, background: "transparent" }}
                    >
                      Cancel
                    </button>
                    <button
                      ref={commentBtnRef}
                      key={`comment-${commentClicked}`}
                      className={cn(
                        "h-7 px-3.5 rounded-full text-[12px] font-bold text-white transition-colors duration-200 select-none",
                        commentClicked && "animate-click-press"
                      )}
                      style={{
                        background: hasText ? RDT_GREEN : "rgba(95,104,111,0.45)",
                        cursor: hasText ? "pointer" : "not-allowed",
                        transformOrigin: "center center",
                      }}
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // COLLAPSED (image 1): single-line pill input
              <div
                ref={inputRef}
                key={`input-collapsed-${inputClicked}`}
                className={cn(
                  "bg-white rounded-full h-12 px-5 flex items-center border text-[14px] transition-colors duration-200 whitespace-nowrap overflow-hidden",
                  inputClicked && "animate-click-press"
                )}
                style={{
                  borderColor: "rgba(95,104,111,0.32)",
                  color: RDT_GRAY,
                  transformOrigin: "left center",
                }}
              >
                Join the conversation
              </div>
            )
          )}
        </div>

        {/* Hand cursor */}
        <div
          className="absolute pointer-events-none z-30"
          style={{
            left: `${cursorXY.x}px`,
            top: `${cursorXY.y}px`,
            transform: "translate(-9.74px, 0px)",
            transition: entered
              ? "left 650ms cubic-bezier(0.34,1.2,0.64,1), top 650ms cubic-bezier(0.34,1.2,0.64,1), opacity 180ms"
              : "none",
            opacity: entered ? 1 : 0,
          }}
        >
          <span
            key={`cursor-press-${inputClicked}-${commentClicked}`}
            className={cn(
              "inline-block",
              (inputClicked || commentClicked) && "animate-click-press"
            )}
            style={{ transformOrigin: "9.74px 0px" }}
          >
            <HandCursorRDT />
          </span>
        </div>

        {/* Progress dots */}
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

      <style>{`
        @keyframes rdtCaret {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};
