import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export function Player() {
  const group = useRef(null);
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
  });

  return (
    <group
      ref={group}
      dispose={null}
      position={[0, 0, 5]}
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
          />
          <skinnedMesh
            name="head-mesh"
            geometry={(nodes["head-mesh"] as any).geometry}
            material={materials.colormap}
            skeleton={(nodes["head-mesh"] as any).skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/player.glb");
