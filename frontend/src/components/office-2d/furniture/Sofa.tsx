import { memo, useMemo } from "react";
import { getSofaTex } from "../pixel-assets";

interface SofaProps {
  x: number;
  y: number;
  rotation?: number;
}

export const Sofa = memo(function Sofa({ x, y, rotation = 0 }: SofaProps) {
  const tex = useMemo(() => getSofaTex(), []);

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
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
