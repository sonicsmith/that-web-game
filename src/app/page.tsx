"use client";

import { GameView } from "@/components/GameView";
import { KeyboardControls, KeyboardControlsEntry } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
// import dynamic from "next/dynamic";
// const GameView = dynamic(() => import("@/components/GameView"), { ssr: false });
import { Suspense, useMemo } from "react";

export default function Home() {
  return (
    <div>
      <Suspense fallback={null}>
        <KeyboardControls
          map={useMemo<KeyboardControlsEntry[]>(
            () => [
              { name: "forward", keys: ["ArrowUp", "KeyW"] },
              { name: "backward", keys: ["ArrowDown", "KeyS"] },
              { name: "left", keys: ["ArrowLeft", "KeyA"] },
              { name: "right", keys: ["ArrowRight", "KeyD"] },
            ],
            []
          )}
        >
          <div className="w-full h-screen">
            <Canvas>
              <GameView />
            </Canvas>
          </div>
        </KeyboardControls>
      </Suspense>
    </div>
  );
}
