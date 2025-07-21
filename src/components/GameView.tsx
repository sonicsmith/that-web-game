import { useThree } from "@react-three/fiber";
import { Ground } from "./Ground";
import { Player } from "./Player";
import { useEffect } from "react";

export function GameView() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, -4, 7);
    camera.lookAt(0, 5, 0);
  }, [camera]);

  return (
    <>
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      <ambientLight intensity={0.5} />
      <Ground />
      <Player />
    </>
  );
}
