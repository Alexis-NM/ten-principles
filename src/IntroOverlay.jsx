import { useState, useRef, useEffect } from "react";
import "./IntroOverlay.css";

function IntroOverlay({ onOpen }) {
  const INITIAL_SIZE = 120;
  const [size, setSize] = useState(INITIAL_SIZE);
  const [lifted, setLifted] = useState(false);
  const intervalRef = useRef(null);

  const handleMouseDown = () => {
    if (intervalRef.current || lifted) return;
    intervalRef.current = setInterval(() => {
      setSize((s) => {
        if (s <= 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setLifted(true);
          return 0;
        }
        return s - 1;
      });
    }, 10);
  };

  const handleMouseUp = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setSize(INITIAL_SIZE);
    }
  };

  useEffect(() => {
    if (!lifted) return;
    const timer = setTimeout(() => {
      onOpen();
    }, 600); // doit correspondre à la durée CSS de la transition (voir plus bas)
    return () => clearTimeout(timer);
  }, [lifted, onOpen]);

  return (
    <section
      className={`intro-overlay${lifted ? " lifted" : ""}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      <article className="intro-texts">
        <h1>10 Principles for Good Design</h1>
        <p>Dieter Rams</p>
      </article>
      <div className="intro-button" style={{ width: size, height: size }} />
    </section>
  );
}

export default IntroOverlay;
