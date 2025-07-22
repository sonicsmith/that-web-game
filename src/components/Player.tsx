import React, { RefObject, useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group, Object3DEventMap } from "three";

export function Player({
  groundHeightRef,
}: {
  groundHeightRef: RefObject<number>;
}) {
  const group = useRef<Group<Object3DEventMap>>(null);
  const { nodes, materials, animations } = useGLTF("/models/player.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      actions.idle?.play();
    }
  }, []);

  const [, get] = useKeyboardControls();

  useFrame(() => {
    const { forward, backward, left, right } = get();
    const isMoving = forward || backward || left || right;
    let nextAnimation = "idle";
    if (isMoving) {
      nextAnimation = "walk";
    }
    if (!actions[nextAnimation]?.isRunning()) {
      const currentAnimation = nextAnimation === "idle" ? "walk" : "idle";
      actions[currentAnimation]?.fadeOut(0.01);
      actions[nextAnimation]?.reset().fadeIn(0.01).play();
    }
    if (!group.current) return;
    if (groundHeightRef.current) {
      group.current.position.z = groundHeightRef.current;
    }
  });

  return (
    <group
      ref={group}
      dispose={null}
      position={[0, 0, 2]}
      rotation={[Math.PI / 2, Math.PI, 0]}
    >
      <group name="player">
        <group name="player_1">
          <primitive object={nodes.root} />
          <skinnedMesh
            name="body-mesh"
            geometry={(nodes["body-mesh"] as any).geometry}
            material={materials.colormap}
            skeleton={(nodes["body-mesh"] as any).skeleton}
            castShadow
          />
          <skinnedMesh
            name="head-mesh"
            geometry={(nodes["head-mesh"] as any).geometry}
            material={materials.colormap}
            skeleton={(nodes["head-mesh"] as any).skeleton}
            castShadow
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/player.glb");
