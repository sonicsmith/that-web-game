import { RefObject, useEffect, useRef } from "react";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import alea from "alea";

const PLANE_RESOLUTION = 100;
const NOISE_LEVEL = 0.2;
const HEIGHT = 0.8;

const prng = alea("seed");
const noise = createNoise2D(prng);

const generateGround = ({
  mesh,
  groundCoordinates,
  size,
}: {
  mesh: THREE.Mesh<THREE.BufferGeometry>;
  groundCoordinates: THREE.Vector2;
  size: number;
}) => {
  const { geometry } = mesh;
  const { position } = geometry.attributes;
  for (let index = 0; index < position.count; index++) {
    const x = position.getX(index) + groundCoordinates.x * size;
    const y = position.getY(index) + groundCoordinates.y * size;
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
  offset: THREE.Vector2;
  worldCoordinates: THREE.Vector2;
}

export const GroundSection = ({
  size,
  offset,
  worldCoordinates,
}: GroundSectionProps) => {
  const meshRef = useRef<THREE.Mesh<THREE.BufferGeometry>>(null);

  useEffect(() => {
    if (meshRef.current) {
      const groundCoordinates = new THREE.Vector2(
        worldCoordinates.x + offset.x,
        worldCoordinates.y + offset.y
      );
      generateGround({ mesh: meshRef.current, groundCoordinates, size });
    }
  }, []);

  return (
    <mesh ref={meshRef} position={[offset.x * size, offset.y * size, 0]}>
      <planeGeometry args={[size, size, PLANE_RESOLUTION, PLANE_RESOLUTION]} />
      <meshStandardMaterial side={THREE.DoubleSide} flatShading vertexColors />
    </mesh>
  );
};
