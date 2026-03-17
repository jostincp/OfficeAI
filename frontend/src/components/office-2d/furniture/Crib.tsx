import { memo, useMemo } from "react";
import { getCribTex } from "../pixel-assets";

interface CribProps {
  x: number;
  y: number;
}

export const Crib = memo(function Crib({ x, y }: CribProps) {
  const tex = useMemo(() => getCribTex(), []);

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
