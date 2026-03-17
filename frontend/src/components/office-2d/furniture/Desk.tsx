import { memo, useMemo } from "react";
import { getDeskTex } from "../pixel-assets";

interface DeskProps {
  x: number;
  y: number;
}

export const Desk = memo(function Desk({ x, y }: DeskProps) {
  const tex = useMemo(() => getDeskTex(), []);

  return (
    <g transform={`translate(${x}, ${y})`}>
      <image
        href={tex}
        x={-64}
        y={-64}
        width={128}
        height={128}
        style={{ imageRendering: "pixelated" }}
      />
    </g>
  );
});
