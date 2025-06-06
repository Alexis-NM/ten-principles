import { forwardRef, useRef, useEffect, useCallback } from "react";
import "./Overlay.css";

const principles = [
  {
    rest: "is innovative.",
    description:
      "The possibilities for innovation are not, by any means, exhausted. Technological development is always offering new opportunities for innovative design. But innovative design always develops in tandem with innovative technology, and can never be an end in itself.",
  },
  {
    rest: "makes a product useful.",
    description:
      "A product is bought to be used. It has to satisfy certain criteria, not only functional, but also psychological and aesthetic. Good design emphasizes the usefulness of a product whilst disregarding anything that could possibly detract from it.",
  },
  {
    rest: "is aesthetic.",
    description:
      "The aesthetic quality of a product is integral to its usefulness because products we use every day affect our person and our well-being. But only well-executed objects can be beautiful.",
  },
  {
    rest: "makes a product understandable.",
    description:
      "It clarifies the product’s structure. Better still, it can make the product talk. At best, it is self-explanatory.",
  },
  {
    rest: "is unobtrusive.",
    description:
      "Products fulfilling a purpose are like tools. They are neither decorative objects nor works of art. Their design should therefore be both neutral and restrained to leave room for the user’s self-expression.",
  },
  {
    rest: "is honest.",
    description:
      "It does not make a product more innovative, powerful or valuable than it really is. It does not attempt to manipulate the consumer with promises that cannot be kept.",
  },
  {
    rest: "is long-lasting.",
    description:
      "It avoids being fashionable and therefore never appears antiquated. Unlike fashionable design, it lasts many years – even in today’s throwaway society.",
  },
  {
    rest: "is thorough down to the last detail.",
    description:
      "Nothing must be arbitrary or left to chance. Care and accuracy in the design process show respect toward the user.",
  },
  {
    rest: "is environmentally friendly.",
    description:
      "Design makes an important contribution to the preservation of the environment. It conserves resources and minimizes physical and visual pollution throughout the lifecycle of the product.",
  },
  {
    rest: "is as little design as possible.",
    description:
      "Less, but better – because it concentrates on the essential aspects, and the products are not burdened with non-essentials. Back to purity, back to simplicity.",
  },
];
const Overlay = forwardRef(({ caption, scroll }, ref) => {
  const containerRef = ref;
  const fixedRef = useRef(null);

  // calcule et applique le padding-top de .scroll
  const updatePadding = useCallback(() => {
    if (!fixedRef.current || !containerRef.current) return;
    const titleHeight = fixedRef.current.getBoundingClientRect().height;
    const fontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    containerRef.current.style.paddingTop = `${titleHeight + fontSize}px`;
  }, [containerRef]);

  useEffect(() => {
    updatePadding();
    window.addEventListener("resize", updatePadding);
    return () => window.removeEventListener("resize", updatePadding);
  }, [updatePadding]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // pour le snap, on enregistre les offsets
    const sections = Array.from(container.children).filter(
      (el) => !el.classList.contains("caption")
    );
    const sectionTops = sections.map((sec) => sec.offsetTop);

    let scrollEndTimer = null;
    const onScroll = () => {
      // recalcul du pourcentage & index
      const st = container.scrollTop;
      scroll.current = st / (container.scrollHeight - window.innerHeight);
      const idx = Math.min(
        principles.length - 1,
        Math.floor(scroll.current * principles.length)
      );
      // mise à jour titre et compteur
      fixedRef.current.querySelector("span:last-child").innerText =
        principles[idx].rest;
      caption.current.innerText = idx + 1;

      // on recalcule le padding si le titre a changé de hauteur
      updatePadding();

      // snap
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        let nearest = 0,
          md = Infinity;
        sectionTops.forEach((top, i) => {
          const d = Math.abs(top - st);
          if (d < md) {
            md = d;
            nearest = i;
          }
        });
        container.scrollTo({ top: sectionTops[nearest], behavior: "smooth" });
      }, 50);
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [containerRef, scroll, caption, updatePadding]);

  return (
    <>
      <section className="fixed-title" ref={fixedRef}>
        <h1>
          <span className="highlight">Good design</span>{" "}
          <span>{principles[0].rest}</span>
        </h1>
      </section>
      <section ref={containerRef} className="scroll">
        {principles.map((p, i) => (
          <article key={i} className="section">
            <div className="dot">
              <p>{p.description}</p>
            </div>
          </article>
        ))}
        <span className="caption" ref={caption}>
          1
        </span>
      </section>
    </>
  );
});

export default Overlay;
