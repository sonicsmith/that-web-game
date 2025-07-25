import React, { RefObject, useEffect } from "react";
import {
  useGLTF,
  useAnimations,
  useKeyboardControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group, Object3DEventMap } from "three";

export function Player({
  playerRef,
}: {
  playerRef: RefObject<Group<Object3DEventMap> | null>;
}) {
  const { nodes, materials, animations } = useGLTF("/models/player/model.glb");
  const { actions } = useAnimations(animations, playerRef);

  useEffect(() => {
    if (actions) {
      actions.idle?.play();
    }
  }, []);

  const [, get] = useKeyboardControls();

  useFrame(() => {
    const { forward, backward, left, right } = get();

    let nextAnimation = "idle";
    if (forward || backward || left || right) {
      nextAnimation = "walk";
    }
    if (!actions[nextAnimation]?.isRunning()) {
      const currentAnimation = nextAnimation === "idle" ? "walk" : "idle";
      actions[currentAnimation]?.fadeOut(0.01);
      actions[nextAnimation]?.reset().fadeIn(0.01).play();
    }
    if (!playerRef.current) return;
    const player = playerRef.current;
    // Move Player to top of terrain
    if (left) {
      player.rotateZ(0.05);
    }
    if (right) {
      player.rotateZ(-0.05);
    }
  });

  return (
    <group ref={playerRef} dispose={null} position={[0, 0, 0]}>
      <group name="player" rotation={[Math.PI / 2, Math.PI, 0]}>
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
      <PerspectiveCamera
        makeDefault
        position={[0, -4, 1]}
        rotation={[Math.PI / 2, 0, 0]}
        up={[0, 0, 1]}
      />
    </group>
  );
}

useGLTF.preload("/models/player/model.glb");
