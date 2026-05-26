# DESIGN.md — bio-link-saas

## Identity
Bio-link platform untuk creator Indonesia. Dark-first, clean, modern.

## colors
```yaml
primary: "#22d3ee"          # cyan-400
primary-hover: "#06b6d4"    # cyan-500
primary-ghost: "rgba(34,211,238,0.08)"
accent: "#34d399"           # emerald-400
accent-hover: "#10b981"     # emerald-500
danger: "#f87171"           # red-400
danger-hover: "#ef4444"     # red-500
warning: "#fbbf24"          # amber-400
surface-0: "#020617"        # slate-950
surface-1: "#0f172a"        # slate-900
surface-2: "#1e293b"        # slate-800
surface-3: "#334155"        # slate-700
border: "#1e293b"
border-hover: "#334155"
text-primary: "#f8fafc"     # slate-50
text-secondary: "#94a3b8"   # slate-400
text-muted: "#64748b"       # slate-500
```

## typography
```yaml
font-heading: "'Fraunces', serif"
font-body: "'Inter', sans-serif"
font-mono: "'JetBrains Mono', monospace"
text-xs: "0.75rem"
text-sm: "0.875rem"
text-base: "1rem"
text-lg: "1.125rem"
text-xl: "1.25rem"
text-2xl: "1.5rem"
text-3xl: "1.875rem"
```

## rounded
```yaml
sm: "0.5rem"
md: "0.75rem"
lg: "1rem"
xl: "1.5rem"
full: "9999px"
```

## spacing
```yaml
xs: "0.25rem"
sm: "0.5rem"
md: "1rem"
lg: "1.5rem"
xl: "2rem"
2xl: "3rem"
```

## components
```yaml
card:
  bg: "surface-1"
  border: "border"
  radius: "lg"
  padding: "lg"
  hover-border: "primary"

button-primary:
  bg: "primary"
  text: "surface-0"
  radius: "md"
  hover-bg: "primary-hover"

button-danger:
  bg: "danger"
  text: "surface-0"
  radius: "md"
  hover-bg: "danger-hover"

input:
  bg: "surface-2"
  border: "border"
  radius: "md"
  text: "text-primary"
  placeholder: "text-muted"
  focus-border: "primary"

badge:
  bg: "primary-ghost"
  text: "primary"
  radius: "full"
```

## notes
- Dark mode default, no light mode needed
- All colors use CSS custom properties
- Noise texture overlay on surface-0 background
- Glow effect on primary-colored elements
