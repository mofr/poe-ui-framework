import React, { useId } from "react";

export type SvgRpgTextTone = "gold" | "blue" | "white";

export type SvgRpgTextProps = {
  text: string;
  tone?: SvgRpgTextTone;
  size?: number;
  width?: number;
  className?: string;
  style?: React.CSSProperties;
  fontFamily?: string;
  letterSpacing?: number;
};

const toneStops: Record<SvgRpgTextTone, { top: string; mid: string; low: string; glow: string; stroke: string }> = {
  gold: {
    top: "#fff0a8",
    mid: "#d2ad59",
    low: "#725321",
    glow: "#d1952f",
    stroke: "#120b03",
  },
  blue: {
    top: "#a8e6ff",
    mid: "#2f9df4",
    low: "#08326e",
    glow: "#2788ff",
    stroke: "#020916",
  },
  white: {
    top: "#ffffff",
    mid: "#eee6d8",
    low: "#817867",
    glow: "#f2e8d0",
    stroke: "#050403",
  },
};

export function SvgRpgText({
  text,
  tone = "gold",
  size = 16,
  width,
  className,
  style,
  fontFamily = "var(--rpg-font-heading)",
  letterSpacing = 1.2,
}: SvgRpgTextProps) {
  const reactId = useId().replace(/:/g, "");
  const gradientId = `rpgTextGradient-${reactId}`;
  const filterId = `rpgTextFilter-${reactId}`;
  const palette = toneStops[tone];
  const estimatedWidth = width ?? Math.ceil(text.length * size * 0.68 + 20 + text.length * letterSpacing * 0.33);
  const height = Math.ceil(size * 1.7);
  const y = Math.ceil(size * 1.12);

  return (
    <svg
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", overflow: "visible", ...style }}
      width={estimatedWidth}
      height={height}
      viewBox={`0 0 ${estimatedWidth} ${height}`}
      role="img"
      aria-label={text}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={palette.top} />
          <stop offset="0.42" stopColor={palette.mid} />
          <stop offset="1" stopColor={palette.low} />
        </linearGradient>
        <filter id={filterId} x="-25%" y="-85%" width="160%" height="260%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.25" floodColor="#000000" floodOpacity="1" />
          <feDropShadow dx="0" dy="0" stdDeviation="0.85" floodColor={palette.glow} floodOpacity="0.55" />
          <feDropShadow dx="0" dy="0" stdDeviation="2.1" floodColor={palette.glow} floodOpacity="0.18" />
        </filter>
      </defs>
      <text
        x="8"
        y={y}
        fontFamily={fontFamily}
        fontSize={size}
        fontWeight={600}
        letterSpacing={letterSpacing}
        textTransform="uppercase"
        fill={`url(#${gradientId})`}
        stroke={palette.stroke}
        strokeWidth="1.05"
        paintOrder="stroke fill"
        filter={`url(#${filterId})`}
      >
        {text}
      </text>
    </svg>
  );
}
