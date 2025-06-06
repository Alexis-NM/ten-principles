import { useRef, useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";

export default function Cursor3D() {
  const ref = useRef();
  const { viewport } = useThree();
  const [pointer, setPointer] = useState([0, 0]);

  useEffect(() => {
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      setPointer([x, y]);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // 2) À chaque frame, on repositionne le mesh
  useFrame(() => {
    const [mx, my] = pointer;
    const x = (mx * viewport.width) / 2;
    const y = (my * viewport.height) / 2;
    if (ref.current) ref.current.position.set(x, y, 0);
  });

  return (
    <mesh ref={ref} renderOrder={999} raycast={() => null}>
      <circleBufferGeometry args={[0.05, 32]} />
      <meshBasicMaterial color="orange" depthTest={false} depthWrite={false} />
    </mesh>
  );
}
