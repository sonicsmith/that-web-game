import { useFrame } from "@react-three/fiber";
import { GroundSection } from "./GroundSection";
import { Ref, useEffect, useMemo, useRef, useState } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { Vector3 } from "three";
import * as THREE from "three";

const SECTION_SIZE = 20;
const SECTION_POSITIONS: THREE.Vector2[] = [];

const HALF_GRID_SIZE = 2; // Number of sections in each direction

for (let x = -HALF_GRID_SIZE; x <= HALF_GRID_SIZE; x++) {
  for (let y = -HALF_GRID_SIZE; y <= HALF_GRID_SIZE; y++) {
    SECTION_POSITIONS.push(
      new THREE.Vector2(x * SECTION_SIZE, y * SECTION_SIZE)
    );
  }
}

export const Ground = () => {
  const [, get] = useKeyboardControls();

  const sectionPositionsRef = useRef<THREE.Vector2[]>(SECTION_POSITIONS);

  useFrame(() => {
    if (!sectionPositionsRef.current) return;
    const { forward, backward, left, right } = get();
    const movement = new THREE.Vector2(0, 0);
    if (forward) movement.y -= 1;
    if (backward) movement.y += 1;
    if (left) movement.x += 1;
    if (right) movement.x -= 1;
    const newPositions = sectionPositionsRef.current.map((pos) => {
      const newPosition = new THREE.Vector2(
        pos.x + movement.x,
        pos.y + movement.y
      );
      if (movement.x > 0 && newPosition.x > HALF_GRID_SIZE * SECTION_SIZE) {
        newPosition.x =
          -(HALF_GRID_SIZE + 1) * SECTION_SIZE + (newPosition.x % SECTION_SIZE);
      } else if (
        movement.x < 0 &&
        newPosition.x < -HALF_GRID_SIZE * SECTION_SIZE
      ) {
        newPosition.x =
          (HALF_GRID_SIZE + 1) * SECTION_SIZE + (newPosition.x % SECTION_SIZE);
      }
      //
      if (movement.y > 0 && newPosition.y > HALF_GRID_SIZE * SECTION_SIZE) {
        newPosition.y =
          -(HALF_GRID_SIZE + 1) * SECTION_SIZE + (newPosition.y % SECTION_SIZE);
      } else if (
        movement.y < 0 &&
        newPosition.y < -HALF_GRID_SIZE * SECTION_SIZE
      ) {
        newPosition.y =
          (HALF_GRID_SIZE + 1) * SECTION_SIZE + (newPosition.y % SECTION_SIZE);
      }
      //

      return newPosition;
    });
    sectionPositionsRef.current = newPositions;
  });

  return (
    <>
      {SECTION_POSITIONS.map((coordinates, index) => (
        <GroundSection
          key={`${coordinates.x}-${coordinates.y}`}
          sectionPositionsRef={sectionPositionsRef}
          index={index}
          size={SECTION_SIZE}
        />
      ))}
    </>
  );
};
