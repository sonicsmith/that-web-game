import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";

const PLANE_RESOLUTION = 100;
const NOISE_LEVEL = 0.2;
const HEIGHT = 0.8;

const noise = createNoise2D();

const generateGround = ({
  mesh,
  offsetX,
  offsetY,
  size,
}: {
  mesh: THREE.Mesh<THREE.BufferGeometry>;
  offsetX: number;
  offsetY: number;
  size: number;
}) => {
  const { geometry } = mesh;
  const { position } = geometry.attributes;
  for (let index = 0; index < position.count; index++) {
    const x = position.getX(index) + offsetX * size;
    const y = position.getY(index) + offsetY * size;
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

export const GroundSection = ({
  offsetX,
  offsetY,
  size,
}: {
  offsetX: number;
  offsetY: number;
  size: number;
}) => {
  const mesh = useRef<THREE.Mesh<THREE.BufferGeometry>>(null);

  useEffect(() => {
    if (mesh.current) {
      generateGround({ mesh: mesh.current, offsetX, offsetY, size });
    }
  }, []);
  console.log("Generating ground section at", offsetX);
  return (
    <mesh ref={mesh} position={[offsetX * size, offsetY * size, 0]}>
      <planeGeometry args={[size, size, PLANE_RESOLUTION, PLANE_RESOLUTION]} />
      <meshStandardMaterial side={THREE.DoubleSide} flatShading vertexColors />
    </mesh>
  );
};
