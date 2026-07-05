import React from "react";

interface KiringoLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  lightModeOnly?: boolean;
}

export default function KiringoLogo({
  className = "",
  size = "md",
  lightModeOnly = false
}: KiringoLogoProps) {
  // Dimensions based on size
  const dimensions = {
    sm: { width: 150, height: 44, viewBox: "0 0 190 60", textY: 34, oY: 28, subtitleY: 52, fontSizeMain: 26, fontSizeSub: 10, r: 10, strokeW: 5.5, leafY1: 37, leafY2: 19, leafH: 18 },
    md: { width: 220, height: 64, viewBox: "0 0 190 60", textY: 34, oY: 28, subtitleY: 52, fontSizeMain: 26, fontSizeSub: 10, r: 10, strokeW: 5.5, leafY1: 37, leafY2: 19, leafH: 18 },
    lg: { width: 320, height: 94, viewBox: "0 0 190 60", textY: 34, oY: 28, subtitleY: 52, fontSizeMain: 26, fontSizeSub: 10, r: 10, strokeW: 5.5, leafY1: 37, leafY2: 19, leafH: 18 },
    xl: { width: 440, height: 130, viewBox: "0 0 190 60", textY: 34, oY: 28, subtitleY: 52, fontSizeMain: 26, fontSizeSub: 10, r: 10, strokeW: 5.5, leafY1: 37, leafY2: 19, leafH: 18 }
  };

  const dim = dimensions[size];

  // Colors
  const mainTextColor = lightModeOnly ? "#1a1a1a" : "currentColor";
  const leafColorLeft = "#104f55";
  const leafColorRight = "#166a72";
  const subtitleColor = "#104f55";

  return (
    <div className={`flex flex-col select-none ${className}`}>
      <svg
        width={dim.width}
        height={dim.height}
        viewBox={dim.viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-full"
      >
        {/* KIRING text */}
        <text
          x="12"
          y={dim.textY}
          fontFamily="system-ui, -apple-system, 'Inter', 'Segoe UI', sans-serif"
          fontSize={dim.fontSizeMain}
          fontWeight="900"
          fill={mainTextColor}
          letterSpacing="-0.04em"
        >
          KIRING
        </text>

        {/* Custom Letter O with Leaf */}
        <g>
          {/* Circular O stroke */}
          <circle
            cx="116"
            cy={dim.oY}
            r={dim.r}
            fill="none"
            stroke={mainTextColor}
            strokeWidth={dim.strokeW}
          />
          
          {/* Leaf Shapes inside O */}
          {/* Left half of the leaf */}
          <path
            d={`M 116,${dim.leafY1} C 112.2,${dim.leafY1 - 4} 112.2,${dim.leafY2 + 4} 116,${dim.leafY2} L 116,${dim.leafY1}`}
            fill={leafColorLeft}
          />
          {/* Right half of the leaf */}
          <path
            d={`M 116,${dim.leafY2} C 119.8,${dim.leafY2 + 4} 119.8,${dim.leafY1 - 4} 116,${dim.leafY1} L 116,${dim.leafY2}`}
            fill={leafColorRight}
          />
          {/* Central vein of the leaf */}
          <line
            x1="116"
            y1={dim.leafY1}
            x2="116"
            y2={dim.leafY2}
            stroke="#ffffff"
            strokeWidth="0.65"
          />
        </g>

        {/* Subtitle Waxtaanu Afrik */}
        <text
          x="70"
          y={dim.subtitleY}
          fontFamily="system-ui, -apple-system, 'Inter', 'Segoe UI', sans-serif"
          fontSize={dim.fontSizeSub}
          fontWeight="800"
          fill={subtitleColor}
          textAnchor="middle"
          letterSpacing="0.04em"
        >
          Waxtaanu Afrik
        </text>
      </svg>
    </div>
  );
}
