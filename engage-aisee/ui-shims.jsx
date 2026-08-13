/* global React, lucide */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// ui-shims.jsx
//
// Browser-side stand-ins for the imports a real .tsx file in this repo would
// pull from `@/lib/cn`, `@/components/ui/button`, `@/components/ui/switch`, etc.
// In the real Next.js app these are NOT shipped — they already exist as proper
// modules and are imported via the `@/*` path alias.
//
// This file exists ONLY to make the standalone HTML preview run without a
// bundler. Every component below mirrors the API + class output of the real
// repo component as closely as possible.
// ─────────────────────────────────────────────────────────────────────────────

const { useState, useEffect, useRef, useCallback, useMemo, Fragment, createContext, useContext } = React;

// ── cn (@/lib/cn) ─────────────────────────────────────────────────────────────
// Simplified: just concat truthy strings. Real repo uses clsx + tailwind-merge.
window.cn = function cn(...inputs) {
  const out = [];
  const walk = (v) => {
    if (!v) return;
    if (typeof v === "string" || typeof v === "number") out.push(String(v));
    else if (Array.isArray(v)) v.forEach(walk);
    else if (typeof v === "object") {
      for (const k in v) if (v[k]) out.push(k);
    }
  };
  inputs.forEach(walk);
  return out.join(" ");
};
const cn = window.cn;

// ── Button (@/components/ui/button) ──────────────────────────────────────────
// Mirrors the variants from components/ui/button.tsx
const BUTTON_BASE = cn(
  "inline-flex items-center justify-center gap-1.5 outline-none",
  "whitespace-nowrap rounded-[8px] text-[14px] font-karla font-medium cursor-pointer",
  "focus-visible:outline-none",
  "disabled:opacity-[0.32] disabled:cursor-not-allowed",
  "transition-all duration-300"
);
const BUTTON_VARIANTS = {
  primary: "bg-primary text-white hover:bg-[#FFE253] hover:text-primary",
  secondary: "bg-yellow-ffe253 text-primary hover:bg-primary hover:text-white",
  tertiary: "bg-[rgba(17,17,17,0.02)] text-primary hover:bg-[rgba(17,17,17,0.05)]",
  outlined: "border border-primary text-primary bg-white hover:bg-yellow-ffe253",
  danger: "border border-primary text-primary bg-transparent hover:bg-red-e14f12 hover:text-white",
  info: "text-primary bg-green-cfff29/[0.32] hover:bg-green-cfff29",
  danger_filled: "bg-red-ec5212 text-white hover:bg-red-e14f12",
  icon: "border border-primary/5 bg-white text-primary hover:bg-yellow-ffe253 hover:border-yellow-ffe253",
  agent_bg_transparent: "border border-[rgba(17,17,17,0.12)] bg-transparent text-primary hover:bg-yellow-ffe253 hover:border-primary",
  yellow_bg: "bg-yellow-ffe253 text-primary hover:bg-primary hover:text-white",
};
window.Button = function Button({ className, variant = "primary", loading, children, disabled, ...rest }) {
  return React.createElement(
    "button",
    {
      ...rest,
      disabled: disabled || loading,
      className: cn(BUTTON_BASE, BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary, className),
    },
    loading ? "…" : children
  );
};

// ── Switch (@/components/ui/switch) ──────────────────────────────────────────
// Matches the visual + ARIA contract of the repo's Radix-Switch wrapper.
window.Switch = function Switch({ checked, onCheckedChange, className, disabled, ...rest }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      className={cn(
        "cursor-pointer border border-primary",
        checked ? "bg-yellow-ffe253" : "bg-transparent",
        "inline-flex h-[22px] w-10 shrink-0 items-center rounded-full shadow-xs transition-all outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...rest}
    >
      <span
        className={cn(
          "pointer-events-none block size-4 rounded-full ring-0 transition-transform",
          checked ? "bg-white translate-x-[calc(100%-(-3px))]" : "bg-[#B0AEA5] translate-x-[3px]"
        )}
      />
    </button>
  );
};

// ── Input (@/components/ui/input) ────────────────────────────────────────────
window.AInput = React.forwardRef(function AInput({ className, type = "text", ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "placeholder:text-[#9DABB7] border-primary",
        "flex h-12 w-full min-w-0 rounded-[8px] border bg-transparent px-3 py-1 text-base",
        "transition-[color,box-shadow,border-color] outline-none",
        "focus-visible:ring-yellow-ffe253 focus-visible:ring-[3px]",
        "hover:ring-yellow-ffe253 hover:ring-[3px]",
        className
      )}
      {...props}
    />
  );
});

// ── DropdownMenu (@/components/ui/dropdown-menu) ─────────────────────────────
// Light-weight implementation mirroring the props shape used in the repo.
const DropdownCtx = createContext(null);

window.DropdownMenu = function DropdownMenu({ children, open: openProp, onOpenChange }) {
  const [openInner, setOpenInner] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openInner;
  const setOpen = (v) => {
    if (!isControlled) setOpenInner(v);
    onOpenChange?.(v);
  };
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);
  return (
    <DropdownCtx.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block">{children}</div>
    </DropdownCtx.Provider>
  );
};
window.DropdownMenuTrigger = function DropdownMenuTrigger({ asChild, children }) {
  const ctx = useContext(DropdownCtx);
  const child = asChild ? React.Children.only(children) : <span>{children}</span>;
  return React.cloneElement(child, {
    onClick: (e) => {
      child.props.onClick?.(e);
      ctx.setOpen(!ctx.open);
    },
    "data-state": ctx.open ? "open" : "closed",
  });
};
window.DropdownMenuContent = function DropdownMenuContent({ children, side = "bottom", align = "start", className, sideOffset = 6, style }) {
  const ctx = useContext(DropdownCtx);
  if (!ctx.open) return null;
  const positions = {
    start:  { left: 0 },
    end:    { right: 0 },
    center: { left: "50%", transform: "translateX(-50%)" },
  };
  const top = side === "bottom" ? `calc(100% + ${sideOffset}px)` : undefined;
  const bottom = side === "top" ? `calc(100% + ${sideOffset}px)` : undefined;
  return (
    <div
      className={cn(
        "absolute z-50 bg-white text-primary rounded-lg border border-primary/[0.15] p-2 shadow-md min-w-32",
        className
      )}
      style={{ top, bottom, ...positions[align], ...style }}
    >
      {children}
    </div>
  );
};
window.DropdownMenuItem = function DropdownMenuItem({ children, className, onClick, disabled }) {
  const ctx = useContext(DropdownCtx);
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) ctx.setOpen(false);
      }}
      className={cn(
        "w-full text-left flex items-center gap-2 rounded-lg px-2 py-1.5 text-base font-karla outline-none cursor-pointer",
        "hover:bg-yellow-fefbe3 focus:bg-yellow-fefbe3",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
    >
      {children}
    </button>
  );
};

// ── Dialog (@/components/ui/dialog) ──────────────────────────────────────────
window.Dialog = function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        onClick={() => onOpenChange?.(false)}
        className="absolute inset-0 bg-black/50 animate-in fade-in"
      />
      {children}
    </div>
  );
};
window.DialogContent = function DialogContent({ children, className, onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className={cn(
        "relative z-10 bg-white rounded-[16px] border border-primary/[0.15] p-6",
        "shadow-[0_20px_24px_-4px_rgba(0,0,0,0.10),0_8px_8px_-4px_rgba(0,0,0,0.04)]",
        "w-[calc(100%-2rem)] max-w-[480px]",
        className
      )}
    >
      {children}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-[22px] right-6 cursor-pointer rounded-[8px] p-1.5 inline-flex items-center justify-center w-[30px] h-[30px] hover:bg-primary/[0.05] transition-all duration-300"
        >
          <window.Icons.X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
window.DialogTitle = function DialogTitle({ children, className }) {
  return <h2 className={cn("text-[20px] leading-[150%] font-normal font-gotu", className)}>{children}</h2>;
};
window.DialogFooter = function DialogFooter({ children, className }) {
  return <div className={cn("flex gap-2 justify-end pt-2", className)}>{children}</div>;
};
