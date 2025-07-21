import { RigidBody } from "@react-three/rapier";
import { GroundSection } from "./GroundSection";
import * as THREE from "three";
import { RefObject } from "react";

const SECTION_SIZE = 20;
const SECTION_POSITIONS: THREE.Vector2[] = [];

const HALF_GRID_SIZE = 3;

for (let x = -HALF_GRID_SIZE; x <= HALF_GRID_SIZE; x++) {
  for (let y = -HALF_GRID_SIZE; y <= HALF_GRID_SIZE; y++) {
    SECTION_POSITIONS.push(
      new THREE.Vector2(x * SECTION_SIZE, y * SECTION_SIZE)
    );
  }
}

export const Ground = ({
  groundHeightRef,
}: {
  groundHeightRef: RefObject<number>;
}) => {
  return (
    <>
      {SECTION_POSITIONS.map((coordinates, index) => (
        <GroundSection
          key={`${coordinates.x}-${coordinates.y}`}
          sectionPosition={SECTION_POSITIONS[index]}
          size={SECTION_SIZE}
          boundsRadius={HALF_GRID_SIZE}
          groundHeightRef={groundHeightRef}
        />
      ))}
    </>
  );
};
