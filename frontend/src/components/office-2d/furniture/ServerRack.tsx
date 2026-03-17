import { getServerRackTex } from "../pixel-assets";

interface ServerRackProps {
  x: number;
  y: number;
}

export function ServerRack({ x, y }: ServerRackProps) {
  const tex = getServerRackTex();
  return (
    <image
      href={tex}
      x={x}
      y={y}
      width={120}
      height={120}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
