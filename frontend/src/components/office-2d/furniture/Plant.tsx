import { memo, useMemo } from "react";
import { getPlantTex } from "../pixel-assets";

interface PlantProps {
  x: number;
  y: number;
}

export const Plant = memo(function Plant({ x, y }: PlantProps) {
  const tex = useMemo(() => getPlantTex(), []);

  return (
    <g transform={`translate(${x}, ${y})`}>
      <image
        href={tex}
        x={-32}
        y={-64}
        width={64}
        height={128}
        style={{ imageRendering: "pixelated" }}
      />
    </g>
  );
});
