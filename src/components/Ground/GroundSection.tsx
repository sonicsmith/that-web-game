import { RefObject, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import alea from "alea";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";

const PLANE_RESOLUTION = 50;
const NOISE_LEVEL = 0.05;
const HEIGHT = 2;
const GROUND_COLOR = { r: 255 / 255, g: 176 / 255, b: 110 / 255 };
const GRASS_COLOR = { r: 71 / 255, g: 196 / 255, b: 76 / 255 };
const SPEED = 0.05;

const prng = alea("seed");
const noise = createNoise2D(prng);

const regenerateTerrain = ({
  mesh,
  worldPosition,
}: {
  mesh: THREE.Mesh<THREE.BufferGeometry>;
  worldPosition: THREE.Vector2;
}) => {
  const { geometry } = mesh;
  const { position } = geometry.attributes;
  // Generate Terrain Mesh
  for (let index = 0; index < position.count; index++) {
    const x = position.getX(index) + worldPosition.x;
    const y = position.getY(index) + worldPosition.y;
    const amplitude = noise(x * NOISE_LEVEL, y * NOISE_LEVEL);
    position.array[index * 3 + 2] = amplitude * HEIGHT;
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  // Color Mesh
  const posAttr = geometry.attributes.position;
  const colors = [];
  for (let i = 0; i < posAttr.count; i += 3) {
    for (let j = 0; j < 3; j++) {
      const color = (position.array[i * 3 + 2] + 1) / 2 + 0.6;
      const tinge = color > 1 ? GRASS_COLOR : GROUND_COLOR;
      colors.push(color * tinge.r, color * tinge.g, color * tinge.b);
    }
  }
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
};

const getHeightAtPlayer = (mesh: THREE.Mesh) => {
  mesh.updateMatrixWorld(true);

  const raycaster = new THREE.Raycaster();
  const rayOrigin = new THREE.Vector3(0, 0, 10);
  const rayDirection = new THREE.Vector3(0, 0, -1);

  raycaster.set(rayOrigin, rayDirection);

  const intersects = raycaster.intersectObject(mesh, true);

  if (intersects.length > 0) {
    return intersects[0].point.z;
  }

  return null;
};

interface GroundSectionProps {
  size: number;
  boundsRadius: number;
  sectionPosition: THREE.Vector2;
  groundHeightRef: RefObject<number>;
}

export const GroundSection = ({
  size,
  boundsRadius,
  sectionPosition,
  groundHeightRef,
}: GroundSectionProps) => {
  const meshRef = useRef<THREE.Mesh<THREE.BufferGeometry>>(null);
  const worldPositionRef = useRef(new THREE.Vector2(0, 0));

  const [, get] = useKeyboardControls();

  useEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.position.x = sectionPosition.x;
    meshRef.current.position.y = sectionPosition.y;
    worldPositionRef.current = sectionPosition;
    regenerateTerrain({
      mesh: meshRef.current,
      worldPosition: sectionPosition,
    });
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    const { forward, backward, left, right } = get();
    const movement = new THREE.Vector3(0, 0, 0);
    if (forward) movement.y -= SPEED;
    if (backward) movement.y += SPEED;
    if (left) movement.x += SPEED;
    if (right) movement.x -= SPEED;
    // Return if no movement
    if (!movement.length()) return;
    // Work out new position
    const newPosition = meshRef.current.position.clone().add(movement);
    const worldSectionOffsetUpdate = new THREE.Vector2(0, 0);
    if (movement.x > 0 && newPosition.x > (boundsRadius + 1) * size) {
      newPosition.x = -boundsRadius * size + (newPosition.x % size);
      worldSectionOffsetUpdate.x -= boundsRadius * 2 + 1;
    } else if (movement.x < 0 && newPosition.x < -(boundsRadius + 1) * size) {
      newPosition.x = boundsRadius * size + (newPosition.x % size);
      worldSectionOffsetUpdate.x += boundsRadius * 2 + 1;
    }
    if (movement.y > 0 && newPosition.y > (boundsRadius + 1) * size) {
      newPosition.y = -boundsRadius * size + (newPosition.y % size);
      worldSectionOffsetUpdate.y -= boundsRadius * 2 + 1;
    } else if (movement.y < 0 && newPosition.y < -(boundsRadius + 1) * size) {
      newPosition.y = boundsRadius * size + (newPosition.y % size);
      worldSectionOffsetUpdate.y += boundsRadius * 2 + 1;
    }
    meshRef.current.position.x = newPosition.x;
    meshRef.current.position.y = newPosition.y;
    // Do we need to regenerate the terrain?
    if (worldSectionOffsetUpdate.length()) {
      const newWorldPosition = worldSectionOffsetUpdate
        .clone()
        .multiplyScalar(size)
        .add(worldPositionRef.current);
      worldPositionRef.current = newWorldPosition;
      regenerateTerrain({
        mesh: meshRef.current,
        worldPosition: worldPositionRef.current,
      });
    }
    // Work out player height
    const height = getHeightAtPlayer(meshRef.current);
    if (height !== null) {
      groundHeightRef.current = height;
    }
  });

  return (
    <mesh ref={meshRef} receiveShadow>
      <planeGeometry args={[size, size, PLANE_RESOLUTION, PLANE_RESOLUTION]} />
      <meshStandardMaterial side={THREE.DoubleSide} flatShading vertexColors />
    </mesh>
  );
};
