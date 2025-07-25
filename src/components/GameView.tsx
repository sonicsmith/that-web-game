import { Ground } from "./Ground";
import { Player } from "./Player";
import { useRef } from "react";
import { Group, Object3DEventMap } from "three";

export function GameView() {
  const playerRef = useRef<Group<Object3DEventMap>>(null);

  return (
    <>
      <directionalLight position={[5, 0, 15]} intensity={1.3} castShadow />
      <directionalLight position={[0, 2, 4]} intensity={1.1} />
      <ambientLight intensity={0.6} />
      <Ground playerRef={playerRef} />
      <Player playerRef={playerRef} />
    </>
  );
}
