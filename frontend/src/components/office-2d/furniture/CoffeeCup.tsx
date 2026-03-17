import { memo } from "react";

interface CoffeeCupProps {
  x: number;
  y: number;
}

export const CoffeeCup = memo(function CoffeeCup({ x, y }: CoffeeCupProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Shadow */}
      <ellipse cx="2" cy="6" rx="8" ry="3" fill="#000" opacity="0.2" />
      
      {/* Cup handle */}
      <rect x="6" y="-2" width="6" height="8" fill="none" stroke="#e2e8f0" strokeWidth="2" rx="2" />
      
      {/* Cup body */}
      <rect x="-6" y="-4" width="12" height="10" fill="#f8fafc" stroke="#a0aec0" strokeWidth="1" rx="2" />
      
      {/* Cup rim / opening */}
      <ellipse cx="0" cy="-4" rx="6" ry="2" fill="#fff" stroke="#a0aec0" strokeWidth="1" />
      
      {/* Coffee inside */}
      <ellipse cx="0" cy="-4" rx="4" ry="1.5" fill="#5c2e0b" />
      
      {/* Steam lines */}
      <path d="M-2 -8 Q -4 -12 -2 -14" fill="none" stroke="#fff" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
      <path d="M2 -9 Q 4 -13 2 -15" fill="none" stroke="#fff" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
    </g>
  );
});
