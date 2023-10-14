import { MutableRefObject, useEffect, useState } from "react";

interface GameOfLifeHookResult {
  runGameOfLife: (initialState: (0 | 1)[][], iterationsCount: number) => void;
}

export function useGameOfLife(canvasRef: MutableRefObject<HTMLCanvasElement | null>): GameOfLifeHookResult {
  const [output, setOutput] = useState<(0 | 1)[][] | null>(null);

  const runGameOfLife = (initialState: (0 | 1)[][], iterationsCount: number) => {
    const worker = new Worker("/worker.js");
    worker.postMessage({ initialState, iterationsCount });

    worker.onmessage = (event: MessageEvent<(0 | 1)[][]>) => {
      const result: (0 | 1)[][] = event.data;
      setOutput(result);
      worker.terminate();
    };
  };

  useEffect(() => {
    if (output && canvasRef.current) {
      const canvas: HTMLCanvasElement = canvasRef.current;
      const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

      if (ctx) {
        const numRows: number = output.length;
        const numCols: number = output[0].length;

        const canvasWidth: number = 200;
        const canvasHeight: number = 200;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const cellWidth: number = canvasWidth / numCols;
        const cellHeight: number = canvasHeight / numRows;

        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            ctx.fillStyle = output[i][j] ? "black" : "white";
            ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
          }
        }
      }
    }
  }, [canvasRef, output]);

  return { runGameOfLife };
}