import { useFrame } from "@react-three/fiber";
import { GroundSection } from "./GroundSection";
import { Ref, useMemo, useRef, useState } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { Vector3 } from "three";
import * as THREE from "three";

const SECTION_SIZE = 20;

const SECTION_MAP = [
  new THREE.Vector2(-1, -1),
  new THREE.Vector2(0, -1),
  new THREE.Vector2(1, -1),
  new THREE.Vector2(-1, 0),
  new THREE.Vector2(0, 0),
  new THREE.Vector2(1, 0),
  new THREE.Vector2(-1, 1),
  new THREE.Vector2(0, 1),
  new THREE.Vector2(1, 1),
];

export const Ground = () => {
  const [, get] = useKeyboardControls();

  const groundRef = useRef<THREE.Mesh<THREE.BufferGeometry>>(null);
  const [worldCoordinates, setWorldCoordinates] = useState(
    new THREE.Vector2(0, 0)
  );

  useFrame(() => {
    if (!groundRef.current) return;
    const { forward, backward, left, right } = get();
    const direction = new Vector3();
    if (forward) direction.y -= 1;
    if (backward) direction.y += 1;
    if (left) direction.x += 1;
    if (right) direction.x -= 1;
    groundRef.current.position.add(direction.normalize().multiplyScalar(0.5));

    //
    const absoluteXOffset = Math.abs(groundRef.current.position.x);
    const newWorldOffset = new THREE.Vector2(0, 0);
    if (absoluteXOffset > SECTION_SIZE / 2) {
      if (groundRef.current.position.x > 0) {
        newWorldOffset.x = 0.5;
      } else {
        newWorldOffset.x = -0.5;
      }
      groundRef.current.position.x = 0;
    }
    const absoluteYOffset = Math.abs(groundRef.current.position.y);
    if (absoluteYOffset > SECTION_SIZE / 2) {
      if (groundRef.current.position.y > 0) {
        newWorldOffset.y = -0.5;
      } else {
        newWorldOffset.y = 0.5;
      }
      groundRef.current.position.y = 0;
    }

    if (newWorldOffset.x !== 0 || newWorldOffset.y !== 0) {
      setWorldCoordinates(newWorldOffset.add(worldCoordinates));
    }
  });

  console.log("Ground", worldCoordinates.x, worldCoordinates.y);

  return (
    <group ref={groundRef}>
      {SECTION_MAP.map((coordinates) => (
        <GroundSection
          key={`${coordinates.x}-${coordinates.y}`}
          offset={coordinates}
          worldCoordinates={worldCoordinates}
          size={SECTION_SIZE}
        />
      ))}
    </group>
  );
};
