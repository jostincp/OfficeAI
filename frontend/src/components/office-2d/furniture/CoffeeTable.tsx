import { memo, useMemo } from "react";
import { getCoffeeTableTex } from "../pixel-assets";

interface CoffeeTableProps {
  x: number;
  y: number;
}

export const CoffeeTable = memo(function CoffeeTable({ x, y }: CoffeeTableProps) {
  const tex = useMemo(() => getCoffeeTableTex(), []);

  return (
    <g transform={`translate(${x}, ${y})`}>
      <image
        href={tex}
        x={-64}
        y={-32}
        width={128}
        height={64}
        style={{ imageRendering: "pixelated" }}
      />
    </g>
  );
});
