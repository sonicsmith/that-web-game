import { useThree } from "@react-three/fiber";
import { Ground } from "./Ground";
import { Player } from "./Player";
import { useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";

export function GameView() {
  const groundHeightRef = useRef(0);

  return (
    <>
      {/* <OrbitControls /> */}
      <directionalLight position={[5, 0, 15]} intensity={0.3} castShadow />
      <directionalLight position={[0, 2, 4]} intensity={0.1} />
      <ambientLight intensity={0.6} />
      <Ground groundHeightRef={groundHeightRef} />
      <Player groundHeightRef={groundHeightRef} />
    </>
  );
}
