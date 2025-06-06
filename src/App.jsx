import { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import IntroOverlay from "./IntroOverlay";
import Model from "./Model";
import Overlay from "./Overlay";

function App() {
  const overlay = useRef();
  const caption = useRef();
  const scroll = useRef(0);
  const [showIntro, setShowIntro] = useState(true);

  const handleOpen = () => {
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <IntroOverlay onOpen={handleOpen} />}
      <Canvas
        shadows
        eventSource={document.getElementById("root")}
        eventPrefix="client"
      >
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <Model scroll={scroll} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      <Overlay ref={overlay} caption={caption} scroll={scroll} />
    </>
  );
}

export default App;
