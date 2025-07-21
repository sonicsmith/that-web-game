import { useThree } from "@react-three/fiber";
import { Ground } from "./Ground";
import { Player } from "./Player";
import { useEffect, useRef } from "react";

export function GameView() {
  const { camera } = useThree();
  const groundHeightRef = useRef(0);

  useEffect(() => {
    camera.position.set(0, -3, 3);
    camera.lookAt(0, 5, 0);
  }, [camera]);

  return (
    <>
      <directionalLight position={[0, 0, 15]} intensity={0.3} castShadow />
      <directionalLight position={[0, -5, 15]} intensity={0.3} castShadow />
      <ambientLight intensity={0.5} />
      <Ground groundHeightRef={groundHeightRef} />
      <Player groundHeightRef={groundHeightRef} />
    </>
  );
}
