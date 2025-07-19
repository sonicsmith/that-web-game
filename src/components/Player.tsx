import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import {
  BufferGeometry,
  Group,
  MathUtils,
  Mesh,
  Object3DEventMap,
  Vector3,
} from "three";

const SPEED = 1;

export const Player = () => {
  const ref = useRef<Mesh<BufferGeometry>>(null);

  const [, get] = useKeyboardControls();

  useFrame(({ camera }) => {
    if (ref.current) {
      const { forward, backward, left, right } = get();
      const direction = new Vector3();
      if (forward) {
        direction.y += 1;
      }
      if (backward) {
        direction.y -= 1;
      }
      if (left) {
        direction.x -= 1;
      }
      if (right) {
        direction.x += 1;
      }
      ref.current.position.add(direction.normalize().multiplyScalar(SPEED));
      // Update camera position to follow the player
      camera.position.copy(ref.current.position);
      camera.position.z += 40;
      // camera.position.y -= 6;
      camera.lookAt(ref.current.position);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};
