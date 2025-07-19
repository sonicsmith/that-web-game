import { Canvas } from "@react-three/fiber";
import { Ground } from "./Ground";
import { Player } from "./Player";

export function GameView() {
  return (
    <div className="w-full h-screen">
      <Canvas>
        {/* <ambientLight intensity={0.5} /> */}
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
        <Ground />
        <Player />
      </Canvas>
    </div>
  );
}
