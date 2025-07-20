import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export function Player() {
  const group = useRef(null);
  const { nodes, materials, animations } = useGLTF("/models/player.glb");
  const { actions } = useAnimations(animations, group);

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
