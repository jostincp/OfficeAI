import { memo } from "react";

interface MeetingTableProps {
  x: number;
  y: number;
  radius?: number;
}

export const MeetingTable = memo(function MeetingTable({
  x,
  y,
  radius = 100,
}: MeetingTableProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="10" rx={radius + 4} ry={radius * 0.5 + 4} fill="#000" opacity="0.2" />
      
      <rect x="-40" y="0" width="10" height={radius * 0.5 + 10} fill="#3e1d04" />
      <rect x="30" y="0" width="10" height={radius * 0.5 + 10} fill="#3e1d04" />
      
      <ellipse cx="0" cy="6" rx={radius} ry={radius * 0.5} fill="#5c2e0b" />
      <ellipse cx="0" cy="0" rx={radius} ry={radius * 0.5} fill="#a45a20" stroke="#5c2e0b" strokeWidth="2" />
      
      <ellipse cx="0" cy="0" rx={radius - 10} ry={radius * 0.5 - 5} fill="none" stroke="#8b4513" strokeWidth="2" opacity="0.5" />
      
      <rect x="-20" y="-10" width="16" height="20" fill="#fff" stroke="#1a202c" strokeWidth="1" transform="rotate(-15, -12, 0)" />
      <rect x="-15" y="-8" width="16" height="20" fill="#fff" stroke="#1a202c" strokeWidth="1" transform="rotate(-5, -7, 2)" />
      <rect x="25" y="5" width="20" height="14" fill="#a0aec0" stroke="#1a202c" strokeWidth="1" rx="1" transform="rotate(20, 35, 12)" />
      <rect x="27" y="7" width="16" height="10" fill="#2d3748" transform="rotate(20, 35, 12)" />
    </g>
  );
});
