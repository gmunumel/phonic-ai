import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";
import styles from "./SequenceDiagram.module.css";

mermaid.initialize({});

const SequenceDiagram: React.FC<{ diagram: string; id: string }> = ({
  diagram,
  id,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeMermaid = async () => {
      if (ref.current) {
        ref.current.innerHTML = diagram;
        const { svg, bindFunctions } = await mermaid.render(
          `mermaid-diagram-${id}`,
          diagram
        );
        ref.current.innerHTML = svg;
        bindFunctions?.(ref.current);
      }
    };

    initializeMermaid();

    return () => {};
  }, [diagram, id]);

  return (
    <div id={id} className={styles.diagramContainer}>
      <h2>Sequence Diagram</h2>
      <div ref={ref} />
    </div>
  );
};

export default SequenceDiagram;
