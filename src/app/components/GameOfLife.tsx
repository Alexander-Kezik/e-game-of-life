import { FC, MutableRefObject, useEffect, useRef } from "react";

import { useGameOfLife } from "@/app/hooks/useGameOfLife";
import { stringToGameOfLifeParams } from "@/app/lib/utils/stringToGameOfLifeParams";

interface IProps {
  match: RegExpExecArray | null;
}

const DrawingCanvas: FC<IProps> = ({ match }) => {
  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef<HTMLCanvasElement | null>(null);
  const { runGameOfLife } = useGameOfLife(canvasRef);

  useEffect(() => {
    if (match && canvasRef.current) {
      const { iterationsCount, initialGameOfLifeState } = stringToGameOfLifeParams(match[1], match[2]);
      runGameOfLife(initialGameOfLifeState, iterationsCount);
    }
  }, [match, runGameOfLife]);

  return <canvas ref={canvasRef}></canvas>;
};

export default DrawingCanvas;