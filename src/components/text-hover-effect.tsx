"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

/**
 * TextHoverEffectBackground
 * 
 * This component is designed to be used as a background effect.
 * It covers its parent container and renders animated, gradient text as a background layer.
 * 
 * Usage: Place this component as the first child of a relatively/absolutely positioned container.
 */
export const TextHoverEffectBackground = ({
  text,
  duration,
  automatic = false,
  className = "",
  style = {},
  paddingX = 12, // default left/right padding in SVG units
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
  style?: React.CSSProperties;
  paddingX?: number; // allow custom horizontal padding
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  // For automatic animation (backgrounds don't always have mouse events)
  useEffect(() => {
    if (automatic) {
      let frame: number;
      let t = 0;
      const animate = () => {
        // Animate mask in a circular path
        const angle = (t / 180) * Math.PI;
        const r = 20; // percent
        setMaskPosition({
          cx: `${50 + Math.cos(angle) * r}%`,
          cy: `${50 + Math.sin(angle) * r}%`,
        });
        t += 1;
        frame = requestAnimationFrame(animate);
      };
      animate();
      return () => cancelAnimationFrame(frame);
    }
  }, [automatic]);

  // Mouse tracking for interactive backgrounds
  useEffect(() => {
    if (!automatic && svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor, automatic]);

  // Styles to make SVG a full background layer
  const backgroundStyles: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: automatic ? "none" : "auto",
    zIndex: 0,
    ...style,
  };

  // Calculate viewBox with horizontal padding
  const viewBoxWidth = 300;
  const viewBoxHeight = 100;
  const leftPad = paddingX;
  const rightPad = paddingX;
  const paddedViewBox = `${0} ${0} ${viewBoxWidth} ${viewBoxHeight}`;
  const textX = viewBoxWidth / 2;
  const textY = viewBoxHeight / 2;
  const textWidth = viewBoxWidth - leftPad - rightPad;

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={paddedViewBox}
      xmlns="http://www.w3.org/2000/svg"
      style={backgroundStyles}
      className={`select-none ${className}`}
      onMouseEnter={() => !automatic && setHovered(true)}
      onMouseLeave={() => !automatic && setHovered(false)}
      onMouseMove={
        !automatic
          ? (e) => setCursor({ x: e.clientX, y: e.clientY })
          : undefined
      }
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          x1={leftPad}
          y1="0"
          x2={viewBoxWidth - rightPad}
          y2={viewBoxHeight}
        >
          <stop offset="0%" stopColor="#eab308" />
          <stop offset="25%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="75%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{
            duration: duration ?? (automatic ? 1.2 : 0.3),
            ease: "easeOut",
          }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      {/* Faint text outline for subtle background effect */}
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-neutral-200 font-[helvetica] text-7xl font-bold dark:stroke-neutral-800"
        style={{
          opacity: 0.15,
          // Add horizontal padding by shrinking textLength
          textLength: textWidth,
          lengthAdjust: "spacingAndGlyphs",
        } as any}
        textLength={textWidth}
        lengthAdjust="spacingAndGlyphs"
      >
        {text}
      </text>
      {/* Animated stroke reveal for background shimmer */}
      <motion.text
        x={textX}
        y={textY}
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-neutral-200 font-[helvetica] text-7xl font-bold dark:stroke-neutral-800"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
        style={{
          opacity: 0.2,
          textLength: textWidth,
          lengthAdjust: "spacingAndGlyphs",
        } as any}
        textLength={textWidth}
        lengthAdjust="spacingAndGlyphs"
      >
        {text}
      </motion.text>
      {/* Main gradient text with mask for background highlight */}
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.4"
        mask="url(#textMask)"
        className="fill-transparent font-[helvetica] text-7xl font-bold"
        style={{
          opacity: 1,
          textLength: textWidth,
          lengthAdjust: "spacingAndGlyphs",
        } as any}
        textLength={textWidth}
        lengthAdjust="spacingAndGlyphs"
      >
        {text}
      </text>
    </svg>
  );
};
