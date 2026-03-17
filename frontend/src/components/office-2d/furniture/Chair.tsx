import { memo, useMemo } from "react";
import { getChairTex } from "../pixel-assets";

interface ChairProps {
  x: number;
  y: number;
}

export const Chair = memo(function Chair({ x, y }: ChairProps) {
  const tex = useMemo(() => getChairTex(), []);

  return (
    <g transform={`translate(${x}, ${y})`}>
      <image
        href={tex}
        x={-32}
        y={-32}
        width={64}
        height={64}
        style={{ imageRendering: "pixelated" }}
      />
    </g>
  );
});
