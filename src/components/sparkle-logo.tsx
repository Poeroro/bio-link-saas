"use client";

export function SparkleLogo({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      className={className}
    >
      <defs>
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#0052D4", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#4364F7", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="#F8FAFC" />
      <g transform="translate(15, 15)">
        <path
          d="M55,40 L55,100 Q55,130 85,130 L130,130"
          fill="none"
          stroke="url(#blueGrad)"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          d="M85,40 L85,90 Q85,110 105,110 L115,110 Q135,110 135,90 L135,40"
          fill="none"
          stroke="#1E293B"
          strokeWidth="20"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
