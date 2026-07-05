// ─────────────────────────────────────────────────────────────
// components/ui/index.jsx  ·  Full UI component library
// ─────────────────────────────────────────────────────────────
import React from 'react';
import clsx from 'clsx';

/* ══════════════════════════════════════════
   BUTTON
══════════════════════════════════════════ */
export const Button = ({
  children, variant = 'primary', size = 'md',
  loading = false, icon, className, ...rest
}) => {
  const base = [
    'inline-flex items-center justify-center gap-2 font-display font-semibold',
    'rounded-xl transition-all duration-150 focus:outline-none focus:ring-2',
    'focus:ring-accent/40 disabled:opacity-50 disabled:cursor-not-allowed select-none',
  ].join(' ');

  const variants = {
    primary: 'bg-accent hover:bg-accent-h text-white shadow-accent',
    ghost:   'bg-surface2 border border-border hover:border-border2 text-text hover:bg-surface3',
    danger:  'bg-red/10 border border-red/30 hover:bg-red/20 text-red',
    success: 'bg-green/10 border border-green/30 hover:bg-green/20 text-green',
    outline: 'border border-accent/40 hover:border-accent text-accent hover:bg-accent/5',
    dark:    'bg-surface3 border border-border hover:border-border2 text-text',
  };

  const sizes = {
    xs: 'px-2.5 py-1 text-xs',
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} disabled={loading || rest.disabled} {...rest}>
      {loading
        ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        : icon && <span className="text-base leading-none">{icon}</span>}
      {children}
    </button>
  );
};

/* ══════════════════════════════════════════
   INPUT
══════════════════════════════════════════ */
export const Input = ({ label, error, hint, icon, rightEl, className, containerClass, ...rest }) => (
  <div className={clsx('flex flex-col gap-1.5', containerClass)}>
    {label && (
      <label className="text-[11px] font-display font-semibold text-dim uppercase tracking-widest">
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
          {icon}
        </span>
      )}
      <input
        className={clsx(
          'w-full bg-surface2 border rounded-xl text-sm text-text placeholder-muted',
          'transition-all duration-150 focus:outline-none focus:ring-2',
          'py-2.5',
          icon   ? 'pl-9 pr-4' : 'px-4',
          rightEl ? 'pr-10'     : '',
          error
            ? 'border-red/50 focus:border-red focus:ring-red/20'
            : 'border-border focus:border-accent/60 focus:ring-accent/15',
          className
        )}
        {...rest}
      />
      {rightEl && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</span>
      )}
    </div>
    {error && <p className="text-xs text-red">{error}</p>}
    {hint  && !error && <p className="text-xs text-dim">{hint}</p>}
  </div>
);

/* ══════════════════════════════════════════
   SELECT
══════════════════════════════════════════ */
export const Select = ({ label, error, className, children, ...rest }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-[11px] font-display font-semibold text-dim uppercase tracking-widest">
        {label}
      </label>
    )}
    <select
      className={clsx(
        'w-full bg-surface2 border border-border rounded-xl px-4 py-2.5 text-sm text-text',
        'focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/15',
        'transition-all duration-150 appearance-none cursor-pointer',
        error && 'border-red/50',
        className
      )}
      {...rest}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red">{error}</p>}
  </div>
);

/* ══════════════════════════════════════════
   BADGE
══════════════════════════════════════════ */
const BADGE_MAP = {
  live:        'bg-green/10 text-green border-green/25',
  building:    'bg-yellow/10 text-yellow border-yellow/25',
  pending:     'bg-yellow/10 text-yellow border-yellow/25',
  cloning:     'bg-cyan/10 text-cyan border-cyan/25',
  starting:    'bg-cyan/10 text-cyan border-cyan/25',
  failed:      'bg-red/10 text-red border-red/25',
  stopped:     'bg-muted/30 text-dim border-muted/30',
  idle:        'bg-muted/30 text-dim border-muted/30',
  rolled_back: 'bg-accent/10 text-accent border-accent/25',
  connected:   'bg-green/10 text-green border-green/25',
  secret:      'bg-orange/10 text-orange border-orange/25',
  public:      'bg-surface3 text-dim border-border',
};

const BADGE_DOT = ['live','building','pending','cloning','starting'];

export const Badge = ({ status, children, className }) => (
  <span className={clsx(
    'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold border',
    BADGE_MAP[status] || 'bg-surface3 text-dim border-border',
    className
  )}>
    {BADGE_DOT.includes(status) && (
      <span className={clsx(
        'w-1.5 h-1.5 rounded-full flex-shrink-0',
        status === 'live' ? 'bg-green dot-glow' : 'bg-yellow animate-pulse'
      )} />
    )}
    {children || status?.replace('_',' ').toUpperCase()}
  </span>
);

/* ══════════════════════════════════════════
   CARD
══════════════════════════════════════════ */
export const Card = ({ children, className, hover = false, ...rest }) => (
  <div
    className={clsx(
      'bg-surface border border-border rounded-2xl overflow-hidden shadow-card',
      hover && 'hover:border-border2 transition-colors duration-200 cursor-pointer',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle, actions, className }) => (
  <div className={clsx('flex items-center justify-between px-5 py-4 border-b border-border', className)}>
    <div>
      <h3 className="text-sm font-display font-semibold text-text">{title}</h3>
      {subtitle && <p className="text-xs text-dim mt-0.5">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

/* ══════════════════════════════════════════
   MODAL
══════════════════════════════════════════ */
export const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  if (!open) return null;
  const widths = { sm:'max-w-md', md:'max-w-lg', lg:'max-w-2xl', xl:'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={clsx(
        'relative bg-surface border border-border2 rounded-2xl w-full shadow-card page-in',
        widths[size]
      )}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-display font-bold text-text">{title}</h2>
          <button onClick={onClose} className="text-muted hover:text-text transition-colors p-1 rounded-lg hover:bg-surface2">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   SPINNER
══════════════════════════════════════════ */
export const Spinner = ({ size = 'md', className }) => {
  const s = { xs:'w-3 h-3', sm:'w-4 h-4', md:'w-6 h-6', lg:'w-10 h-10' };
  return (
    <div className={clsx(
      'rounded-full border-2 border-border border-t-accent animate-spin',
      s[size], className
    )} />
  );
};

/* ══════════════════════════════════════════
   SKELETON
══════════════════════════════════════════ */
export const Skeleton = ({ className }) => (
  <div className={clsx('skeleton rounded-xl', className)} />
);

/* ══════════════════════════════════════════
   EMPTY STATE
══════════════════════════════════════════ */
export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center px-4">
    <div className="text-6xl mb-5 opacity-25">{icon}</div>
    <h3 className="font-display font-bold text-lg text-text mb-2">{title}</h3>
    <p className="text-sm text-dim max-w-xs mb-6 leading-relaxed">{description}</p>
    {action}
  </div>
);

/* ══════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════ */
export const StatCard = ({ label, value, sub, accent = 'accent', icon }) => {
  const accents = {
    accent: 'from-accent/20 to-transparent border-accent/20',
    green:  'from-green/20 to-transparent border-green/20',
    red:    'from-red/20 to-transparent border-red/20',
    cyan:   'from-cyan/20 to-transparent border-cyan/20',
  };
  const iconColors = { accent:'text-accent', green:'text-green', red:'text-red', cyan:'text-cyan' };

  return (
    <div className={clsx(
      'relative bg-gradient-to-b border rounded-2xl p-5 overflow-hidden',
      accents[accent]
    )}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-display font-semibold text-dim uppercase tracking-widest">{label}</span>
        {icon && <span className={clsx('text-xl opacity-70', iconColors[accent])}>{icon}</span>}
      </div>
      <div className="font-display font-extrabold text-3xl text-text tracking-tight">{value}</div>
      {sub && <div className="text-xs text-dim mt-2">{sub}</div>}
    </div>
  );
};

/* ══════════════════════════════════════════
   DIVIDER
══════════════════════════════════════════ */
export const Divider = ({ label }) => (
  <div className="flex items-center gap-3 my-2">
    <div className="flex-1 h-px bg-border" />
    {label && <span className="text-xs text-muted">{label}</span>}
    <div className="flex-1 h-px bg-border" />
  </div>
);

/* ══════════════════════════════════════════
   TOOLTIP  (simple title-based)
══════════════════════════════════════════ */
export const Tooltip = ({ tip, children }) => (
  <span className="relative group">
    {children}
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-surface3 border border-border text-xs text-text rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
      {tip}
    </span>
  </span>
);

/* ══════════════════════════════════════════
   ALERT
══════════════════════════════════════════ */
export const Alert = ({ type = 'info', children }) => {
  const types = {
    info:    'bg-accent/8 border-accent/25 text-accent',
    success: 'bg-green/8 border-green/25 text-green',
    warning: 'bg-yellow/8 border-yellow/25 text-yellow',
    error:   'bg-red/8 border-red/25 text-red',
  };
  const icons = { info:'ℹ️', success:'✅', warning:'⚠️', error:'❌' };
  return (
    <div className={clsx('flex items-start gap-3 p-3.5 rounded-xl border text-sm', types[type])}>
      <span className="flex-shrink-0">{icons[type]}</span>
      <div>{children}</div>
    </div>
  );
};

/* ══════════════════════════════════════════
   CODE BLOCK
══════════════════════════════════════════ */
export const CodeBlock = ({ children, copy = true }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative bg-bg border border-border rounded-xl overflow-hidden">
      {copy && (
        <button
          onClick={handleCopy}
          className="absolute top-2.5 right-2.5 text-[10px] font-mono text-dim hover:text-text transition-colors px-2 py-0.5 rounded bg-surface2"
        >
          {copied ? '✓ copied' : 'copy'}
        </button>
      )}
      <pre className="p-4 font-mono text-xs text-dim overflow-x-auto leading-relaxed whitespace-pre-wrap">
        {children}
      </pre>
    </div>
  );
};