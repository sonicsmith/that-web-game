import { RefObject, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import alea from "alea";
import { useFrame } from "@react-three/fiber";

const PLANE_RESOLUTION = 100;
const NOISE_LEVEL = 0.2;
const HEIGHT = 1;

const prng = alea("seed");
const noise = createNoise2D(prng);

const generateGround = ({
  mesh,
  groundCoordinates,
}: {
  mesh: THREE.Mesh<THREE.BufferGeometry>;
  groundCoordinates: THREE.Vector2;
}) => {
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
  sectionPositionsRef: RefObject<THREE.Vector2[]>;
  index: number;
}

export const GroundSection = ({
  size,
  sectionPositionsRef,
  index,
}: GroundSectionProps) => {
  const ref = useRef<THREE.Mesh<THREE.BufferGeometry>>(null);

  useEffect(() => {
    if (ref.current) {
      const groundCoordinates = sectionPositionsRef.current[index];
      generateGround({ mesh: ref.current, groundCoordinates });
    }
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.x = sectionPositionsRef.current[index].x;
      ref.current.position.y = sectionPositionsRef.current[index].y;
    }
  });

  return (
    <mesh
      ref={ref}
      position={[
        sectionPositionsRef.current[index].x,
        sectionPositionsRef.current[index].y,
        0,
      ]}
    >
      <planeGeometry args={[size, size, PLANE_RESOLUTION, PLANE_RESOLUTION]} />
      <meshStandardMaterial side={THREE.DoubleSide} flatShading vertexColors />
    </mesh>
  );
};
