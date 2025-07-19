import { useFrame } from "@react-three/fiber";
import { GroundSection } from "./GroundSection";
import { useMemo, useRef, useState } from "react";

const SECTION_SIZE = 20;

const SECTION_MAP = [
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 0 },
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
];

export const Ground = () => {
  const [totalOffset, setTotalOffset] = useState({ x: 0, y: 0 });

  console.log("totalOffset", totalOffset.x);
  useFrame(({ camera }) => {
    const offsetX = Math.floor(camera.position.x / SECTION_SIZE);
    const offsetY = Math.floor(camera.position.y / SECTION_SIZE);
    if (offsetX !== totalOffset.x || offsetY !== totalOffset.y) {
      setTotalOffset({ x: offsetX, y: offsetY });
    }
  });

  return (
    <>
      {SECTION_MAP.map(({ x, y }) => (
        <GroundSection
          key={`${x}-${y}`}
          offsetX={x + totalOffset.x}
          offsetY={y + totalOffset.y}
          size={SECTION_SIZE}
        />
      ))}
    </>
  );
};
