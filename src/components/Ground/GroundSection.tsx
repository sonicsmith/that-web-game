import { RefObject, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import alea from "alea";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";

const PLANE_RESOLUTION = 100;
const NOISE_LEVEL = 0.05;
const HEIGHT = 2;

const prng = alea("seed");
const noise = createNoise2D(prng);

const regenerateTerrain = ({
  ref,
  groundCoordinates,
}: {
  ref: RefObject<THREE.Mesh<THREE.BufferGeometry> | null>;
  groundCoordinates: THREE.Vector2;
}) => {
  const mesh = ref.current;
  if (!mesh) return;
  const { geometry } = mesh;
  const { position } = geometry.attributes;
  for (let index = 0; index < position.count; index++) {
    const x = position.getX(index) + groundCoordinates.x;
    const y = position.getY(index) + groundCoordinates.y;
    const amplitude = noise(x * NOISE_LEVEL, y * NOISE_LEVEL);
    position.array[index * 3 + 2] = amplitude * HEIGHT;
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  //
  const posAttr = geometry.attributes.position;
  const colors = [];

  for (let i = 0; i < posAttr.count; i += 3) {
    for (let j = 0; j < 3; j++) {
      const color = 0.5; //(position.array[i * 3 + 2] + 1) / 2;
      colors.push(color, color, color);
    }
  }
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
};

interface GroundSectionProps {
  size: number;
  boundsRadius: number;
  sectionPosition: THREE.Vector2;
}

export const GroundSection = ({
  size,
  boundsRadius,
  sectionPosition,
}: GroundSectionProps) => {
  const ref = useRef<THREE.Mesh<THREE.BufferGeometry>>(null);
  const worldPosition = useRef(new THREE.Vector2(0, 0));

  const [, get] = useKeyboardControls();

  useEffect(() => {
    if (ref.current) {
      const groundCoordinates = new THREE.Vector2(
        sectionPosition.x,
        sectionPosition.y
      );
      regenerateTerrain({ ref, groundCoordinates });
      ref.current.position.x = sectionPosition.x;
      ref.current.position.y = sectionPosition.y;
      worldPosition.current = sectionPosition;
    }
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const { forward, backward, left, right } = get();
    const movement = new THREE.Vector3(0, 0, 0);
    if (forward) movement.y -= 1;
    if (backward) movement.y += 1;
    if (left) movement.x += 1;
    if (right) movement.x -= 1;

    const newPosition = ref.current.position.clone().add(movement);
    const worldSectionOffsetUpdate = new THREE.Vector2(0, 0);
    if (movement.x > 0 && newPosition.x > (boundsRadius + 1) * size) {
      newPosition.x = -boundsRadius * size + (newPosition.x % size);
      worldSectionOffsetUpdate.x -= boundsRadius * 2 + 1;
    } else if (movement.x < 0 && newPosition.x < -(boundsRadius + 1) * size) {
      newPosition.x = boundsRadius * size + (newPosition.x % size);
      worldSectionOffsetUpdate.x += boundsRadius * 2 + 1;
    }
    //
    if (movement.y > 0 && newPosition.y > (boundsRadius + 1) * size) {
      newPosition.y = -boundsRadius * size + (newPosition.y % size);
      worldSectionOffsetUpdate.y -= boundsRadius * 2 + 1;
    } else if (movement.y < 0 && newPosition.y < -(boundsRadius + 1) * size) {
      newPosition.y = boundsRadius * size + (newPosition.y % size);
      worldSectionOffsetUpdate.y += boundsRadius * 2 + 1;
    }
    ref.current.position.x = newPosition.x;
    ref.current.position.y = newPosition.y;
    if (worldSectionOffsetUpdate.length()) {
      const newWorldPosition = worldSectionOffsetUpdate
        .clone()
        .multiplyScalar(size)
        .add(worldPosition.current);
      worldPosition.current = newWorldPosition;
      regenerateTerrain({ ref, groundCoordinates: worldPosition.current });
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[size, size, PLANE_RESOLUTION, PLANE_RESOLUTION]} />
      <meshStandardMaterial side={THREE.DoubleSide} flatShading vertexColors />
    </mesh>
  );
};
